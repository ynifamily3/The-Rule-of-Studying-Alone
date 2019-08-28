import "../../css/dashboard/contents.css";
import { Checkbox, Button } from "semantic-ui-react";
import FileItems from "./fileitems";

const DashboardContentComponents = props => {
  // if (typeof window !== "undefined") console.log(props); // 여기서 props가 진실의 근원이다.
  // {user: {…}, docs: {…}, path: ""}
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
        <FileItems docs={props.docs} path={props.path} />
      </div>
    </article>
  );
};

export default DashboardContentComponents;
