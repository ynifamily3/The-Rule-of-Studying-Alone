import React from "react";
import { Button, Icon } from "semantic-ui-react";

const ThirdPartyButton = props => {
  const { label, icon, color, onClick } = props;
  return (
    <Button color={color} onClick={onClick}>
      {icon ? <Icon name={icon} /> : ""}
      {label}
    </Button>
  );
};

/*
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
*/

export default ThirdPartyButton;
