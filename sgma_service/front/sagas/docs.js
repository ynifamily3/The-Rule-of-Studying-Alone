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

import {
  FETCH_DOCS,
  FETCH_DOCS_SUCCESS,
  FETCH_DOCS_FAILURE
} from "../reducers/docs";
import Immutable, { Map, List, isImmutable } from "immutable";

async function fetchDocsAPI({ subject_name }) {
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

function* fetchDocs(action) {
  const result = yield call(fetchDocsAPI, action.data); // action.data가 맞나?
  if (result === 0) {
    yield put({
      type: FETCH_DOCS_FAILURE
    });
  } else {
    // console.log(`페치 ${action.data.subject_name}의 docs`);
    // console.log(result);
    yield put({
      type: FETCH_DOCS_SUCCESS,
      data: Map(result) // Map? List?
      // 밑은 디버그용 데이터
      /*data: Immutable.fromJS({
        docs: [
          {
            type: "folder",
            name: "과학",
            docs: [
              { type: "folder", name: "기타과학", docs: [] },
              {
                type: "folder",
                name: "지구과학",
                docs: [
                  { type: "file", name: "지구과학의 역사" },
                  { type: "file", name: "내가 지구를 만들었다" }
                ]
              }
            ]
          },
          { type: "folder", name: "리시프", docs: [] },
          { type: "file", name: "수학" }
        ]
      })*/
    });
  }
}

function* watchfetchDocs() {
  yield takeLatest(FETCH_DOCS, fetchDocs);
}

export default function* docsSaga() {
  yield all([fork(watchfetchDocs)]);
}
