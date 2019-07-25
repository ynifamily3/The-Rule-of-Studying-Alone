import React, { Component } from "react";
import GnbHeader from "../components/dashboard/gnbheader";
import Aside from "../components/dashboard/aside";
import InsertToolbar from "../components/editor/insertToolbar"; // Editor Toolbar (floated)
import EditorComponent from "../components/editor/editorComponent";
// import { Editor, EditorState, RichUtils, convertToRaw } from "draft-js";
// import { draftToMarkdown } from "../libs/markdown-draft-js";
// import debug_parse_doc from "../libs/md-2-tree";

// var markdownString = draftToMarkdown(rawObject);
// <button onClick={this._onBoldClick.bind(this)}>Bold</button>
class EditorPage extends Component {
  /*
  constructor(props) {
    super(props);
    this.state = {
      editor: false,
      editorState: EditorState.createEmpty(),
      convertedMarkdown: "",
      convertedFinalFormat: ""
    };
    this.onChange = editorState => {
      this.setState({
        editorState,
        convertedMarkdown: draftToMarkdown(
          convertToRaw(editorState.getCurrentContent())
        ),
        convertedFinalFormat: debug_parse_doc(`# 소녀전선

        소녀전선은 미카팀에서 개발하고 룽청에서 서비스를 하는 중국의 모바일 게임으로, 중국, 대만, 한국, 일본, 글로벌 등 다양한 국가에서 서비스를 한다.
        
        
        
        ## 인형
        
        ### AR
        
        * 평균적인 사속을 가지고 있다.
        * 야시경을 장비할 수 있다.
        * 일반적으로 SMG와 진형버프를 연계한다.
        * 평범한 적을 잡는데는 손색이 없으나, 장갑 계통의 적에게는 취약하다.
        
        #### M4A1
        
        * 주인공 소대의 리더이다.
        * 사람의 의식을 복사해서 쓰고있다는 설이 있다.
        * 시나몬롤이나 혐포라고도 불린다.
        * AR에게 진형버프를 준다.
        
        
        
        #### M4 SOPMOD II
        
        * 주인공 소대의 막내다.
        * 영미권에서는 미치광이 개새끼 밈이 붙었다.
        * 디씨인사이드 미카갤러리의 갤주이다.
        * 철혈 부품을 수집하는 취미를 가졌다
        
        
        
        ### SMG
        
        #### C-MS
        
        * 아찌개
        * 매우 건방진 성격을 가지고 있다.
        * 기본적인 스탯과 스킬이 모두 출중하여 탑티어 회피탱커로 기용된다.
        * 어린 외형을 가졌지만 아동절 스킨이 나와 모두를 충격에 빠지게 하였다.
        
        츤 개시끄러움 K2랑 같이 두면 장관
        
        * 2019년 여름 수영복 스킨이 나왔다.
        
        ### HG
        
        ### RF
        
        ### MG
        
        ### SG
        
        삿팔이 존나 안나오네
        
        * 중형제조로만 얻을 수 있다.
        * 방탄판을 장비할 수 있다.
        * 탄을 소모하면 재장전 시간을 가져야 한다.
        * 식량을 매우 많이 소모한다.
        
        #### S.A.T.8
        
        * 소녀전선 전 병종 중 가장 낮은 제조확률을 보유하고 있다.
        * 복실복실한 금발을 가지고 있다.
        * 사회에서 편의점, 주유소 등 다양한 일을 하다가 그리폰에 입사했다.
        
        * 한국에서의 별명은 삿팔이로 불린다.
        * 일본에서는 サトハチ 또는 里8로 불린다.`)
      });
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
*/
  render() {
    return (
      <div
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
              <EditorComponent />
            </div>
            <div className="insertToolbarWrapper">
              <InsertToolbar />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditorPage;

/*
        <div
          className="convertedRoot"
          style={{ marginTop: "3em", background: "#cccccc" }}
        >
          <textarea
            readOnly
            id="convertedMarkdown"
            value={
              this.state.convertedMarkdown !== ""
                ? this.state.convertedMarkdown
                : `Loading...`
            }
          />
          <div className="converted2Root">
            <textarea
              readOnly
              id="convertedFinalFormat"
              value={
                this.state.convertedFinalFormat !== ""
                  ? this.state.convertedFinalFormat
                  : `최종 빌드가 여기에 표시됩니다.`
              }
            />
          </div>
        </div>
*/
