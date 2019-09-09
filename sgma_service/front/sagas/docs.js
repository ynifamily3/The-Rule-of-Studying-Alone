import axios from "axios";
import APISET from "../apiresultstrings/doc";
import {
  all,
  fork,
  take,
  takeLatest,
  put,
  call,
  delay
} from "redux-saga/effects";

import { FETCH_DOCS } from "../reducers/docs";
import { Map, List } from "immutable";

async function fetchDocsAPI(subject_name) {
  const result = await axios(
    `${process.env.BACKEND_SERVICE_DOMAIN}/api/doc/${subject_name}`,
    {
      withCredentials: true
    }
  ).then(({ data }) => {
    if (data.error || data.isLogin === false) {
      return 0; // fail
    } else {
      return data; // success
    }
  });
  return result;
}

// 이 부분도 수정해 줘야 할 것 같습니다. 2019 09 09
function* fetchDocs(action) {
  const result = yield call(fetchDocsAPI, action.data); // action.data가 맞나?
  if (result === 0) {
    yield put({
      type: FETCH_DOCS_FAILURE
    });
  } else {
    yield put({
      type: FETCH_DOCS_SUCCESS,
      data: Map(result) // Map? List?
    });
  }
}

export default function* docsSaga() {
  yield all([]);
}
