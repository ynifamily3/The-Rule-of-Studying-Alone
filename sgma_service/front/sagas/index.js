import { all, call } from "redux-saga/effects";
import userinfo from "./userinfo";
import docs from "./docs";

export default function* rootSaga() {
  yield all([call(userinfo), call(docs)]);
}
