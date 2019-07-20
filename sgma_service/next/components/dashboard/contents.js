import "../../css/dashboard/contents.css";
import { Checkbox, Button, Icon } from "semantic-ui-react";
import Item from "./itemunit";
let jsxObject = (
  <li>
    <div className="itemHeader">
      <span
        style={{
          display: "flex",
          alignItems: "center"
        }}
      >
        <Checkbox size="small" />
      </span>
      <span>
        <Icon name="star outline" />
      </span>
    </div>
    <Item type="folder">{"{{fileIcon}}"}</Item>
    <div className="fileName">{"{{fileName}}"}</div>
  </li>
);
export default ({ children }) => (
  <article className="contents">
    <div className="functions">
      <span className="box">
        <Checkbox size="small" />
      </span>
      <span className="group1">
        <Button.Group basic>
          <Button>새 과목</Button>
          <Button>PDF로 만들기</Button>
          <Button>삭제</Button>
        </Button.Group>
      </span>
      <Button basic>새 폴더</Button>
      <Button basic>공유</Button>
    </div>
    <div className="workingArea">
      <ul className="items">
        {jsxObject}
        {jsxObject}
        {jsxObject}
        {jsxObject}
        {jsxObject}
      </ul>
    </div>
  </article>
);
