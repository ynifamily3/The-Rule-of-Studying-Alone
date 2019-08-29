import React, { useState, useEffect } from "react";
import Page from "../layouts/main";
import Gnb from "../layouts/gnb";
import Link from "next/link";
import { Segment } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import { LOG_OUT, LOG_IN_FAILURE, LOG_IN_SUCCESS } from "../reducers/userinfo";
import CustomModal from "../components/modal/custommodal";
import axios from "axios";

const IndexPage = ctx => {
  // ajax로 로그인 상태 검사하여 직접 LOG_IN_SUCCESS를 dispatch
  // 그 전 까진 앱을 모달로 얼려놓는다.
  const dispatch = useDispatch();
  const { isLogin, user } = useSelector(state => state.userinfo); // reducer -> index.js -> rootReducer -> userinfo
  // manage modal state
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달의 기볹값은 false (ssr환경에서 true로 하면 이상한 종속성 에러가 표출된다.)
  const onChangeModalIsOpen = e => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    // *** 혹은 getInitialProps 후킹 걸어놓고, 서버 사이드 / 클라이언트 사이드 처리를 이원화하고,
    // 서버의 경우 api 서버와의 통신이 완료된 경우 뿌려주고 ,클라는 모달로 한다음 클라에서 api를 로딩하고 결정
    setModalIsOpen(true); // BLOCK 걸어놓고 state에 대한 서버 검증 (갱신)
    axios(`${process.env.BACKEND_SERVICE_DOMAIN}/api/userinfo`, {
      withCredentials: true
    }) // with cookie-based Auth
      .then(resp => {
        setModalIsOpen(false);
        console.log(resp.data);
        const loginTest = resp.data;
        if (!loginTest.isLogin) {
          dispatch({ type: LOG_IN_FAILURE });
        } else {
          dispatch({
            type: LOG_IN_SUCCESS,
            data: {
              ...loginTest
            }
          });
        }
        return loginTest; // 안 해도 되나?
      });
  }, []); // componentDidMount와 유사함., deps를 주면 ([]라도,) 한 번만 실행

  return (
    <Page>
      <CustomModal
        open={modalIsOpen}
        closeOnEscape={false} // esc로 탈출 불가
        closeOnDimmerClick={false} // 외부클릭으로 탈출 불가
        onClose={onChangeModalIsOpen}
        message={"서버와 통신 중입니다..."}
        dimmer={"inverted"}
      />
      <Gnb />

      <Segment
        style={{
          width: "50%",
          minWidth: "380px",
          margin: "auto 94.5px",
          marginTop: "30px"
        }}
      >
        <h2>혼공의 정석</h2>
        <h3>소개</h3>
        {`아직도 백지에 모든 걸 쓰며
      불필요한 정보까지 외우시나요?
      복학생이라 같이 교양 들을 친구가 없다구요?
      교수님이 말장난을 너무 잘하셔서 스탠딩 코미디도 나가신다구요? 이제
      걱정하지 마세요. 혼공의 정석이 여러분의 암기를 책임집니다!
      혼공의 정석은 교양 시험, 공무원 시험 등 단순 암기가 필요할 때
      공부를 도와주고 암기 상태를 확인할 수 있는 웹 어플리케이션입니다. 세상의
      모든 단순암기시험이 사라지는 그날까지 여러분을 응원합니다.`}
        <h3>기능</h3>
        <ul style={{ textIndent: "1.5em", listStyle: "none" }}>
          <li>주제를 만들고 지식 입력하기</li>
          <li>내가 입력한 지식 공유하기</li>
          <li> 암기를 할 수 있도록 연습문제 풀기</li>
          <li> 암기 상태를 점검할 수 있는 모의고사</li>
          <li> 어디를 덜 외웠는지 확인할 수 있는 암기점검 기능</li>
          <li>
            (프리미엄) 교육 서비스 업체와 제휴하여, 프리미엄 이용권 사용자를
            위한 독점 문제 제공
          </li>
        </ul>
      </Segment>
    </Page>
  );
};

export default IndexPage;
