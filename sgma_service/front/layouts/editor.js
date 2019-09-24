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

class EditorLayout extends Component {
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
    let test = Mocktest.create_mocktest(
      this.state.recyclingData,
      5
    ).quests.reduce((a, b) => {
      if (b) a.push(b); // null 없애기
      return a;
    }, []);
    this.setState({
      finalSoup: { quests: test }
    });
    // scroll to top
  }

  createPDF() {
    /*
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
    */
  }

  saveDocument() {
    const markDown = draftToMarkdown(
      convertToRaw(
        this.refs.editorComponent.state.editorStateContent.getCurrentContent()
      )
    );
    const finalSoup = Parser.parse_doc(markDown);
    const issues =
      Array.isArray(finalSoup) ||
      finalSoup.validation_check({ n: 4, a: 1 }).reduce((a, b) => {
        return a.what + ", " + b.what;
      }, "");
    // console.log(issues);
    const bodyData = !issues && Protocol.create_message(finalSoup, "file");
    if (!bodyData) {
      this.refs.insertToolbar.setState({
        loading: false
      });
      alert(
        `본 문서에는 충분한 양의 지식이 포함되지 않았으므로, 정상적으로 문제가 생성되지 않습니다.\n${
          issues ? issues.what : "[issue 없음]"
        }`
      );
      // return;
    }
    axios
      .put(
        `${process.env.BACKEND_SERVICE_DOMAIN}/api/${process.env.BACKEND_SERVICE_API_VERSION}/doc/${this.props.subject}/${this.props.file}`,
        {
          type: "file",
          path: this.props.path,
          infos: bodyData && bodyData.infos,
          connections: bodyData && bodyData.connections,
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
    const finalSoup = Parser.parse_doc(markDown);
    let numOfProb =
      prompt("(최대)만들 문제 개수를 입력해주세요 ( 1 ~ 5 ) : ", "5");
    numOfProb = numOfProb ? (numOfProb*1 > 5 ? 5 : numOfProb*1) : numOfProb || numOfProb === null ? 0 : 1;
    console.log(numOfProb);
    if (numOfProb === 0) return;
    let test = Mocktest.create_mocktest(
      finalSoup.roots,
      numOfProb
    ).quests.reduce((a, b) => {
      if (b) a.push(b); // null 없애기
      return a;
    }, []);
    //console.warn(test);
    this.setState({
      modalIsOpen: true,
      recyclingData: finalSoup.roots,
      finalSoup: { quests: test } // 이 부분이 수정됨. 목(모의고사)테스트만 필요하다.
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
      <div id="contentWrapper" className="contentWrapper">
        <div className="editorWrapper">
          <div className="editorRoot">
            <EditorComponent ref="editorComponent" {...this.props} />
          </div>
          <InsertToolbar
            ref="insertToolbar"
            onClick={this.openModal}
            onClick2={this.saveDocument}
          />
          <Modal
            size="small"
            open={this.state.modalIsOpen}
            closeOnEscape={true}
            closeOnDimmerClick={true}
            onClose={this.closeModal}
          >
            <Modal.Header>문제 풀어보기</Modal.Header>
            <Modal.Actions>
              <div style={{ textAlign: "center" }}>
                <Button color="black" onClick={this.refreshProblems}>
                  <Icon name="refresh" />
                  새로운 문제 가져오기
                </Button>
                <Button warn onClick={this.closeModal}>
                  종료하기
                </Button>
              </div>
            </Modal.Actions>
            <Modal.Content>
              <Modal.Description>
                <div className="problemBox">
                  {this.state.finalSoup && this.state.modalIsOpen ? ( // 조건을 추가 (modalisopen)하여 닫힐때 재렌더링 되지 않도록 한다.
                    <TestPaperComponent problemData={this.state.finalSoup} />
                  ) : (
                    "문제지를 불러오는 중입니다."
                  )}
                </div>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <div style={{ textAlign: "center" }}>
                <Button color="orange" onClick={this.refreshProblems}>
                  <Icon name="refresh" />
                  새로운 문제 가져오기
                </Button>
                <Button primary onClick={this.closeModal}>
                  종료하기
                </Button>
              </div>
            </Modal.Actions>
          </Modal>
        </div>
      </div>
    );
  }
}

export default EditorLayout;
