import "../../css/dashboard/aside.css";
import { Button, Icon, Label } from "semantic-ui-react";
export default ({ children }) => (
  <aside className="dashboardAside">
    <div className="makeNew">
      <Button icon labelPosition="left" basic size="big" color="blue">
        <Icon name="plus" className="backrevertBlue" />
        <span style={{ fontFamily: `"Roboto", "Noto Sans KR", sans-serif` }}>
          새로 만들기
        </span>
      </Button>
    </div>
    <div className="">
      <ul className="">
        <li className="current">
          <div>
            <Icon name="file text" size="large" />
            <i className="padlr" />내 문제함
          </div>
        </li>
        <li>
          <div>
            <Icon name="share" size="large" />
            <i className="padlr" />
            공유 문제함
          </div>
        </li>
        <li>
          <div>
            <Icon name="star" size="large" />
            <i className="padlr" />
            중요 문제함
          </div>
        </li>
        <hr />
        <li>
          <div>
            <Icon name="trash" size="large" />
            <i className="padlr" />
            휴지통
          </div>
        </li>
        <hr />
        <li className="capacity">
          <div>
            <Icon name="server" size="large" />
            <i className="padlr" />
            저장용량
          </div>
        </li>
      </ul>
    </div>
  </aside>
);
