import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Page from "../layouts/main";
import DashBoard from "../layouts/dashboard";
import Router from "next/router";
import { useRouter } from "next/router";
import { decodeSGMAStr } from "../libs/path-encryptor";
import { md5 } from "../libs/md5";

const DashBoardPage = pageProps => {
  const router = useRouter();
  const user = useSelector(state => state.userinfo);
  const docs = useSelector(state => state.docs);
  const { path } = router.query;

  return (
    <Page>
      <DashBoard user={user} docs={docs} path={decodeSGMAStr(path)} />
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
