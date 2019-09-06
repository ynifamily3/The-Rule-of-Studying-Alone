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
  ADD_SUBJECT,
  ADD_SUBJECT_SUCCESS,
  ADD_SUBJECT_FAILURE,
  FETCH_SUBJECT,
  FETCH_SUBJECT_SUCCESS,
  FETCH_SUBJECT_FAILURE
} from "../reducers/subjects";
import { Map } from "immutable";

// const HEELO_SAGA = "HELLO_SAGA";

function addSubjectAPI({ subject_name }) {
  console.log(subject_name);
  axios
    .put(
      `${process.env.BACKEND_SERVICE_DOMAIN}/api/doc/${subject_name}`,
      {},
      {
        withCredentials: true
      }
    )
    .then(({ data }) => {
      console.log(data);
      // alert(data); // 해당 메시지 표출은 saga의 call API 단에서 잡아내야 한다. 여기도 수정
      const { result } = data;
      if (!result || result !== APISET.API_ADD_SUBJECT_SUCCESS) {
        return APISET.API_ADD_SUBJECT_FAILURE_SAME;
      }
      return APISET.API_ADD_SUBJECT_SUCCESS;
    });
  // 잘되는데 미완
}

function fetchSubjectAPI() {
  axios(`${process.env.BACKEND_SERVICE_DOMAIN}/api/docs`, {
    withCredentials: true
  }).then(({ data }) => {
    if (data.isLogin === false) {
      return 0; // fail
    } else {
      return data; // success
      // redux-saga에서 fetch한 것들을 state로 바꾸는 방법은 무엇일까/
    }
  });
}

function* fetchSubject(action) {
  const result = yield call(fetchSubjectAPI); // result 가 안 넘어온다?
  console.warn(result);
  if (result === 0) {
    // login failed 등의 문제
    yield put({
      type: FETCH_SUBJECT_FAILURE
    });
  } else {
    yield put({
      type: FETCH_SUBJECT_SUCCESS,
      data: Map(result)
    });
  }
  // if (result === APISET)
}

function* addSubject(action) {
  // payload를 가져올 수 있을 것이라 기대한다.
  //try {
  // yield delay(100);
  const result = yield call(addSubjectAPI, action.data); // 서버에 요청을 보낸다.\
  // 리턴값 어떻게 가져오지. 이렇게 result 하는게 의미가 없다구!@!@
  if (result === APISET.API_ADD_SUBJECT_SUCCESS) {
    yield put({
      // == dispatch
      // data["subject_name"],
      type: ADD_SUBJECT_SUCCESS,
      data: Map({
        subject_name: action.data["subject_name"]
      })
    });
  } else {
    yield put({
      type: ADD_SUBJECT_FAILURE
    });
  }

  //} catch (e) {
  //console.error(e);
  //yield put({
  // == dispatch
  // 추후에 실패할 경우 서버에서 전체 데이터 API를 다시 받아와서 재적용시켜야 꼬이는걸 방지할 수도 있을 것이다. (멀티세션 등의 문제, failure안 떠도 마찬가지임)
  // 예를 들어 한 컴퓨터에서 add하고 다른 컴퓨터에서(프로세스에서) add하면 둘다 추가됐는데 두 컴퓨터에는 각각 자기가 추가한거밖에 안보임. (새로고침해서 api를 다시 뜨지 않는 이상)
  // 따라서 정기적인 서버 작업 (모두 재갱신)이 필요할 것이다.
  //type: ADD_SUBJECT_FAILURE
  //});
  //}
}

function* watchaddSubject() {
  yield takeLatest(ADD_SUBJECT, addSubject); // ADD_SUBJECT Action을 감시한다.
}

function* watchfetchSubject() {
  yield takeLatest(FETCH_SUBJECT, fetchSubject);
}

/*
function* testSaga() {
  console.log("hello ^^");
  yield take(HEELO_SAGA); // take가 HELLO_SAGA를 기다리겠다는 뜻임
  // take : 해당 액션이 dispatch되면 generator를 next하는 이펙트
  // 비동기, 타이머 해도 됨
  // 같은 action을 여러번 dispatch를 듣기 위해선 (함수가 안 끝나게)
  // while(true) {yield ...} 해도 됨
  // while (let i = 0; i < ; i++) 하면 dispatch 수를 제한시킬 수 있음
}
*/

export default function* subjectsSaga() {
  yield all([fork(watchaddSubject), fork(watchfetchSubject)]);
  /*
  yield all([ // 하나만 있을땐 yield testSaga(); 해도 되는데 여러개라면..
    // all 은 여러 이펙트를 동시에 실행할 수 있게 한다.
      testSaga(),
      watchXXX(), // watch 컨벤션 사용 권장
      watchYYY(),
      ...
  ])
  */
}
