import React, { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import "../css/login.css";
import CustomButton from "./custombutton";
import Textbox from "./textbox";
import { Form, Button, Image } from "semantic-ui-react";
import CustomModal from "../components/modal/custommodal";
import { LOG_IN, LOG_OUT } from "../reducers/userinfo";

const LoginComponent = props => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    isLogin,
    user = { user_id, nickname, email, profile_photo, createdAt, auth_method }
  } = props.user;

  // manage modal state
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const onChangeModalIsOpen = e => {
    setModalIsOpen(false);
  };

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
    dispatch({
      type: LOG_IN
    });
  };

  const goBack = e => {
    router.back();
  };

  const goLogout = e => {
    goBack(e); // 이래도 밑에 디스패치는 된다.
    dispatch({
      type: LOG_OUT
    });
  };

  // 구글 로그인 클릭시 서버 주소를 넣는다.
  // {`${process.env.BACKEND_SERVICE_DOMAIN}/api/auth/naver}

  const loginWithNaver = async e => {
    setModalIsOpen(true);
    window.location.href = `${process.env.BACKEND_SERVICE_DOMAIN}/api/auth/naver`;
    // router.replace(`${process.env.BACKEND_SERVICE_DOMAIN}/api/auth/naver`); => deprecated. 외부 링크는 window.location.href로 대체
  };

  const loginWithFacebook = async e => {
    setModalIsOpen(true);

    const popUpWindow = window.open(
      "",
      "",
      "width=600px,height=500px,left=500px,top=100px",
      false
    );
    const htmlContent = `
      <div>
        <script>window.opener.testCb('success')</script>
        Success
      </div>
    `;
    popUpWindow.target = "_blank";
    popUpWindow.document.write(htmlContent);
    window.testCb = function(message) {
      console.log(message);
      popUpWindow.close();
      setModalIsOpen(false);
    };
  };

  const loginWithGoogle = async e => {
    setModalIsOpen(true);
    window.location.href = `${process.env.BACKEND_SERVICE_DOMAIN}/api/auth/google`;
  };

  // 로그인 여부에 따라서 컴포넌트 분기
  if (!isLogin) {
    return (
      <div className="center-wrapper">
        <CustomModal
          open={modalIsOpen}
          closeOnEscape={true}
          closeOnDimmerClick={false}
          onClose={onChangeModalIsOpen}
          message={"로그인 중입니다..."}
          dimmer={"inverted"}
        />
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
              <div style={{ width: "100%", marginBottom: "10px" }}>
                <Image
                  src="./static/img/login_naver.png"
                  width="100%"
                  style={{
                    cursor: "pointer"
                  }}
                  onClick={loginWithNaver}
                />
              </div>
              <div style={{ width: "100%", marginBottom: "10px" }}>
                <Image
                  src="./static/img/login_google.png"
                  width="100%"
                  style={{
                    cursor: "pointer"
                  }}
                  onClick={loginWithGoogle}
                />
              </div>

              <div style={{ width: "100%" }}>
                <Image
                  src="./static/img/login_facebook.png"
                  width="100%"
                  style={{
                    cursor: "pointer"
                  }}
                  onClick={loginWithFacebook}
                />
              </div>
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
              <Button onClick={goLogout}>로그아웃</Button>
              <Button onClick={goBack}>이전 페이지로</Button>
            </Button.Group>
          </div>
        </div>
      </div>
    );
  }
};

export default LoginComponent;
