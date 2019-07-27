import React from "react";

import "../../css/editor/editorWrapper.css";
import { Button } from "semantic-ui-react";
import Editor from "draft-js-plugins-editor";
import createSingleLinePlugin from "draft-js-single-line-plugin";
import { EditorState } from "draft-js";

const { Map } = require("immutable");
const singleLinePlugin = createSingleLinePlugin();
const plugins = [singleLinePlugin];

class EditorComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plugins: null,
      editorLoaded: false,
      editorState: EditorState.createEmpty(),
      editorStateContent: EditorState.createEmpty()
    };
    this.onChange = editorState => this.setState({ editorState });
    this.onChangeContent = editorState =>
      this.setState({ editorStateContent: editorState });
  }
  componentDidMount() {
    this.setState({ editorLoaded: true });
  }
  render() {
    const blockRenderMap = Map({
      "header-two": {
        element: "h2"
      },
      unstyled: {
        element: "h1"
      },
      placeholder: {
        element: "h1"
      }
    });
    return (
      <div className="editorWrapper">
        <div className="docTitle">
          {this.state.editorLoaded ? (
            <Editor
              placeholder={`여기에 제목을 입력하십시오.`}
              plugins={plugins}
              blockRenderMap={blockRenderMap}
              editorState={this.state.editorState}
              onChange={this.onChange}
            />
          ) : (
            `Loading...`
          )}
        </div>
        <div className="docContent">
          {this.state.editorLoaded ? (
            <Editor
              placeholder={`여기에 내용의 흐름을 입력하십시오.`}
              editorState={this.state.editorStateContent}
              onChange={this.onChangeContent}
            />
          ) : (
            `Loading...`
          )}
        </div>
      </div>
    );
  }
}

export default EditorComponent;
