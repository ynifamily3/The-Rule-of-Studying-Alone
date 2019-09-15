import { Base64 } from "./core.js.mangle";

export const encodeSGMAStr = rawString =>
  rawString ? Base64.encode(rawString) : "";
export const decodeSGMAStr = encodedString =>
  encodedString ? Base64.decode(encodedString) : "";
