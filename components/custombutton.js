import React from "react";
import { Button, Icon, Input } from "semantic-ui-react";

class CustomButton extends React.Component {
  static async getInitialProps({ req }) {
    /*
    getInitialProps 의 호출
    URL주소를 이용해 직접 특정 페이지를 접근하면 Nodejs 환경에서 getInitialProps 가 호출됨
    클라이언트(웹브라우져)에서 SPA로 화면 이동할 경우에는 브라우져 환경에서 getInitialProps 가 호출됨
    getInitialProps 가 plain object 를 리턴하면 해당 객체가 그대로 constructor 의 props로 전달됨
    서버에서 rendering 된 html 이 그대로 클라이언트로 내려옴
    클라이언트에서는 constructor 에서 props를 통해 전달받은 데이터를 이용해 추가적인 서버 요청없이 화면을 똑같이 다시 한번 더 그림
    */
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    return { userAgent };
  }

  render() {
    return (
      <Button animated style={{ margin: 0 }} id={this.props.id}>
        <Button.Content visible>{this.props.label}</Button.Content>
        <Button.Content hidden>
          <Icon name="arrow right" />
        </Button.Content>
      </Button>
    );
  }
}

export default CustomButton;
