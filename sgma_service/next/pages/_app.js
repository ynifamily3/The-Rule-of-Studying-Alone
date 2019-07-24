import App, { Container } from "next/app";
import React from "react";
// import { Provider } from "react-redux";
// import store from "../stores";

export default class YASM extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}
