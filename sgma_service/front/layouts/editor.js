import React, { Component } from "react";
import InsertToolbar from "../components/editor/insertToolbar"; // Editor Toolbar (floated)
import EditorComponent from "../components/editor/EditorComponent";
import { convertToRaw } from "draft-js";
import { draftToMarkdown } from "../libs/markdown-draft-js";
import Modal from "react-modal";
import { Button } from "semantic-ui-react";

// import custom-made
// import {Parser, Mocktest }from '../libs/'
const Parser = require("../libs/md-2-tree/parser");
const Mocktest = require("../libs/md-2-tree/mocktest");
const Protocol = require("../libs/md-2-tree/protocol");

// import test-paper
import TestPaperComponent from "../components/quiz/paper";
import axios from "axios";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "480px",
    height: "640px"
  }
};

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
  }

  componentDidMount() {
    Modal.setAppElement("#contentWrapper");
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
    console.log(finalSoup);
    const test = Mocktest.create_mocktest(finalSoup.roots, 5); // 만들 문제 수
    console.log(test);

    this.setState({
      modalIsOpen: true,
      finalSoup
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
              isOpen={this.state.modalIsOpen}
              onAfterOpen={this.afterOpenModal}
              /*onRequestClose={this.closeModal}*/
              style={modalStyles}
              contentLabel="Example Modal"
            >
              <div id="paper">
                <h2
                  className="problemArea"
                  ref={subtitle => (this.subtitle = subtitle)}
                  style={{ textAlign: "center" }}
                >
                  ❤️문제지❤️
                </h2>
                <div className="problemBox">
                  {this.state.finalSoup ? (
                    <TestPaperComponent
                      soup={this.state.finalSoup}
                      problems={5}
                    />
                  ) : (
                    "문제지를 불러오는 중입니다."
                  )}{" "}
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  marginTop: "1.5em"
                }}
              >
                <Button.Group>
                  <Button onClick={this.createPDF}>PDF로 내보내기</Button>
                  <Button onClick={this.closeModal}>종료하기</Button>
                </Button.Group>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

export default EditorPage;
