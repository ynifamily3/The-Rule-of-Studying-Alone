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
  FETCH_DOCS_FAILURE,
  ADD_FOLDER,
  ADD_FOLDER_SUCCESS,
  ADD_FOLDER_FAILURE
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

async function addFolderAPI({ subject_name, path, folder_name }) {
  // overwrite file 되는게 문제이다.... (폴더가 파일로 바뀐다!)
  const result = await axios
    .put(
      `${process.env.BACKEND_SERVICE_DOMAIN}/api/${process.env.BACKEND_SERVICE_API_VERSION}/doc/${subject_name}/${folder_name}`,
      {
        path,
        type: "folder"
      },
      { withCredentials: true }
    )
    .then(({ data }) => {
      if (data.success) {
        return { status: "success" };
      } else if (data.isLogin && data.isLogin === false) {
        return { status: "failure-loginRequired" };
      } else {
        return { status: "failure" }; // 이런 리턴으론 안 되는 거 같다.
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

function* addFolder(action) {
  const result = yield call(addFolderAPI, action.data);
  if (result.status === "success") {
    yield put({
      type: ADD_FOLDER_SUCCESS,
      data: action.data
    });
  } else {
    yield put({
      type: ADD_FOLDER_FAILURE
    });
  }
}

function* watchfetchDocs() {
  yield takeLatest(FETCH_DOCS, fetchDocs);
}

function* watchaddFolder() {
  yield takeLatest(ADD_FOLDER, addFolder);
}

export default function* docsSaga() {
  yield all([fork(watchfetchDocs), fork(watchaddFolder)]);
}
