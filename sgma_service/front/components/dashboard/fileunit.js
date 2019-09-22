import { Checkbox, Icon, Button } from "semantic-ui-react";
import Item from "./iconunit";
import { useCallback, useState } from "react";
import { encodeSGMAStr } from "../../libs/path-encryptor";
import { md5 } from "../../libs/md5";
import Router from "next/router";
import { useDispatch } from "react-redux";
import { DELETE_ELEMENT } from "../../reducers/docs";

const FileIcon = ({ fileName, type, path, subject }) => {
  const dispatch = useDispatch();
  const [clickState, setClickState] = useState(0);
  const noHandler = useCallback(e=>{
    setClickState(0);
  }, [setClickState]);
  const deleteClickHandler = useCallback(e => {
    // 
    if (confirm('정말로 삭제하시겠습니까?')) {
      // subject_name, path, elem_name
      let pathCut = path.split("/");
      pathCut.pop();
      pathCut = pathCut.join("/");
      if (pathCut.length) pathCut = "/".concat(pathCut);
      dispatch({
        type: DELETE_ELEMENT,
        data: {
          subject_name: subject,
          path: pathCut,
          elem_name: fileName
        }
      });
    }
  }, [dispatch, subject, fileName, path]);
  const enterClickHandler = useCallback(
    e => {
      //e.stopPropagation();
      //setClickState(0);
      Router.push({
        pathname: "/dashboard",
        query: {
          subject,
          path: encodeSGMAStr(path),
          pv: md5(path)
        }
      });
    },
    [path, subject]
  );
  const editClickhandler = useCallback(
    e => {
      let pathCut = path.split("/");
      pathCut.pop();
      pathCut = pathCut.join("/");
      if (pathCut.length) pathCut = "/".concat(pathCut);
      // path 정규화 : path가 root 이면 empty string, path가 있으면 앞에 / 붙이고 뒤에 파일명 빼고
      Router.push({
        pathname: "/editor",
        query: {
          subject_name: subject,
          path: pathCut,
          file_name: fileName
        }
      });
    },
    [fileName, path, subject]
  );
  const gotoMockClickhandler = useCallback(e => {
    //
    let pathCut = path.split("/");
    pathCut.pop();
    pathCut = pathCut.join("/");
    if (pathCut.length) pathCut = "/".concat(pathCut);
    // path 정규화 : path가 root 이면 empty string, path가 있으면 앞에 / 붙이고 뒤에 파일명 빼고
    Router.push({
      pathname: "/mocktest",
      query: {
        subject: subject,
        path: pathCut,
        file: fileName
      }
    });
  }, [fileName, path, subject]);
  const closeClickHandler = useCallback(
    e => {
      e.stopPropagation(); // 이거 써야 부모가 눌리는걸 (이벤트 전파) 막을 수 있다.
      setClickState(0);
    },
    [setClickState]
  );
  // path, fileName, subject
  const clickHandler = useCallback(
    e => {
      setClickState(1);
      /*
        Router.push({
          pathname: "/dashboard",
          query: {
            subject,
            path: encodeSGMAStr(path),
            pv: md5(path)
          }
        });
        */
      /*
      } else {
        let pathCut = path.split("/");
        pathCut.pop();
        pathCut = pathCut.join("/");
        if (pathCut.length) pathCut = "/".concat(pathCut);
        // path 정규화 : path가 root 이면 empty string, path가 있으면 앞에 / 붙이고 뒤에 파일명 빼고
        Router.push({
          pathname: "/editor",
          query: {
            subject_name: subject,
            path: pathCut,
            file_name: fileName
          }
        });
        
        // 역사
      }*/
    },
    [] // 여기에 디팬던시를 추가해야 클로저 문제가 발생하지 않는다.
  );
  return (
    <li style={{ cursor: "pointer" }}>
      <div className="itemHeader">
        <span
          style={{
            display: "flex",
            alignItems: "center"
          }}
        >
          <Checkbox size="small" checked={false} />
        </span>
        <span>
          <Icon name="star outline" />
        </span>
      </div>
      <div onMouseEnter={clickHandler} onMouseOver={clickHandler} onMouseLeave={noHandler}>
        <Item>
          {clickState === 0 ? (
            type === "folder" ? (
              <Icon name="folder" size="huge" />
            ) : (
              <Icon name="tasks" size="huge" />
            )
          ) : (
            <div>
              <Button.Group vertical>
              <Button color="blue" basic onClick={gotoMockClickhandler}>
                  <Icon color="blue" name="pencil alternate"/>
                  문제풀기
                </Button>
                {type === "folder" && (
                  <Button basic onClick={enterClickHandler}>
                    <Icon name="play"/>
                    들어가기
                  </Button>
                )}
                {type === "file" && (
                  <Button basic onClick={editClickhandler}>
                    <Icon name="edit"/>
                    문서편집
                  </Button>
                )}
                <Button basic color='red' onClick={deleteClickHandler}>
                  <Icon name="x"/>
                  삭제하기
                </Button>
              </Button.Group>
            </div>
          )}
        </Item>
        <div className="fileName">{fileName}</div>
      </div>
    </li>
  );
};

export default FileIcon;
