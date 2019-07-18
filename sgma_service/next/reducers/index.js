import { combineReducers } from "redux";
import counter from "./counter";
/* 여러 Reducer를 묶는다. 현재 예제는 하나이지만 추후에 여러 개 Reducer를 생성 예정이라면 아래와 같이 사용하면 된다. */
export default combineReducers({
  counter
});
