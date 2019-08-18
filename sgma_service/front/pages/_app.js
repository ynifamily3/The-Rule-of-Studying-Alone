import React from "react";
import { Container } from "next/app";
import withRedux from "next-redux-wrapper";
import { createStore, compose, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reducer from "../reducers";

// store == state + action + reducer

const YASM = ({ Component, store }) => {
  return (
    <Provider store={store}>
      <Container>
        <Component />
      </Container>
    </Provider>
  );
};

export default withRedux((initialState, options) => {
  const middlewares = []; // redux-saga
  // 밑 부분은 바뀔 일이 거의 없다고 한다. 왠만한 프로젝트에서는..
  // if (!options.isServer) console.log(window.__REDUX_DEVTOOLS_EXTENSION__);
  const enhancer = compose(
    applyMiddleware(...middlewares),
    !options.isServer && window.__REDUX_DEVTOOLS_EXTENSION__ !== undefined
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f // else 용 dummy function
  ); // 브라우저에서 디버깅을 허용하는 미들웨어
  // 미들웨어는 액션과 스토어 사이에서 동작한다.
  const store = createStore(reducer, initialState, enhancer);
  // store 커스터마이징 할 때 이 곳으로
  return store;
})(YASM); // 고차 컴포넌트로 활용 (store 가 떨궈짐) (외워라..)
