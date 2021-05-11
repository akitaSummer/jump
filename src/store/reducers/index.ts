import { combineReducers } from "redux";
import user from "./user";
import datas from "./datas";

export default combineReducers({ user, datas });

export * from "./user";
export * from "./datas";
