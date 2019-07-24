import React from "react";
import "../css/login.css";
import CustomButton from "./custombutton";
import Textbox from "./textbox";
import ThirdPartyButton from "./thirdpartybutton";

class LoginComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: []
    };
  }
  componentDidMount() {
    const button = document.querySelector("#login");
  }
  componentWillUnmount() {
    console.log("바이바이");
  }
  render() {
    console.log("렌더시작");
    const jsxElem = (
      <div className="center-wrapper">
        <h1 className="logo">로그인</h1>
        <div className="input" id="login-wrapper">
          <div className="login">
            <form onSubmit={e => e.preventDefault()}>
              <div id="login-input-container">
                <div className="control-group">
                  <label
                    id="accountName-label"
                    className="control-label"
                    htmlFor="accountName"
                  >
                    이메일 또는 휴대전화번호
                  </label>
                  <div className="controls">
                    <Textbox
                      placeholder="이메일 또는 휴대전화번호"
                      icon="users"
                    />
                  </div>
                </div>
                <div className="control-group">
                  <label
                    id="password-label"
                    className="control-label"
                    htmlFor="password"
                  >
                    비밀번호
                  </label>
                  <div className="controls">
                    <Textbox
                      placeholder="비밀번호"
                      icon="key"
                      type="password"
                    />
                  </div>
                </div>
              </div>
              <div className="login-submit-container">
                <CustomButton label="로그인" id="login" />
              </div>
            </form>
            <div className="thirdparty-line">
              <span>또는</span>
            </div>
            <div className="thirdparty-buttons">
              <ThirdPartyButton
                label="Facebook"
                icon="facebook"
                color="facebook"
              />

              <ThirdPartyButton
                label="Google"
                icon="google"
                color="google plus"
              />
            </div>
            <ul id="help-links">
              <li>회원 가입</li>
              <li>로그인 문제 해결</li>
              <li>탈퇴한 계정 복구</li>
            </ul>
          </div>
        </div>
      </div>
    );
    return jsxElem;
  }
}

export default LoginComponent;
