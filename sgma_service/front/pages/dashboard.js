import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Page from "../layouts/main";
import DashBoard from "../layouts/dashboard";
import Router from "next/router";
import { useRouter } from "next/router";
import { decodeSGMAStr } from "../libs/path-encryptor";
import { md5 } from "../libs/md5";
import { FETCH_DOCS } from "../reducers/docs";
import CustomModal from "../components/modal/custommodal";
import axios from "axios";

{
  /* 2019 09 09 수정. 로딩 완료 후, useEffect으로 api 서버와 통신 하도록 구현할 것 */
}
const DashBoardPage = pageProps => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(state => state.userinfo);
  // const docs = useSelector(state => state.docs);
  // 이 부분을 이제 fetch 액션을 통해서 하도록 해야 함.
  const { path, subject } = router.query;
  const [isLogin, setIsLogin] = useState(false); // loading true, false
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const onChangeModalIsOpen = e => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    setModalIsOpen(true);
    // 9/10 수정할 사항 : 리덕스 액션으로 보낼 것!!
    axios(`${process.env.BACKEND_SERVICE_DOMAIN}/api/userinfo`, {
      withCredentials: true
    }).then(({ data }) => {
      console.log(data);
    });

    dispatch({
      type: FETCH_DOCS,
      data: {
        subject_name: subject
      }
    });
    // console.log(docs); // 이거 자꾸 갱신되나?
    // useeffect once until refresh 필요할 것 같다 (19.09.10.)
  }, []);

  return (
    <Page>
      <CustomModal
        open={modalIsOpen}
        closeOnEscape={false}
        // esc로 탈출 불가
        closeOnDimmerClick={false}
        // 외부클릭으로 탈출 불가
        onClose={onChangeModalIsOpen}
        message={"로그인 정보 취득 중..."}
      />
      <DashBoard subject={subject} user={user} path={decodeSGMAStr(path)} />
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

/*
굳이 밑과 같은 식으로 확인할 필요 없이, 그냥 상태만으로 신뢰해도 된다. (퍼포먼스 차원)
DashBoardPage.getInitialProps = async ctx => {
  // 로그인 여부를 cookie로 확인해야 한다. (디버깅으로 무조건 true)
  const isLogin = true;
  if (!isLogin) {
    if (ctx && ctx.req) {
      // ssr
      ctx.res.writeHead(302, { Location: `/login` });
      ctx.res.end();
    } else {
      // csr
      // const router = useRouter();
      Router.push(`/login`);
    }
  }
};
*/

export default DashBoardPage;
