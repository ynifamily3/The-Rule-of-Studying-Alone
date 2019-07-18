// redux stores
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import index from "./reducers/index";
const finalCreateStore = applyMiddleware(thunk)(createStore);
export default finalCreateStore(index); // 여기서 스토어를 생성했다.

// https://justmakeyourself.tistory.com/entry/redex-exmaple
// https://holywater-jeong.github.io/blog/next-js-redux/
