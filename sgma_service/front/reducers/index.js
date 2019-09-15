import { combineReducers } from "redux";
import userinfo from "./userinfo";
import docs from "./docs";
import subjects from "./subjects";

const rootReducer = combineReducers({
  userinfo,
  subjects,
  docs
});

export default rootReducer;
