import React, { useState, useEffect, useCallback } from "react";
import "../../css/dashboard/contents.css";
import { Checkbox, Button, Icon } from "semantic-ui-react";
import FileItems from "./fileitems";
import Steps from "./steps";
import { useSelector, useDispatch } from "react-redux";
import Router, { useRouter } from "next/router";
import { ADD_FOLDER, ADD_FILE } from "../../reducers/docs";

const DashboardContentComponents = props => {
  // 여기서 docs를 redux-data 가져와서 props 같이 쓰면 좋을 것 같다.
  // const [docs, setDocs] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();
  //const docsDefault = useSelector(state => state.docs); // 여기랑 pages 의 dashboard랑 미묘한 타이밍이 존재
  // 따라서 props 로 전달해주는게 맞는거같다. 셀렉터보단, 여기를 수정할 예정
  const docsDefault = props.docsDefault;
  const docs = docsDefault ? docsDefault.toJS() : { loading: true };
  if (docs.error) {
    // 리다이렉트 유도
    alert(docs.error);
    router.replace("/subjects");
    return (
      <div>
        Failed to Load :<br /> message : {docs.error}
      </div>
    );
  } else if (docs.isLogin === false) {
    router.replace("/login");
    return <div>Login 필요함.</div>;
  } else if (docs.loading === true) {
    return <div>Loading...</div>;
  }

  const newFolderClick = e => {
    const input = prompt(
      `새로운 folder 이름 입력 : \nSUBJECT : ${props.subject}\nPATH : ${props.path}`,
      ""
    );
    // alert(input.trim());
    if (input) {
      dispatch({
        type: ADD_FOLDER,
        data: {
          subject_name: props.subject,
          path: props.path ? "/".concat(props.path) : "",
          folder_name: input.trim()
        }
      });
    }
  };

  const gotoMockTest = e => {
    let path = props.path;
    let pathCut = path.split("/");
    let file = pathCut.pop();
    pathCut = pathCut.join("/");
    if (pathCut.length) pathCut = "/".concat(pathCut);
    Router.push({
      pathname: "/mocktest",
      query: {
        subject: props.subject,
        path: pathCut,
        file: file
      }
    });
  };

  const newFileClick = e => {
    const input = prompt(`새로운 문서 이름 입력 : `, "");
    if (input) {
      dispatch({
        type: ADD_FILE,
        data: {
          subject_name: props.subject,
          path: props.path ? "/".concat(props.path) : "",
          file_name: input.trim()
        }
      });
    }
  };

  return (
    <article className="contents">
      <div
        className="pathViewArea"
        style={{ paddingLeft: "10px", marginBottom: "8px" }}
      >
        <Steps subject={props.subject} path={props.path} />
        {/* path indicator */}
      </div>
      <div className="functions">
        {/*<span className="box">
          <Checkbox size="small" />
  </span>*/}
        <span className="group1">
          <Button.Group>
            <Button color="grey" basic onClick={newFileClick}>
              <Icon name="edit outline" />새 과목
            </Button>
            <Button color="grey" basic onClick={newFolderClick}>
              <Icon name="folder open outline" />새 폴더
            </Button>
          </Button.Group>
        </span>
        <Button.Group>
          <Button color="black" basic onClick={gotoMockTest}>
            <Icon name="pencil alternate" />
            현재 폴더 내 문제 풀어보기
          </Button>
        </Button.Group>
      </div>

      <div className="workingArea">
        <FileItems subject={props.subject} docs={docs} path={props.path} />
      </div>
    </article>
  );
};

export default DashboardContentComponents;
