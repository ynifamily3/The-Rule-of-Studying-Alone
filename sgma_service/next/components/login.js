import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "../css/login.css";
import CustomButton from "./custombutton";
import Textbox from "./textbox";
import ThirdPartyButton from "./thirdpartybutton";
import { Form } from "semantic-ui-react";
import { LOG_IN, LOG_OUT } from "../reducers/userinfo";

const LoginComponent = props => {
  const dispatch = useDispatch();
  // const user = useSelector(state => state.userinfo); // filename?
  const {
    isLogin,
    auth_method,
    user_id,
    nickname,
    email,
    profile_photo,
    createdAt
  } = props.user;

  const [id, setID] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = e => {
    // alert(id + " : " + password);
    dispatch({
      type: LOG_IN,
      data: {
        user_id: id,
        nickname: password
      }
    });
    // 이거 바껴도 자동갱신 안된다 왜지..?
  };

  const onChangeID = e => {
    setID(e.target.value);
  };

  const onChangePassword = e => {
    setPassword(e.target.value);
  };

  // console.log(props);
  if (!isLogin) {
    return (
      <div className="center-wrapper">
        <h1 className="logo">로그인</h1>
        <div className="input" id="login-wrapper">
          <div className="login">
            <Form onSubmit={onSubmit}>
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
                      value={id}
                      onChange={onChangeID}
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
                      value={password}
                      onChange={onChangePassword}
                    />
                  </div>
                </div>
              </div>
              <div className="login-submit-container">
                <CustomButton label="로그인" id="login" />
              </div>
            </Form>
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
  } else {
    return (
      <div>
        {user_id}({nickname})님 안녕하세요
      </div>
    );
  }
};

export default LoginComponent;
