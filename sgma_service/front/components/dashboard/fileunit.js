import { Checkbox, Icon } from "semantic-ui-react";
import Item from "./iconunit";
const FileIcon = ({ fileName, type }) => {
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
      <Item type="folder">
        {type === "folder" ? (
          <Icon name="folder" size="huge" />
        ) : (
          <Icon name="file alternate" size="huge" />
        )}
      </Item>
      <div className="fileName">{fileName}</div>
    </li>
  );
};

export default FileIcon;
