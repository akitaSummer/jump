import Taro from "@tarojs/taro";
import { UPDATESCHOOLLIST, DATAS_ERROR, DATAS_CLEARTYPE } from "../constants";

export type DatasStateType = {
  schoolList: string[];
  actionType: string;
  errMsg: string;
};

export const DATAS_INITIAL_STATE: DatasStateType = {
  schoolList: [],
  actionType: "DEFAULT",
  errMsg: ""
};

export default (state = DATAS_INITIAL_STATE, actions) => {
  switch (actions.type) {
    case UPDATESCHOOLLIST:
      return {
        ...state,
        actionType: actions.type,
        schoolList: actions.data
      };
    case DATAS_ERROR:
      return {
        ...state,
        actionType: actions.type,
        errMsg: actions.data
      };
    case DATAS_CLEARTYPE:
      return {
        ...state,
        actionType: DATAS_CLEARTYPE
      };
    default:
      return {
        ...state,
        actionType: actions.type
      };
  }
};
