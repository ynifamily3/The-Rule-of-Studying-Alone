import React, { Component } from "react";
import { Editor, EditorState, RichUtils, convertToRaw } from "draft-js";
import { Button, Icon, Input } from "semantic-ui-react";
// First, import `draftToMarkdown`
import { draftToMarkdown } from "../libs/markdown-draft-js";

// var markdownString = draftToMarkdown(rawObject);

class EditorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editor: false,
      editorState: EditorState.createEmpty()
    };
    this.onChange = editorState => {
      this.setState({ editorState }, () => {
        console.log(editorState);

        var markdownString = draftToMarkdown(
          convertToRaw(editorState.getCurrentContent())
        );
        console.log(markdownString);
        console.log(`즐거운 코딩ㅇ`);
      });
      // console.log(draftToMarkdown(editorState));
    };
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return "handled";
    }
    return "not-handled";
  }

  componentDidMount() {
    this.setState({ editor: true }); // next.js 의 서버 사이드 렌더 시 key 불일치로 발생하는 이슈 해결
  }

  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"));
  }

  render() {
    return (
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
        에디터입니다. 테스트 기능 개발중입니다.
        <div className="editorRoot" style={{ background: "#e5e5e5" }}>
          <button onClick={this._onBoldClick.bind(this)}>Bold</button>
          {this.state.editor ? (
            <Editor
              editorState={this.state.editorState}
              handleKeyCommand={this.handleKeyCommand}
              onChange={this.onChange}
            />
          ) : (
            <div>에디터 로딩 중.</div>
          )}
        </div>
      </div>
    );
  }
}

export default EditorPage;
