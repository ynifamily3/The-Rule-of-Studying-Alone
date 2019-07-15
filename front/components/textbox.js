import React from "react";
import { Input } from "semantic-ui-react";

class TextBox extends React.Component {
  render() {
    return <Input {...this.props} iconPosition="left" fluid />;
  }
}

export default TextBox;
