import React from "react";
import { useSelector } from "react-redux";
import Page from "../layouts/main";
import Login from "../components/login";

const LoginPage = pageProps => {
  const user = useSelector(state => state.userinfo); // reducer -> index.js -> rootReducer -> userinfo
  return (
    <Page>
      <Login user={user} />
    </Page>
  );
};

LoginPage.getInitialProps = async ctx => {
  // console.log("---------");
  if (ctx && ctx.req) {
    // console.log("server side");
  } else {
    // console.log("client side");
  }
  return { test: 1234 };

  /*
      static async getInitialProps (ctx) {
        if (ctx && ctx.req) {
            console.log('server side')
            ctx.res.writeHead(302, {Location: `/`})
            ctx.res.end()
        } else {
            console.log('client side')
            Router.push(`/`)
        }
  */
};

export default LoginPage;
