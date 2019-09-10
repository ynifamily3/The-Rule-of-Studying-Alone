import React, { useState, useEffect, useCallback } from "react";
import Page from "../layouts/main";
import CustomModal from "../components/modal/custommodal";
import { Button, Form, Input } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { ADD_SUBJECT, FETCH_SUBJECT } from "../reducers/subjects";
import SelectionComponent from "../components/subjects/selection";
import axios from "axios";

// subjects들을 선택하는 페이지이다.

const SubjectsPage = pageProps => {
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

    // tate rebuilding - subjects
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
      <div>무엇을 공부하시겠습니까?</div>
      <Form>
        <legend>
          로그인 정보 :
          {userName === null ? "Loading" : !!userName ? userName : "손님"}{" "}
        </legend>
        <Input type="text" onChange={changeAction} value={subject} />
        <br />
        <br />
        <Button basic color="blue" onClick={takeAction}>
          과목 생성하기
        </Button>
      </Form>
      <SelectionComponent isLogin={isLogin} />
    </Page>
  );
};

export default SubjectsPage;
