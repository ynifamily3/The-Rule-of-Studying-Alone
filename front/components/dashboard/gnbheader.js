import "../../css/dashboard/header.css";
import { Icon, Input } from "semantic-ui-react";

export default ({ children }) => (
  <header className="dashboardGnb">
    <div className="logo">문제은행</div>
    <div className="searchBox">
      <form style={{ height: "100%" }}>
        <Input
          type="search"
          placeholder="검색..."
          className="searchForm"
          icon={{ name: "search", circular: false, link: true }}
          style={{
            width: "720px",
            height: "100%"
          }}
        />
      </form>
    </div>
    <div className="rightButtons">
      <span>지원</span>
      <span>메뉴</span>
      <span>계정</span>
    </div>
  </header>
);
