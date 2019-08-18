import React, { useState } from "react";
import Router from "next/router";
import { useDispatch } from "react-redux";
import "../css/login.css";
import CustomButton from "./custombutton";
import Textbox from "./textbox";
import ThirdPartyButton from "./thirdpartybutton";
import { Form, Button } from "semantic-ui-react";
import { LOG_IN, LOG_OUT } from "../reducers/userinfo";

/*
    static async getInitialProps (ctx) {
        if (ctx && ctx.req) {
            console.log('server side')
            ctx.res.writeHead(302, {Location: `/`})
            ctx.res.end()
        } else {
            console.log('client side')
            Router.push(`/`)
        }
*/

const LoginComponent = props => {
  const dispatch = useDispatch();
  const {
    isLogin,
    user = { user_id, nickname, email, profile_photo, createdAt, auth_method }
  } = props.user;

  // manage inputbox state
  const [id, setID] = useState("");
  const [password, setPassword] = useState("");

  const onChangeID = e => {
    setID(e.target.value);
  };

  const onChangePassword = e => {
    setPassword(e.target.value);
  };

  const onSubmit = e => {
    // action dispatch
    // 디버깅 중이므로 검증을 하지 않고 바로 디스패치 후 리디렉션 한다.
    dispatch({
      type: LOG_IN,
      data: {
        user: {
          auth_method: "서드파티(테스트)",
          user_id: "아이디(테스트)",
          nickname: "닉네임(테스트)",
          email: "test@testdomain.com",
          profile_photo: "test.jpg",
          createdAt: "2019-03-03(테스트)"
        }
      }
    });
  };
  // 로그인 여부에 따라서 컴포넌트 분기
  if (!isLogin) {
    return (
      <div className="center-wrapper">
        <h1 className="logo">로그인페이지</h1>
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
    const {
      user_id,
      nickname,
      email,
      profile_photo,
      createdAt,
      auth_method
    } = user;
    return (
      <div className="center-wrapper">
        로그인 상태입니다.
        <br />
        isLogin : {isLogin ? "true" : "false"}
        <br />
        user_id : {user_id}
        <br />
        nickname : {nickname}
        <br />
        email : {email}
        <br />
        profile_photo : {profile_photo}
        <br />
        createdAt : {createdAt}
        <br />
        auth_method : {auth_method}
        <div className="thirdparty-line">
          <div className="login">
            <Button.Group>
              <Button>로그아웃</Button>
              <Button>이전 페이지로</Button>
            </Button.Group>
          </div>
        </div>
      </div>
    );
  }
};

export default LoginComponent;
