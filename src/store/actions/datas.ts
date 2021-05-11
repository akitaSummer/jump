import { DATAS_CLEARTYPE, DATAS_ERROR, UPDATESCHOOLLIST } from "../constants";
import { getSchoolList } from "../../api";

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
