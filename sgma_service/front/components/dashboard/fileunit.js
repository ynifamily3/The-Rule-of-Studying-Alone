import { Checkbox, Icon } from "semantic-ui-react";
import Item from "./iconunit";
import { useCallback } from "react";
const FileIcon = ({ fileName, type, path }) => {
  const clickHandler = useCallback(e => {
    alert("click : " + path); // false : 파일
  }, []);
  return (
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
      <div onClick={clickHandler}>
        <Item>
          {type === "folder" ? (
            <Icon name="folder" size="huge" />
          ) : (
            <Icon name="file alternate" size="huge" />
          )}
        </Item>
        <div className="fileName">{fileName}</div>
      </div>
    </li>
  );
};

export default FileIcon;
