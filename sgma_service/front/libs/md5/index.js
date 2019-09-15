import { MD5 } from "./core.js.mangle";

export const md5 = text => (text ? MD5(text) : "");
