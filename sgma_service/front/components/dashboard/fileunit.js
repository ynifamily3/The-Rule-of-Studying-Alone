import { Checkbox, Icon } from "semantic-ui-react";
import Item from "./iconunit";
import { useCallback } from "react";
import { encodeSGMAStr } from "../../libs/path-encryptor";
import { md5 } from "../../libs/md5";
import Router from "next/router";

const FileIcon = ({ fileName, type, path, subject }) => {
  const clickHandler = useCallback(
    e => {
      if (type === "folder") {
        // alert(`/dashboard?path=${encodeSGMAStr(path)}&pv=${md5(path)}`);
        // 실주소가 안바뀌고 param만 바뀌면 왠지 라우팅이 안 되는 거 같다.
        // Router.push(`/dashboard?path=${encodeSGMAStr(path)}&pv=${md5(path)}`);
        Router.push({
          pathname: "/dashboard",
          query: {
            subject,
            path: encodeSGMAStr(path),
            pv: md5(path)
          }
        });
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
      }
    },
    [path, fileName, subject] // 여기에 디팬던시를 추가해야 클로저 문제가 발생하지 않는다.
  );
  return (
    <li style={{cursor: 'pointer'}}>
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
      <div onClick={clickHandler}>
        <Item>
          {type === "folder" ? (
            <Icon name="folder" size="huge" />
          ) : (
            <Icon name="tasks" size="huge" />
          )}
        </Item>
        <div className="fileName">{fileName}</div>
      </div>
    </li>
  );
};

export default FileIcon;
