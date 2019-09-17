import React, { useState, useEffect, useCallback } from "react";
import Page from "../layouts/main";
import CustomModal from "../components/modal/custommodal";
import { Button, Form, Input } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { ADD_SUBJECT, FETCH_SUBJECT } from "../reducers/subjects";
import SelectionComponent from "../components/subjects/selection";
import axios from "axios";
import Link from "next/link";

// css-loader works
import "../css/main/common.css";

// subjects들을 선택하는 페이지이다.

const SubjectsPage = () => {
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
      dispatch({
        type: FETCH_SUBJECT
      });
      setModalIsOpen(false);
      if (data.isLogin) {
        setIsLogin(true);
        setuserName(data.user.nickname);
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
        alert("제대로 입력해 주세요!! >0 && <=30");
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
        message={"서버와 통신 중입니다..."}
        dimmer={"inverted"}
      />
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
          <Link href="/"><a><img
            src="/static/img/logo-small.png"
            style={{ width: 177, height: 100 }}
          /></a></Link>
          <button className="hongong-button" id="find-subject">
            과목찾기
          </button>
          <button className="hongong-button" id="create-subject">
            과목만들기
          </button>
        </span>
        <span className="right">
          <button className="hongong-button" id="join">
            회원가입
          </button>
          <button className="hongong-button" id="sign-in">
            로그인
          </button>
        </span>
      </div>
      <div style={{ margin: 25 }}>
        <h1>과목 만들기</h1>
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
              <Link href="/">
                <a>
                  <button className="hongong-button" id="cancle">
                    취소
                  </button>
                </a>
              </Link>
            </span>
          </div>
        </div>
      </div>
      <div style={{ margin: "0 25px" }}>
	  <h1>내 과목들</h1>
        <SelectionComponent isLogin={isLogin} />
      </div>
    </Page>
  );
};

export default SubjectsPage;
