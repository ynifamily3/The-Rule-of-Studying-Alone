import React from "react";
import { Input } from "semantic-ui-react";

class TextBox extends React.Component {
  render() {
    return (
      <Input
        type={this.props.type}
        icon={this.props.icon}
        iconPosition="left"
        fluid
        placeholder={this.props.placeholder}
        width="50%"
      />
    );
  }
}

export default TextBox;
