import React, { Component } from "react";
import InsertToolbar from "../components/editor/insertToolbar"; // Editor Toolbar (floated)
import EditorComponent from "../components/editor/EditorComponent";
import { convertToRaw } from "draft-js";
import { draftToMarkdown } from "../libs/markdown-draft-js";
// import Modal from "react-modal"; => 안 씀.
import { Button, Header, Icon, Image, Modal } from "semantic-ui-react";

// import custom-made
// import {Parser, Mocktest }from '../libs/'
const Parser = require("../libs/md-2-tree/parser");
const Mocktest = require("../libs/md-2-tree/mocktest");
const Protocol = require("../libs/md-2-tree/protocol");

// import test-paper
import TestPaperComponent from "../components/quiz/paper";
import axios from "axios";

class EditorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false
    };
    /*
      subject={subject_name}
      file={file_name}
      path={path ? path : ""}
      data={data}
    */
    //console.warn(props.subject);
    this.openModal = this.openModal.bind(this);
    this.saveDocument = this.saveDocument.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.createPDF = this.createPDF.bind(this);
    this.refreshProblems = this.refreshProblems.bind(this);
  }

  componentDidMount() {
    //Modal.setAppElement("#contentWrapper");
  }

  refreshProblems() {
    // 문제 새로고침
    // this.openModal();
    const test = Mocktest.create_mocktest(this.state.recyclingData, 5);
    this.setState({
      finalSoup: test
    });
    // scroll to top
  }

  createPDF() {
    const html2canvas = require("html2canvas");
    const jsPDF = require("jspdf");

    const input = document.getElementById("paper");
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(canvas.toDataURL("image/png"), 0, 0, 210, 297);
      // pdf.output('dataurlnewwindow');
      pdf.save("문제.pdf");
    });
  }

  saveDocument() {
    const markDown = draftToMarkdown(
      convertToRaw(
        this.refs.editorComponent.state.editorStateContent.getCurrentContent()
      )
    );
    const finalSoup = Parser.parse_doc(markDown);
    const bodyData = Protocol.create_message(finalSoup, "file");
    // console.log(bodyData);
    // console.log(this.props);
    axios
      .put(
        `${process.env.BACKEND_SERVICE_DOMAIN}/api/${process.env.BACKEND_SERVICE_API_VERSION}/doc/${this.props.subject}/${this.props.file}`,
        {
          type: "file",
          path: this.props.path,
          soups: finalSoup,
          connections: bodyData.connections,
          md_text: markDown
        },
        { withCredentials: true }
      )
      .then(({ data }) => {
        this.refs.insertToolbar.setState({
          loading: false // ref 활용하여 자식 컴포넌트의 state 조작
        });
        console.log(data);
      })
      .catch(e => {
        alert("저장실패");
      });
  }

  openModal() {
    // console.log(`모달이 오픈됨`);
    // console.log(this.refs.editorComponent);
    const markDown = draftToMarkdown(
      convertToRaw(
        this.refs.editorComponent.state.editorStateContent.getCurrentContent()
      )
    );
    /*
    let cooked_soup = Parser.parse_doc(docs_content);
    let cooked_json = Protocol.create_message(cooked_soup, 'add');  
    */
    const finalSoup = Parser.parse_doc(markDown);
    // const createdServerData = Protocol.create_message(finalSoup, "add");
    const test = Mocktest.create_mocktest(finalSoup.roots, 5); // 만들 문제 수

    this.setState({
      modalIsOpen: true,
      recyclingData: finalSoup.roots,
      finalSoup: test // 이 부분이 수정됨. 목(모의고사)테스트만 필요하다.
    });
  }

  afterOpenModal() {
    // 레퍼가 동기화되고 접근할 수 있음.
    this.subtitle.style.color = "grey";
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    return (
      <div
        id="contentWrapper"
        className="contentWrapper"
        style={{
          width: "100%",
          height: "100vh",
          margin: "0 auto",
          textAlign: "left",
          overflow: "hidden"
        }}
      >
        <div
          id="main"
          style={{
            display: "flex"
          }}
        >
          <div
            className="editorWrapper"
            style={{
              width: "100%",
              height: "100vh",
              margin: "0 auto",
              textAlign: "left",
              overflow: "scroll"
            }}
          >
            <div className="editorRoot">
              <EditorComponent ref="editorComponent" {...this.props} />
            </div>
            <div className="insertToolbarWrapper">
              <InsertToolbar
                ref="insertToolbar"
                onClick={this.openModal}
                onClick2={this.saveDocument}
              />
            </div>
            <Modal
              size="small"
              open={this.state.modalIsOpen}
              closeOnEscape={true}
              closeOnDimmerClick={false}
              onClose={this.closeModal}
            >
              <Modal.Header>문제 풀어보기</Modal.Header>
              <Modal.Actions>
                <div style={{textAlign:'center'}}>
                  <Button color='orange' onClick={this.refreshProblems}><Icon name='refresh'/>새로운 문제 가져오기</Button>
                  <Button secondary onClick={this.createPDF}>PDF로 내보내기</Button>
                  <Button primary onClick={this.closeModal}>종료하기</Button>
                </div>
              </Modal.Actions>
              <Modal.Content>
                <Modal.Description>
                  <div className="problemBox">
                  {this.state.finalSoup && this.state.modalIsOpen ? ( // 조건을 추가 (modalisopen)하여 닫힐때 재렌더링 되지 않도록 한다.
                    <TestPaperComponent problemData={this.state.finalSoup} />
                  ) : (
                    "문제지를 불러오는 중입니다."
                  )}
                  </div>
                </Modal.Description>
              </Modal.Content>
              <Modal.Actions>
                <div style={{textAlign:'center'}}>
                  <Button color='orange' onClick={this.refreshProblems}><Icon name='refresh'/>새로운 문제 가져오기</Button>
                  <Button secondary onClick={this.createPDF}>PDF로 내보내기</Button>
                  <Button primary onClick={this.closeModal}>종료하기</Button>
                </div>
              </Modal.Actions>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

export default EditorPage;
