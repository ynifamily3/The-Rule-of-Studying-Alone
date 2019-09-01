import axios from "axios";
import { all, fork, takeLatest, put, call } from "redux-saga/effects";
import {
  ADD_SUBJECT,
  ADD_SUBJECT_SUCCESS,
  ADD_SUBJECT_FAILURE
} from "../reducers/subjects";

function addSubjectAPI() {
  return false;
}

function* addSubject() {
  try {
    yield call(addSubjectAPI); // 서버에 요청을 보낸다.
    yield put({
      // == dispatch
      // data["subject_name"],
      type: ADD_SUBJECT_SUCCESS,
      data: {
        subject_name: "data-".concat(Math.random())
      }
    });
  } catch (e) {
    console.error(e);
    yield put({
      // == dispatch
      // 추후에 실패할 경우 서버에서 전체 데이터 API를 다시 받아와서 재적용시켜야 꼬이는걸 방지할 수도 있을 것이다. (멀티세션 등의 문제, failure안 떠도 마찬가지임)
      // 예를 들어 한 컴퓨터에서 add하고 다른 컴퓨터에서(프로세스에서) add하면 둘다 추가됐는데 두 컴퓨터에는 각각 자기가 추가한거밖에 안보임. (새로고침해서 api를 다시 뜨지 않는 이상)
      // 따라서 정기적인 서버 작업 (모두 재갱신)이 필요할 것이다.
      type: ADD_SUBJECT_FAILURE
    });
  }
}

function* watchaddSubject() {
  yield takeLatest(ADD_SUBJECT, addSubject); // LOG_IN Action을 감시한다.
}

export default function* subjectsSaga() {
  yield all([fork(watchaddSubject)]);
}
