import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Page from "../layouts/main";
import Login from "../components/login";

const LoginPage = () => {
  const router = useRouter();
  const user = useSelector(state => state.userinfo); // reducer -> index.js -> rootReducer -> userinfo
  // state로 로그인 여부 확인하여 isLogin true상태시 router로 전이
  // 새로고침하면 어차피 안되는구나. 여기는 추후에 서버에서 직접 확인하여 제어하는 게 효율적일듯
  if (user.isLogin === true) {
    // 지금 상황에선 의미없음. (not reached)
    console.log("이즈로그인 트루");
    router.replace(`/`);
  }
  return (
    <Page>
      <Login user={user} />
    </Page>
  );
};

export default LoginPage;
