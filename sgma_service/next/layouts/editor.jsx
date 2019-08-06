import React, { Component } from "react";
import GnbHeader from "../components/dashboard/gnbheader";
import Aside from "../components/dashboard/aside";
import InsertToolbar from "../components/editor/insertToolbar"; // Editor Toolbar (floated)
import EditorComponent from "../components/editor/EditorComponent";
import { convertToRaw } from "draft-js";
import { draftToMarkdown } from "../libs/markdown-draft-js";
import Modal from "react-modal";

// import custom-made
const Parser = require("../libs/md-2-tree/parser");

// import test-paper
import TestPaperComponent from "../components/quiz/paper";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

class EditorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    Modal.setAppElement("#contentWrapper");
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

    this.setState({
      modalIsOpen: true,
      finalSoup // => 이전께 불러와짐. (아마 라이브러리의 문제 같음.) 퀴즈 만드는덴 중요하지 않은 거 같으므로 일단 넘긴다.
    });
  }

  afterOpenModal() {
    // 레퍼가 동기화되고 접근할 수 있음.
    this.subtitle.style.color = "skyblue";
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
        <GnbHeader />
        <div
          id="main"
          style={{
            display: "flex"
          }}
        >
          <Aside />
          <div
            className="editorWrapper"
            style={{
              width: "100%",
              height: "100vh",
              margin: "0 auto",
              textAlign: "left",
              overflow: "hidden"
            }}
          >
            <div className="editorRoot">
              <EditorComponent ref="editorComponent" />
            </div>
            <div className="insertToolbarWrapper">
              <InsertToolbar onClick={this.openModal} />
            </div>
            <Modal
              isOpen={this.state.modalIsOpen}
              onAfterOpen={this.afterOpenModal}
              /*onRequestClose={this.closeModal}*/
              style={modalStyles}
              contentLabel="Example Modal"
            >
              <div>
                <h2
                  className="problemArea"
                  ref={subtitle => (this.subtitle = subtitle)}
                >
                  Quiz
                </h2>
                <div className="problemBox">
                  {this.state.finalSoup ? (
                    <TestPaperComponent soup={this.state.finalSoup} />
                  ) : (
                    "문제지를 불러오는 중입니다."
                  )}{" "}
                </div>
              </div>
              <button>PDF로 내보내기</button>{" "}
              <button onClick={this.closeModal}>종료하기</button>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

export default EditorPage;
