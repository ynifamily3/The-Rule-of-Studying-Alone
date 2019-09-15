import "../../css/editor/insertToolbar.css";
import { Button } from "semantic-ui-react";
export default props => (
  <div className="insertToolbar">
    <Button.Group basic color="orange">
      <Button onClick={props.onClick}>문제 생성하기</Button>
      <Button onClick={props.onClick2}>저장하기</Button>
    </Button.Group>
  </div>
);
