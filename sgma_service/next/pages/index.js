import { useEffect } from "react";
import Page from "../layouts/main";
import Gnb from "../layouts/gnb";
import Link from "next/link";
import { Button, Segment } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { LOG_IN } from "../reducers/userinfo";

export default () => {
  const dispatch = useDispatch();
  /*
  useEffect 는 리액트 컴포넌트가 렌더링 될 때마다 특정 작업을 수행하도록 설정 할 수 있는 Hook 입니다. 
  클래스형 컴포넌트의 componentDidMount 와 componentDidUpdate 를 합친 형태로 보아도 무방합니다.
  */

  // 밑은 확인용 디버그 코드
  useEffect(() => {
    dispatch({
      type: LOG_IN,
      data: {
        auth_method: "naver",
        user_id: "_99773",
        nickname: "쫑근9 - 미엘9",
        email: "ynifamily3@gmail.com",
        profile_photo: "https://miel9photo.com",
        createdAt: "2019-03-03"
      } // 액션을 dispatch 한다. (클라이언트 사이드에 state가 된다.)
    });
  }, []);
  return (
    <Page>
      <Gnb />

      <Segment
        style={{
          width: "50%",
          minWidth: "380px",
          margin: "auto 94.5px",
          marginTop: "30px"
        }}
      >
        <h2>초고교급암기머신(가칭)</h2> <h3>소개</h3>{" "}
        {`아직도 백지에 모든 걸 쓰며
      불필요한 정보까지 외우시나요?
      복학생이라 같이 교양 들을 친구가 없다구요?
      교수님이 말장난을 너무 잘하셔서 스탠딩 코미디도 나가신다구요? 이제
      걱정하지 마세요. 초고교급암기머신(가칭)이 여러분의 암기를 책임집니다!
      초고교급암기머신(가칭)은 교양 시험, 공무원 시험 등 단순 암기가 필요할 때
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
      <div style={{ textAlign: "center", marginTop: "15px" }}>
        <Link href="/login">
          <Button color="grey">로그인</Button>
        </Link>
        <Link href="/problem">
          <Button color="blue">문제 샘플 보기</Button>
        </Link>
        <Link href="/dashboard">
          <Button color="red">대쉬보드로 가기</Button>
        </Link>
        <Link href="/editor">
          <Button color="black">에디터 (ProtoType)</Button>
        </Link>
      </div>
    </Page>
  );
};
