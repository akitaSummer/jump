import { combineReducers } from "redux";
import user from "./user";
import datas from "./datas";
import recommends from "./recommends";

export default combineReducers({ user, datas, recommends });

export * from "./user";
export * from "./datas";
export * from "./recommends";
