import "../css/gnb.css";
import Link from "next/link";
export default () => (
  <header className="gnbHeader">
    <div className="headerWrap">
      <div className="boxGnb">
        <h1>Logo</h1>
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
