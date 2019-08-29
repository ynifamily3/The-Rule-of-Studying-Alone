// 설계가 잘못된 페이지이다. 여기에는 레이아웃만 들어가고, 컴포넌트를 include해야 됨
// css 임포트는 컴포넌트에서 해야 한다. 변경 요망
import "../css/gnb.css";
import Link from "next/link";
import { Button } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import { encodeSGMAStr, decodeSGMAStr } from "../libs/path-encryptor";
import { md5 } from "../libs/md5";

export default () => {
  const dispatch = useDispatch();
  const { isLogin, user } = useSelector(state => state.userinfo); // reducer -> index.js -> rootReducer -> userinfo
  const goLogout = e => {
    dispatch({
      type: LOG_OUT
    });
  };

  return (
    <header className="gnbHeader">
      <div className="headerWrap">
        <div className="boxGnb">
          <div
            style={{
              position: "absolute",
              background: `url('./static/img/logo_sgma.png')  no-repeat`,
              width: "100px",
              height: "60px",
              backgroundSize: "100%",
              color: "transparent"
            }}
          >
            혼공의 정석 로고
          </div>
          <nav>
            <ul style={{ display: "inline-block" }}>
              <li>
                <Link href="#">
                  <a>
                    소개
                    <span className="line" />
                  </a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a>도움말</a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a>문의하기</a>
                </Link>
              </li>
            </ul>
          </nav>
          <div
            style={{
              width: "500px",
              height: "60px",
              position: "absolute",
              right: 0,
              top: "0px",
              lineHeight: "58px",
              textAlign: "right",
              paddingRight: "5px"
            }}
          >
            <div>
              {isLogin ? (
                <Button color="twitter" onClick={goLogout}>
                  로그아웃 ({user.nickname})
                </Button>
              ) : (
                <Link href="/login">
                  <a>
                    <Button
                      color="twitter"
                      style={{
                        marginLeft: "3px"
                      }}
                    >
                      로그인
                    </Button>
                  </a>
                </Link>
              )}
              <Link
                href={{
                  pathname: "/dashboard",
                  query: {
                    path: encodeSGMAStr("과학/지구과학"),
                    pv: md5("과학/지구과학") // 샘플용임. 나중에 지워야 함
                  }
                }}
              >
                <a>
                  <Button color="blue">나의 노트로 가기</Button>
                </a>
              </Link>
              <Link href="/editor">
                <a>
                  <Button color="olive">필기 시작하기</Button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

/*<Link
          href={{
            pathname: "/dashboard",
            query: {
              path: encodeSGMAStr("과학/지구과학"),
              pv: md5("과학/지구과학") // 샘플용임. 나중에 지워야 함
            }
          }}
>*/
