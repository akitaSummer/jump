import {
  DATAS_CLEARTYPE,
  DATAS_ERROR,
  UPDATESCHOOLLIST,
  UPDATE_CURRENT_RECOMMEND
} from "../constants";
import { RecommendType } from "../reducers";
import { getSchoolList } from "../../api";

export const updateCurrentRecommend = (data?: RecommendType) => {
  return data
    ? {
        type: UPDATE_CURRENT_RECOMMEND,
        data
      }
    : {
        type: UPDATE_CURRENT_RECOMMEND
      };
};

export const updateSchoolList = (data?: string[]) => {
  return data
    ? {
        type: UPDATESCHOOLLIST,
        data
      }
    : {
        type: DATAS_ERROR,
        data: UPDATESCHOOLLIST
      };
};

export const datasClearType = () => {
  return {
    type: DATAS_CLEARTYPE
  };
};

export const asyncUpdateSchoolList = (name: string) => async dispatch => {
  try {
    const { data } = await getSchoolList(name);
    console.log(data);
    dispatch(updateSchoolList(data.map(item => item.name)));
  } catch (e) {
    dispatch(updateSchoolList());
    console.log(e);
    throw e;
  }
};
