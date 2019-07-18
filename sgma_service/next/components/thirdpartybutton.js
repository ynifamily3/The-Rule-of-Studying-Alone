import React from "react";
import { Button, Icon } from "semantic-ui-react";

class ThirdPartyButton extends React.Component {
  render() {
    return (
      <Button color={this.props.color}>
        {this.props.icon ? <Icon name={this.props.icon} /> : ""}
        {this.props.label}
      </Button>
    );
  }
}

export default ThirdPartyButton;
