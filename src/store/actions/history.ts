import {
  UPDATER_HISTORY_LIST,
  UPDATE_CURRENT_HISTORY,
  HISTORY_CLEARTYPE,
  HISTORY_ERROR
} from "../constants";

import { SchedulesType } from "../reducers";

import { getHistoryList } from "../../api";

export const updateCurrentHistory = (data?: SchedulesType) => {
  return data
    ? {
        type: UPDATE_CURRENT_HISTORY,
        data
      }
    : {
        type: UPDATE_CURRENT_HISTORY
      };
};

export const updateHistoryList = (data?: SchedulesType[]) => {
  return data
    ? {
        type: UPDATER_HISTORY_LIST,
        data
      }
    : {
        type: HISTORY_ERROR,
        data: UPDATER_HISTORY_LIST
      };
};

export const historyClearType = () => {
  return {
    type: HISTORY_CLEARTYPE
  };
};

export const asyncGetHistoryList = (access_token: string) => async dispatch => {
  try {
    const { data } = await getHistoryList(access_token);
    dispatch(updateHistoryList(data));
  } catch (e) {
    dispatch(updateHistoryList());
    console.log(e);
  }
};
