import React, { Component } from "react";
import "../../css/editor/insertToolbar.css";
import { Button, Loader, Dimmer } from "semantic-ui-react";

class InsertToolbarComponent extends Component {
  // const [loading, setLoading] = useState(false);
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.clickHandler = this.clickHandler.bind(this);
  }
  clickHandler(which) {
    return () => {
      switch (which) {
        case 0:
          this.props.onClick(); // invoke
          return;
        case 1:
          this.setState({
            loading: true
          });
          this.props.onClick2();
        default:
          return;
      }
    };
  }
  render() {
    return (
      <div className="insertToolbar">
        <Dimmer active={this.state.loading} inverted>
          <Loader />
        </Dimmer>
        <Button.Group basic color="orange">
          <Button onClick={this.clickHandler(0)}>문제 생성하기</Button>
          <Button onClick={this.clickHandler(1)}>작성 내용 저장하기</Button>
        </Button.Group>
      </div>
    );
  }
}
export default InsertToolbarComponent;
