import Page from "../layouts/main";
import Link from "next/link";
export default () => (
  <Page>
    <p>안녕!</p>
    <p>초고교급암기머신 제작 위원회에서 학습용 프로그램을 소개하려고 해!</p>
    <Link href="/login">
      <a>로그인</a>
    </Link>
    <Link href="/problem">문제 샘플 보기</Link>
  </Page>
);
