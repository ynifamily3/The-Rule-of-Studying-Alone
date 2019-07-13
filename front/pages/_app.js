import App, { Container } from "next/app";
import React from "react";
import { Provider } from "react-redux";
import store from "../store";
/////////////////////////////////////////////////
import reducer from "../reducers";
import { createStore } from "redux";
// import { Provider } from "react-redux";
// const store = createStore(reducer);

export default class YASM extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}
