import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Page from "../layouts/main";
import DashBoard from "../layouts/dashboard";
import Router from "next/router";
import { useRouter } from "next/router";
import { decodeSGMAStr } from "../libs/path-encryptor";
import { md5 } from "../libs/md5";
import { FETCH_DOCS, CLEAR_DOCS } from "../reducers/docs";
// import CustomModal from "../components/modal/custommodal";
import { Dimmer, Loader, Image, Segment } from "semantic-ui-react";

import axios from "axios";
import { LOG_IN } from "../reducers/userinfo";

const DashBoardPage = pageProps => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(state => state.userinfo);
  const docsDefault = useSelector(state => state.docs); // docs 루트에 하나 더 둬야겠다.
  const { path, subject } = router.query;
  const [isLoaded, setIsLoaded] = useState(false); // loading true, false

  useEffect(() => {
    axios(`${process.env.BACKEND_SERVICE_DOMAIN}/api/userinfo`, {
      withCredentials: true
    }).then(({ data }) => {
      const { isLogin, user } = data;
      if (isLogin === true) {
        dispatch({
          type: FETCH_DOCS,
          data: {
            subject_name: subject
          }
        });
      } else {
        // route x
        Router.replace("/login");
      }
    });
  }, []);

  useEffect(() => {
    //alert('독스가 수정됨!')
    // 현재 서브젝트랑 일치하면 보내주멸 될 듯
    // 처음 렌더링, 로그인 완료 후 렌더링, 페치 후 렌더링 => 하나로 통합하기 위한 추적 시스템
    const { subject, error } = docsDefault.toJS();
    if (error) {
      alert("에러 발생!! 첫화면으로 돌아갑니다.");
      router.back();
    }
    if (subject === router.query.subject) {
      setIsLoaded(true);
    }
  }, [docsDefault]); // docsDefault의 변화만을 추적한다.
  return (
    <Page>
      {/*<CustomModal
        open={modalIsOpen}
        closeOnEscape={false}
        // esc로 탈출 불가
        closeOnDimmerClick={false}
        // 외부클릭으로 탈출 불가
        onClose={onChangeModalIsOpen}
        message={"로그인 정보 취득 중..."}
      />*/}
      {isLoaded ? (
        <DashBoard
          docsDefault={docsDefault}
          subject={subject}
          user={user}
          path={decodeSGMAStr(path)}
        />
      ) : (
        <Dimmer active inverted>
          <Loader inverted>문서 목록을 불러오는 중입니다...</Loader>
        </Dimmer>
      )}
    </Page>
  );
};

DashBoardPage.getInitialProps = async ({ res, query }) => {
  // path verifier 와 md5(path)가 맞지 않은 경우 메인 페이지를 렌더링하고 URL을 바꾼다. (/subjects)
  // 추가 : subject 가 없을 경우 /subjects 로 튕기게 만든다. (subject의 유효성은 다른 곳 (redux 에서 검사함.))
  const { path, pv, subject } = query;
  if (!subject) {
    if (res) {
      // server side
      res.writeHead(302, {
        Location: "/subjects"
      });
      res.end();
    } else {
      Router.replace("/subjects");
    }
  }
  if (
    (!path && pv) ||
    (path && !pv) ||
    (pv && path && md5(decodeSGMAStr(path)) !== pv)
  ) {
    if (res) {
      // server - side
      res.writeHead(302, {
        Location: "/subjects"
      });
      res.end();
    } else {
      Router.push("/subjects");
    }
  }

  return {};
};

export default DashBoardPage;
