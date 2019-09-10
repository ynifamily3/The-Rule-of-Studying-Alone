import "../../css/dashboard/contents.css";
import { Checkbox, Button } from "semantic-ui-react";
import FileItems from "./fileitems";
import Steps from "./steps";
import { useSelector } from "react-redux";
import { toJS } from "immutable";
import { useState, useEffect } from "react";

const DashboardContentComponents = props => {
  // 여기서 docs를 redux-data 가져와서 props 같이 쓰면 좋을 것 같다.
  // const [docs, setDocs] = useState([]);
  const docsDefault = useSelector(state => state.docs);
  const docs = docsDefault.toJS ? docsDefault.toJS() : []; // 처음에는 [] 라서 toJS가 없어서 에러가 생겼었음.

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
      <div
        className="pathViewArea"
        style={{ paddingLeft: "10px", marginBottom: "8px" }}
      >
        <Steps path={props.path} /> {/* path indicator */}
      </div>
      <div className="workingArea">
        <FileItems docs={docs} path={props.path} />
      </div>
    </article>
  );
};

export default DashboardContentComponents;
