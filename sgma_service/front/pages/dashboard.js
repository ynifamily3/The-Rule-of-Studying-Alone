import React from "react";
import Router from "next/router"; // https://nextjs.org/docs#userouter
import { useSelector } from "react-redux";
import Page from "../layouts/main";
import DashBoard from "../layouts/dashboard";

// 미 로그인시 메인 화면으로 이동 시연
// 여기서는 redux-state로 1차 판별을 하고 2차적으로 api로 판별한다. (백 구현시 구현)
/*
GET /api/docs
로그인된 상태인 경우
{
docs:[{
  folder_name:String,
  file_name:[String]
  }]
}
*/
const DashBoardPage = pageProps => {
  const user = useSelector(state => state.userinfo);
  const docs = useSelector(state => state.docs);
  return (
    <Page>
      <DashBoard user={user} docs={docs} />
    </Page>
  );
};

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

/*
LoginPage.getInitialProps = async ctx => {
  // console.log("---------");
  if (ctx && ctx.req) {
    // console.log("server side");
  } else {
    // console.log("client side");
  }
  return { test: 1234 };


      static async getInitialProps (ctx) {
        if (ctx && ctx.req) {
            console.log('server side')
            ctx.res.writeHead(302, {Location: `/`})
            ctx.res.end()
        } else {
            console.log('client side')
            Router.push(`/`)
        }
  
};
 
 */
export default DashBoardPage;
