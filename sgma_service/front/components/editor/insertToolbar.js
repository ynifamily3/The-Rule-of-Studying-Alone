import "../../css/editor/insertToolbar.css";
import { Button } from "semantic-ui-react";
export default props => (
  <div className="insertToolbar">
    <Button.Group basic color="blue">
      <Button onClick={props.onClick}>제출 (Proto => Modal)</Button>
    </Button.Group>
  </div>
);
