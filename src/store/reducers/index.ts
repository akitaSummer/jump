import { combineReducers } from "redux";
import user from "./user";
import datas from "./datas";
import recommends from "./recommends";
import history from "./history";

export default combineReducers({ user, datas, recommends, history });

export * from "./user";
export * from "./datas";
export * from "./recommends";
export * from "./history";
