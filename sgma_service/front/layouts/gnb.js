// 설계가 잘못된 페이지이다. 여기에는 레이아웃만 들어가고, 컴포넌트를 include해야 됨
// css 임포트는 컴포넌트에서 해야 한다. 변경 요망
import "../css/gnb.css";
import Link from "next/link";
import { Image } from "semantic-ui-react";

export default () => (
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
          <ul>
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
                <a>투자정보</a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a>서비스</a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a>소셜</a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a>고객지원</a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a>채용정보</a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
);
