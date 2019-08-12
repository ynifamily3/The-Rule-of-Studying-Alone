import { combineReducers } from "redux";
import userinfo from "./userinfo";
import docs from "./docs";

const rootReducer = combineReducers({
  userinfo,
  docs
});

export default rootReducer;
