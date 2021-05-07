import {
  UPDATE_USERPROFILE,
  UPDATE_USERINFOFROMDB,
  UPDATEACCESSTOKEN
} from "../constants";
import { UserProfileType, UserInfoFromDbType } from "../reducers";
import { getSetting, getUserInfo } from "../../api";

const updateUserProfile = (data?: UserProfileType) => {
  return {
    type: UPDATE_USERPROFILE,
    data
  };
};

const updateUserInfoFromDb = (data?: UserInfoFromDbType) => {
  return {
    type: UPDATE_USERINFOFROMDB,
    data
  };
};

export const updateAccessToken = (data: string) => {
  return {
    type: UPDATEACCESSTOKEN,
    data
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
