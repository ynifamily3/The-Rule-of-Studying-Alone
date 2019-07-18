import "../../css/dashboard/aside.css";
import { Button, Icon } from "semantic-ui-react";
export default ({ children }) => (
  <aside className="dashboardAside">
    <div className="">
      <Button icon labelPosition="left" basic color="blue">
        <Icon name="plus" />
        새로 만들기
      </Button>
    </div>
    <div className="">
      <ul className="">
        <li>내 문제함</li>
        <li>공유 문제함</li>
        <hr />
        <li>휴지통</li>
        <hr />
        <li>저장용량</li>
      </ul>
    </div>
  </aside>
);
