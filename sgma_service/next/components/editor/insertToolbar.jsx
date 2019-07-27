import "../../css/editor/insertToolbar.css";
import { Button } from "semantic-ui-react";
export default ({ children }) => (
  <div className="insertToolbar">
    <Button.Group basic color="blue">
      <Button>
        (#) 주제 넣기 (수준 내리기 : Tab, 수준 올리기 : Shift + Tab)
      </Button>
      <Button>(*) 속성(지식) 넣기</Button>
    </Button.Group>
  </div>
);
