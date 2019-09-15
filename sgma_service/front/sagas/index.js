import { all, call } from "redux-saga/effects";
import userinfo from "./userinfo";
import subjects from "./subjects";
import docs from "./docs"; // deprecated

export default function* rootSaga() {
  yield all([call(userinfo), call(subjects), call(docs)]);
}
