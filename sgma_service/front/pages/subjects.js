import React, { useState, useEffect, useCallback } from "react";
import Page from "../layouts/main";
import CustomModal from "../components/modal/custommodal";
import { Button, Form, Input } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { ADD_SUBJECT, FETCH_SUBJECT } from "../reducers/subjects";
import SelectionComponent from "../components/subjects/selection";
import axios from "axios";

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
      body {
        line-height: initial;
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
		}

		.editor-tags {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-content: center;
			margin-top: 10px;
			margin-bottom: 10px;
		}

		.editor-tag-elem {
			background: #feda5f;
			border: none;
			border-radius: 0.3em;
			padding-top: 0.2em;
			padding-left: 0.5em;
			padding-right: 0.5em;
			margin-right: 0.8em;
			height: 1.2em;
			font-size: 0.8em;
			text-align: bottom;
			display: flex;
		}`}
      </style>
      <div className='header hongong_solid'>
		<span className='left'>
			<img src='/static/img/logo-small.png' style={{width: '177px', height: '100px'}} />
			<button className='hongong-button'>과목찾기</button>
			<button className='hongong-button'>과목만들기</button>
		</span>
		<span className='right'>
			<button className='hongong-button'>회원가입</button>
			<button className='hongong-button'>로그인</button>
		</span>
	</div>

	<div style={{margin: '25px'}}>
		<h1>과목 만들기</h1>
		<div className='editor-bound'>
			<div>
			<font size='5em'><a>과목명 </a><input type='textarea' className='hongong-textarea' id='subject-name' /></font></div>
			<div className='editor-tags'>
				<span className='editor-tag-elem'>#기출</span>
				<span className='editor-tag-elem'>#리시프</span>
			</div>
			<div>
				<a>분류 </a><input type='textarea' className='hongong-textarea' id='category' /><br/>
				<a>소속 </a><input type='textarea' className='hongong-textarea' id='foundation' /><br/>
				<a>내용 </a><input type='textarea' className='hongong-textarea' id='description' />
			</div>
			<div style={{display: 'flex', paddingTop: '10px'}}>
				<font size='1em'>
				<button className='hongong-button' id='confirm'>확인</button>
				<button className='hongong-button' id='cancle'>취소</button>
				</font>
			</div>
		</div>
	</div>




    </Page>
  );
};

export default SubjectsPage;
