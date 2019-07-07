import React from "react";
import { Button, Icon, Input } from "semantic-ui-react";

class CustomButton extends React.Component {
  static async getInitialProps({ req }) {
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    return { userAgent };
  }

  render() {
    return (
      <Button animated style={{ margin: 0 }}>
        <Button.Content visible>{this.props.label}</Button.Content>
        <Button.Content hidden>
          <Icon name="arrow right" />
        </Button.Content>
      </Button>
    );
  }
}

export default CustomButton;
