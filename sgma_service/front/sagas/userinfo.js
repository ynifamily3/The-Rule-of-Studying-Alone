import { all, fork, takeLatest, put, call } from "redux-saga/effects";
import { LOG_IN, LOG_IN_SUCCESS, LOG_IN_FAILURE } from "../reducers/userinfo";
import fetch from "isomorphic-unfetch";

function loginAPI() {
  // 서버에 요청을 보내는 부분
  // (서드파티의 경우, callback 된 후, /api/userinfo 정보 확인으로 갈음)
  // https://yasm.miel.dev/api/userinfo
  console.log("뀨..?");

  return false;
}

function* login() {
  try {
    yield call(loginAPI); // 서버에 요청을 보낸다.
    yield put({
      // == dispatch
      type: LOG_IN_SUCCESS,
      data: {
        user: {
          auth_method: "서드파티(테스트)",
          user_id: "아이디(테스트)",
          nickname: "닉네임(테스트)",
          email: "test@testdomain.com",
          profile_photo: "test.jpg",
          createdAt: "2019-03-03(테스트)"
        }
      }
    });
  } catch (e) {
    console.error(e);
    yield put({
      // == dispatch
      type: LOG_IN_FAILURE
    });
  }
}

function* watchLogin() {
  yield takeLatest(LOG_IN, login); // LOG_IN Action을 감시한다.
}

export default function* userinfoSaga() {
  yield all([fork(watchLogin)]);
}

// 서버에 요청을 보낸다 -> request -> 로그인 성공(LOG_IN_SUCCESS) * / 로그인 실패(LOG_IN_FAILURE) -> 로그인 (LOG_IN)
