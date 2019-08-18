import React, { getInitialProps } from "react";
import { useSelector } from "react-redux";
import Page from "../layouts/main";
import Login from "../components/login";

const LoginPage = test => {
  const user = useSelector(state => state.userinfo); // reducer -> index.js -> rootReducer -> userinfo
  return (
    <Page>
      <Login user={user} />
    </Page>
  );
};

LoginPage.getInitialProps = ({ req }) => {
  return { test: 1234 };
};

export default LoginPage;
