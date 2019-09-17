import React, { useState, useEffect } from "react";
import Page from "../layouts/main";
import Gnb from "../layouts/gnb";
import { Loader, Dimmer, Segment } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import { LOG_IN_FAILURE, LOG_IN_SUCCESS, LOG_OUT } from "../reducers/userinfo";
// import CustomModal from "../components/modal/custommodal";
import axios from "axios";
import Link from "next/link";

// css-loader works
import "../css/main/common.css";
import { Router, useRouter } from "next/router";

const IndexPage = ctx => {
  // ajax로 로그인 상태 검사하여 직접 LOG_IN_SUCCESS를 dispatch
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState({ isLogin: false });

  useEffect(() => {
    // alert('useEffect')
    axios(`${process.env.BACKEND_SERVICE_DOMAIN}/api/userinfo`, {
      withCredentials: true
    })
      .then(resp => {
        const loginTest = resp.data;
        setIsLoaded(true);
        if (!loginTest.isLogin) {
          dispatch({ type: LOG_IN_FAILURE });
        } else {
          dispatch({
            type: LOG_IN_SUCCESS,
            data: {
              ...loginTest
            }
          });
          setUser(loginTest);
        }
        return loginTest;
      })
      .catch(e => {
        console.log("서버 통신 중 오류 발생!!\n페이지를 새로 고침 해 주세요");
        //setIsLoaded(true);
      });
  }, []);

  const loginClick = e => {
    router.push(`/login`);
  };

  const logoutClick = e => {
    dispatch({
      type: LOG_OUT
    });
    setUser({ isLogin: false });
  };

  const findSubjectClick = e => {
    router.push(`/subjects`);
  };

  return (
    <Page>
      {isLoaded ? (
        <div>
          <style jsx global>
            {`
              .header {
                height: 100px;
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-around;
              }

              .left {
                flex-grow: 1;
                display: flex;
                justify-content: flex-start;
                margin-left: 50px;
              }

              .right {
                flex-grow: 1;
                display: flex;
                justify-content: flex-end;
                margin-right: 50px;
              }

              /* MAIN IMAGE */
              .main-img {
                overflow: hidden;
                height: 300px;
              }

              .on-img-text {
                position: absolute;
                font-size: 4vw;
                color: #ffffff;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              }

              /* INTRO TEXT */
              .intro {
                display: flex;
                justify-content: center;
                height: 200px;
              }

              .intro img {
                align-self: center;
                padding-left: 50px;
                padding-right: 50px;
              }

              .intro-text {
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 33%;
                max-width: 300px;
              }

              /* COUNTERS */
              .counters {
                width: 100%;
                height: 100px;
                display: flex;
                flex-direction: ltr;
                justify-content: space-evenly;
              }

              .counter-elem {
                border: 1px double white;
                padding: 20px;
                align-self: center;
              }
            `}
          </style>
          <div className="header hongong_solid">
            <span className="left">
              <a href="/">
                <img
                  src="/static/img/logo-small.png"
                  style={{ width: 177, height: 100 }}
                />
              </a>
              {/* 강제 새로고침 */}
              {user.isLogin && (
                <button
                  onClick={findSubjectClick}
                  className="hongong-button"
                  id="find-subject"
                >
                  과목찾기
                </button>
              )}
              {user.isLogin && (
                <button onClick={findSubjectClick} className="hongong-button" id="create-subject">
                  과목만들기
                </button>
              )}
            </span>
            <span className="right">
              {!user.isLogin && (
                <button className="hongong-button" id="join">
                  회원가입
                </button>
              )}
              {!user.isLogin ? (
                <button
                  onClick={loginClick}
                  className="hongong-button"
                  id="sign-in"
                >
                  로그인
                </button>
              ) : (
                <button
                  onClick={logoutClick}
                  className="hongong-button"
                  id="sign-in"
                >
                  로그아웃 ( {user.user.nickname} )
                </button>
              )}
            </span>
          </div>
          {/* 이미지 div */}
          <div className="main-img" style={{ position: "relative" }}>
            <img src="/static/img/main0-dark.jpg" style={{ width: "100%" }} />
            <span className="on-img-text">이제 암기 걱정은 그만!</span>
          </div>
          {/* 인트로 div */}
          <div className="intro">
            <img src="/static/img/arrow-right.jpg" />
            <span className="intro-text">
              <span style={{ alignSelf: "flex-start", height: "3em" }}>
                <span style={{ fontSize: "3em" }}>혼공</span>
                <span style={{ fontSize: "1.5em" }}>의 </span>
                <span style={{ fontSize: "3em" }}>정석</span>
                <span style={{ fontSize: "1.5em" }}>은</span>
              </span>
              <span style={{ alignSelf: "center", height: "3em" }}>
                <span style={{ fontSize: "3em" }}>혼</span>
                <span style={{ fontSize: "1.5em" }}>자서도 </span>
                <span style={{ fontSize: "3em" }}>공</span>
                <span style={{ fontSize: "1.5em" }}>부할 수 있는</span>
              </span>
              <span style={{ alignSelf: "flex-end" }}>
                <span style={{ fontSize: "1.5em" }}>
                  공부 도우미 서비스입니다.
                </span>
              </span>
            </span>
            <img src="/static/img/arrow-left.jpg" />
          </div>
          {/* 있어보이는 쓸데없는 숫자가 들어가는 div */}
          <div className="counters hongong_solid">
            <span className="counter-elem">
              <span id="counter-subjects" style={{ fontSize: "2em" }}>
                1024
              </span>{" "}
              과목
            </span>
            <span className="counter-elem">
              <span id="counter-attrs" style={{ fontSize: "2em" }}>
                2147483647
              </span>{" "}
              지식
            </span>
            <span className="counter-elem">
              <span id="counter-groups" style={{ fontSize: "2em" }}>
                644
              </span>{" "}
              그룹
            </span>
          </div>
        </div>
      ) : (
        <div style={{ height: "100vh" }}>
          <Dimmer active inverted>
            <Loader inverted>Connecting ...</Loader>
          </Dimmer>
        </div>
      )}
    </Page>
  );
};

export default IndexPage;
