import React, { useState, useEffect, useCallback } from "react";
import Page from "../layouts/main";
import CustomModal from "../components/modal/custommodal";
import { Button, Form, Input } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { ADD_SUBJECT, FETCH_SUBJECT } from "../reducers/subjects";
import SelectionComponent from "../components/subjects/selection";
import axios from "axios";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { LOG_IN_SUCCESS } from "../reducers/userinfo";

// subjects들을 선택하는 페이지이다.

const SubjectsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [userName, setuserName] = useState(null);
  const [subject, setSubject] = useState("");
  const [isLogin, setIsLogin] = useState(false); // loading true, false
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const onChangeModalIsOpen = e => {
    setModalIsOpen(false);
  };
  useEffect(() => {
    setModalIsOpen(true);

    // state rebuilding - user
    axios(`${process.env.BACKEND_SERVICE_DOMAIN}/api/userinfo`, {
      withCredentials: true
    }).then(({ data }) => {
      if (data.isLogin) {
        setModalIsOpen(false);
        setIsLogin(true);
        setuserName(data.user.nickname);
        dispatch({
          type: LOG_IN_SUCCESS,
          data
        })
        dispatch({
          type: FETCH_SUBJECT
        });
      } else {
        router.replace("/login");
      }
    });

    // take rebuilding - subjects
  }, []);

  const changeAction = useCallback(e => {
    setSubject(e.target.value);
  }, []);

  const takeAction = useCallback(
    e => {
      const copy = subject;
      setSubject("");
      if (!subject.trim() || subject.length > 30) {
        alert("1자 이상 30자 미만으로 입력해 주세요..");
        return false;
      }
      dispatch({
        type: ADD_SUBJECT,
        data: {
          subject_name: subject
        }
      });
    },
    [subject]
  );

  return (
    <Page>
      <CustomModal
        open={modalIsOpen}
        closeOnEscape={false}
        // esc로 탈출 불가
        closeOnDimmerClick={false}
        // 외부클릭으로 탈출 불가
        onClose={onChangeModalIsOpen}
        message={"잠시만 기다려주세요..."}
        dimmer={"inverted"}
      />
      <style jsx global>
        {`
          @font-face {
            font-family: "NanumGothic";
            font-style: normal;
            src: url("/static/fonts/NanumGothic-Regular.woff") format("woff");
          }

          @font-face {
            font-family: "NanumGothic";
            font-style: bold;
            src: url("/static/fonts/NanumGothic-Bold.woff") format("woff");
          }

          * {
            font-family: "NanumGothic", "serif";
          }

          .hongong_solid {
            /* Look */
            background: #262626;
            color: white;
          }

          .hongong-button {
            /* Look */
            background: #262626;
            color: white;
            border: 1px solid #262626;

            /* Layout*/
            padding: 5px;
            padding-left: 10px;
            padding-right: 10px;
            align-self: center;
            margin-right: 10px;
          }

          .hongong-button:hover {
            /* Look */
            border: 1px dashed white;
          }

          .hongong-textarea {
            /* Look */
            border-top: none;
            border-left: none;
            border-right: none;
            border-bottom: 1px solid #aaaaaa;
          }
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
          .editor-bound {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            border: 1px solid gray;
            padding: 15px;
            width: 50%;
            min-width: 512px;
          }

          .editor-bound > div {
            display: flex;
            align-content: stretch;
          }

          .editor-bound > div > input {
            margin-left: 10px;
            width: 90%;
          }
        `}
      </style>
      <div className="header hongong_solid">
        <span className="left">
          <Link href="/subjects" as="/">
            <a>
              <img
                src="/static/img/logo-small.png"
                style={{ width: 177, height: 100 }}
              />
            </a>
          </Link>
        </span>
        <span className="right">
          <button className="hongong-button" id="sign-out">
            {userName ? `로그아웃 ( ${userName} )` : ""}
          </button>
        </span>
      </div>
      <div style={{ margin: 25 }}>
        <h1>과목 생성하기</h1>
        <div className="editor-bound">
          {/* 과목명 */}
          <div style={{ display: "flex", alignContent: "stretch" }}>
            <b>과목</b>
            <input
              type="text"
              className="hongong-textarea"
              id="subject-name"
              onChange={changeAction}
              value={subject}
              autoComplete="off"
            />
          </div>
          {/* 태그 */}
          <div className="editor-tags">
            <b>태그</b>
            <input
              type="textarea"
              className="hongong-textarea"
              id="tags"
              readOnly
            />
          </div>
          {/* 세부내용 */}
          <div>
            <b>분류</b>
            <input
              type="textarea"
              className="hongong-textarea"
              id="category"
              readOnly
            />
          </div>
          <div>
            <b>소속</b>
            <input
              type="textarea"
              className="hongong-textarea"
              id="foundation"
              readOnly
            />
          </div>
          <div>
            <b>내용</b>
            <input
              type="textarea"
              className="hongong-textarea"
              id="description"
              readOnly
            />
          </div>
          {/* 확인 취소 버튼 */}
          <div style={{ display: "flex", paddingTop: 10 }}>
            <span style={{ fontSize: "1em" }}>
              <button
                className="hongong-button"
                id="confirm"
                onClick={takeAction}
              >
                확인
              </button>
              <Link href="/subjects" as='/'>
                <a>
                  <button className="hongong-button" id="cancel">
                    취소
                  </button>
                </a>
              </Link>
            </span>
          </div>
        </div>
      </div>
      <div style={{ margin: "0 25px" }}>
        <h1>현재 제공되는 과목들</h1>
        <SelectionComponent isLogin={isLogin} />
      </div>
    </Page>
  );
};

export default SubjectsPage;
