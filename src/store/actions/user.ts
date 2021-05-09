import {
  UPDATE_USERPROFILE,
  UPDATE_USERINFOFROMDB,
  UPDATEACCESSTOKEN,
  SUBMITUSERINFOTODB,
  CLEARTYPE,
  UPDATE_USERINFOEDIT,
  RESET_USERINFOEDIT,
  ERROR
} from "../constants";
import {
  UserProfileType,
  UserInfoFromDbType,
  UserInfoEditType
} from "../reducers";
import { getSetting, getUserInfo, updateUser } from "../../api";

export const restUserInfoEdit = () => {
  return {
    type: RESET_USERINFOEDIT
  };
};

export const updateUserInfoEdit = (value, type) => {
  return {
    type: UPDATE_USERINFOEDIT,
    data: {
      type,
      value
    }
  };
};

export const clearType = () => {
  return {
    type: CLEARTYPE
  };
};

const updateUserProfile = (data?: UserProfileType) => {
  return data
    ? {
        type: UPDATE_USERPROFILE,
        data
      }
    : {
        type: ERROR,
        data: UPDATE_USERPROFILE
      };
};

const updateUserInfoFromDb = (data?: UserInfoFromDbType) => {
  return data
    ? {
        type: UPDATE_USERINFOFROMDB,
        data
      }
    : {
        type: ERROR,
        data: UPDATE_USERINFOFROMDB
      };
};

export const updateAccessToken = (data: string) => {
  return {
    type: UPDATEACCESSTOKEN,
    data
  };
};

export const submitUserInfoToDb = (data?: UserInfoEditType) => {
  return data
    ? {
        type: SUBMITUSERINFOTODB,
        data
      }
    : {
        type: ERROR,
        data: SUBMITUSERINFOTODB
      };
};

export const asyncUpdateUserProfile = () => async dispatch => {
  try {
    const { authSetting } = await getSetting();
    dispatch(updateUserProfile(authSetting));
  } catch (e) {
    dispatch(updateUserProfile());
    throw e;
  }
};

export const asyncUpdateUserInfoFromDb = (
  access_token: string
) => async dispatch => {
  try {
    const { data } = await getUserInfo(access_token);
    dispatch(updateUserInfoFromDb(data));
  } catch (e) {
    dispatch(updateUserInfoFromDb());
    throw e;
  }
};

export const asyncSubmitUserInfoToDb = (
  access_token: string,
  info: UserInfoEditType
) => async dispatch => {
  try {
    await updateUser(access_token, info);
    dispatch(submitUserInfoToDb(info));
  } catch (e) {
    dispatch(submitUserInfoToDb());
    console.log(e);
    throw e;
  }
};
