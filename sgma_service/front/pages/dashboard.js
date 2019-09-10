import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Page from "../layouts/main";
import DashBoard from "../layouts/dashboard";
import Router from "next/router";
import { useRouter } from "next/router";
import { decodeSGMAStr } from "../libs/path-encryptor";
import { md5 } from "../libs/md5";
import { FETCH_DOCS } from "../reducers/docs";

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

  useEffect(() => {
    // console.log("파닭은 역시");
    // console.log(docs);
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
      <DashBoard user={user} path={decodeSGMAStr(path)} />
    </Page>
  );
};

DashBoardPage.getInitialProps = async ({ res, query }) => {
  // path verifier 와 md5(path)가 맞지 않은 경우 메인 페이지를 렌더링하고 URL을 바꾼다. (/dashboard)
  const { path, pv } = query;
  if (
    (!path && pv) ||
    (path && !pv) ||
    (pv && path && md5(decodeSGMAStr(path)) !== pv)
  ) {
    if (res) {
      // server - side
      res.writeHead(302, {
        Location: "/dashboard"
      });
      res.end();
    } else {
      Router.push("/dashboard");
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
