import React, { Component } from "react";
import "../../css/editor/insertToolbar.css";
import { Button, Loader, Dimmer, Icon } from "semantic-ui-react";
import Router from "next/router";

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
          return;
        case 2:
            Router.back();
            return;
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
        <Button basic onClick={this.clickHandler(2)}><Icon name="reply"/>돌아가기</Button>
        <Button.Group basic>
          <Button onClick={this.clickHandler(0)} ><Icon name="pencil"/>현재 내용으로 문제 풀어보기</Button>
          <Button onClick={this.clickHandler(1)}><Icon name="edit outline"/>작성 내용 저장하기</Button>
        </Button.Group>
      </div>
    );
  }
}
export default InsertToolbarComponent;
