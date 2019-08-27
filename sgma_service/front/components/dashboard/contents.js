import "../../css/dashboard/contents.css";
import { Checkbox, Button, Icon } from "semantic-ui-react";
import Item from "./itemunit";
let jsxObject = fileName => (
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
    <Item type="folder">
      <Icon name="folder" size="huge" />
    </Item>
    <div className="fileName">{fileName}</div>
  </li>
);

const DashboardContentComponents = props => {
  console.log(props); // 이 데이터를 믿고 싶은데 현실은 서버에서 다시 fetch 해야 함.
  // 이럴거면 redux 안쓰고 그냥 지영이한테 graphQL 시킬걸
  return (
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
          {jsxObject("수학")}
          {jsxObject("과학")}
        </ul>
      </div>
    </article>
  );
};

export default DashboardContentComponents;
