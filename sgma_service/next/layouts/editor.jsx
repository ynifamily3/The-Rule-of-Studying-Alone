import React, { Component } from "react";
import GnbHeader from "../components/dashboard/gnbheader";
import Aside from "../components/dashboard/aside";
import InsertToolbar from "../components/editor/insertToolbar"; // Editor Toolbar (floated)
import EditorComponent from "../components/editor/EditorComponent";
import { convertToRaw } from "draft-js";
import { draftToMarkdown } from "../libs/markdown-draft-js";
import debug_parse_doc from "../libs/md-2-tree";
import Modal from "react-modal";

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
    console.log(`모달이 오픈됨`);
    // console.log(this.refs.editorComponent);
    const markDown = draftToMarkdown(
      convertToRaw(
        this.refs.editorComponent.state.editorStateContent.getCurrentContent()
      )
    );
    const finalSoup = debug_parse_doc(markDown.replace(/^-/gm, "*")); // 자체 console에선 문제 없었음. (tree 구축 과정에서 예전 변수를 안 비우고 쓰는 듯)
    console.log(`파이널 soup`);
    console.log(finalSoup); // 처음에 넣은 값이 바뀌지 않고 그대로 유지되는 거 같음 (bugs?)
    console.log(`end of`);
    this.setState({
      modalIsOpen: true,
      quiz: JSON.stringify(finalSoup) // => 이전께 불러와짐. (아마 라이브러리의 문제 같음.) 퀴즈 만드는덴 중요하지 않은 거 같으므로 일단 넘긴다.
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
              onRequestClose={this.closeModal}
              style={modalStyles}
              contentLabel="Example Modal"
            >
              <h2 ref={subtitle => (this.subtitle = subtitle)}>Hello</h2>
              <button onClick={this.closeModal}>close</button>
              <div>
                <div className="problemArea">만들어진 퀴즈 (ProtoType)</div>
                <div className="problemBox">
                  {this.state.quiz ? this.state.quiz : "Making...."}
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

export default EditorPage;
