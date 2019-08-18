import React, { getInitialProps } from "react";
import { useSelector } from "react-redux";
import Page from "../layouts/main";
import Login from "../components/login";

const LoginPage = pageProps => {
  // console.log(pageProps.test); // 1234
  const user = useSelector(state => state.userinfo); // reducer -> index.js -> rootReducer -> userinfo
  return (
    <Page>
      <Login user={user} />
    </Page>
  );
};

LoginPage.getInitialProps = async ({ req }) => {
  console.log("LoginPage.getInitialProps 호출됨");
  return { test: 1234 };
};

export default LoginPage;
