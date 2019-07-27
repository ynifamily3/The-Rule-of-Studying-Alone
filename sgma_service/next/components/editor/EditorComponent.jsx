import React from "react";

import "../../css/editor/editorWrapper.css";
import Editor from "draft-js-plugins-editor";
import { EditorState, RichUtils, getDefaultKeyBinding } from "draft-js";
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
    this.onChangeContent = editorState =>
      this.setState({ editorStateContent: editorState });
  }

  _handleKeyCommand(command, editorState) {
    // keyboard 단축키를 handler 한다.
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
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
        this.onChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(this.state.editorStateContent, blockType)
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
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
            <Editor
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
  { label: "H1", style: "header-one" },
  { label: "H2", style: "header-two" },
  { label: "H3", style: "header-three" },
  { label: "H4", style: "header-four" },
  { label: "H5", style: "header-five" },
  { label: "H6", style: "header-six" },
  { label: "Blockquote", style: "blockquote" },
  { label: "UL", style: "unordered-list-item" },
  { label: "OL", style: "ordered-list-item" },
  { label: "Code Block", style: "code-block" }
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
  { label: "Bold", style: "BOLD" },
  { label: "Italic", style: "ITALIC" },
  { label: "Underline", style: "UNDERLINE" },
  { label: "Monospace", style: "CODE" }
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
