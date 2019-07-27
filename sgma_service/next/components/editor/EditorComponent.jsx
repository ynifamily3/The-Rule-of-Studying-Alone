import React from "react";

import "../../css/editor/editorWrapper.css";
import "../../css/editor/editorRichEditor.css";
import TitleEditor from "draft-js-plugins-editor";
import { Editor, EditorState, RichUtils, getDefaultKeyBinding } from "draft-js";
import createSingleLinePlugin from "draft-js-single-line-plugin";

import { Button } from "semantic-ui-react";

const { Map } = require("immutable");
const singleLinePlugin = createSingleLinePlugin();
const plugins = [singleLinePlugin];

class EditorComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plugins: null,
      editorLoaded: false,
      editorState: EditorState.createEmpty(), // 단순 제목 string
      editorStateContent: EditorState.createEmpty() // 내용 (중요!)
    };
    this.focus = () => this.refs.editor.focus(); // 이건 뭐하는 걸까?

    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);

    this.onChange = editorState => this.setState({ editorState });
    this.onChangeContent = editorStateContent =>
      this.setState({ editorStateContent });
  }

  _handleKeyCommand(command, editorState) {
    // keyboard 단축키를 handler 한다.
    console.log(`001 : command : ${command}`);
    const newState = RichUtils.handleKeyCommand(editorState, command);
    console.log(`002 : editorState :${editorState}
    /////
    ${JSON.stringify(newState)}`);
    if (newState) {
      console.log(`003`);
      this.onChangeContent(newState); // => 뭔가 스타일을 주고 다 지우면 오류가 트리거되므로 삭제 후 테스트 => 플러그인 버그 ㅅㅂㅅㅂ
      console.log(`004`);
      // 삭제 했더니 그 줄을 다 지워도 해당 상태가 해제되지는 않는다. 의도된건데, 오류가 안 뜨게 할 수는 없을까?
      return true;
    }
    return false;
  }

  _mapKeyToEditorCommand(e) {
    if (e.keyCode === 9 /*  TAB  */) {
      const newEditorState = RichUtils.onTab(
        e,
        this.state.editorStateContent,
        4 /* maxDepth */
      );
      if (newEditorState !== this.state.editorStateContent) {
        this.onChangeContent(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  }

  _toggleBlockType(blockType) {
    this.onChangeContent(
      RichUtils.toggleBlockType(this.state.editorStateContent, blockType)
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChangeContent(
      RichUtils.toggleInlineStyle(this.state.editorStateContent, inlineStyle)
    );
  }

  componentDidMount() {
    this.setState({ editorLoaded: true });
  }
  render() {
    const { editorState, editorStateContent, editorLoaded } = this.state;
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

    let className = "RichEditor-editor";
    var contentState = editorStateContent.getCurrentContent();
    if (!contentState.hasText()) {
      if (
        contentState
          .getBlockMap()
          .first()
          .getType() !== "unstyled"
      ) {
        className += " RichEditor-hidePlaceholder";
      }
    }

    return (
      <div className="editorWrapper">
        <div className="RichEditor-root">
          {editorLoaded ? (
            <>
              <BlockStyleControls
                editorStateContent={editorStateContent}
                onToggle={this.toggleBlockType}
              />
              <InlineStyleControls
                editorStateContent={editorStateContent}
                onToggle={this.toggleInlineStyle}
              />
            </>
          ) : (
            `Loading...`
          )}
        </div>
        <div className="docTitle">
          {editorLoaded ? (
            <TitleEditor
              placeholder={`여기에 제목을 입력하십시오.`}
              plugins={plugins}
              blockRenderMap={blockRenderMap}
              editorState={editorState}
              onChange={this.onChange}
            />
          ) : (
            `Loading...`
          )}
        </div>
        <div className={className + " docContent"} onClick={this.focus}>
          {editorLoaded ? (
            <Editor
              blockStyleFn={getBlockStyle}
              customStyleMap={styleMap}
              placeholder={`여기에 주제를 시작으로 한 내용을 필기하십시오.`}
              editorState={editorStateContent}
              onChange={this.onChangeContent}
              handleKeyCommand={this.handleKeyCommand}
              keyBindingFn={this.mapKeyToEditorCommand}
              spellCheck={true}
              ref="editor"
            />
          ) : (
            `Loading...`
          )}
        </div>
      </div>
    );
  }
}

const styleMap = {
  CODE: {
    backgroundColor: "rgba(0,0,0,0.05)",
    fontSize: 16,
    padding: 2
  }
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case "blockquote":
      return "RichEditor-blockquote";
    default:
      return null;
  }
}

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = e => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = "RichEditor-styleButton";
    if (this.props.active) {
      className += " RichEditor-activeButton";
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

const BLOCK_TYPES = [
  { label: "주제 (1수준)", style: "header-one" },
  { label: "주제 (2수준)", style: "header-two" },
  { label: "주제 (3수준)", style: "header-three" },
  { label: "지식", style: "unordered-list-item" },
  { label: "주석", style: "blockquote" }
];

const BlockStyleControls = props => {
  const { editorStateContent } = props;
  // console.log(editorStateContent);
  const selection = editorStateContent.getSelection();
  const blockType = editorStateContent
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map(type => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

var INLINE_STYLES = [
  { label: "진하게", style: "BOLD" },
  { label: "기울임", style: "ITALIC" },
  { label: "밑줄", style: "UNDERLINE" },
  { label: "전각으로", style: "CODE" }
];

const InlineStyleControls = props => {
  const currentStyle = props.editorStateContent.getCurrentInlineStyle();

  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

export default EditorComponent;
