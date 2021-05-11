import Taro from "@tarojs/taro";
import {
  UPDATE_USERPROFILE,
  UPDATE_USERINFOFROMDB,
  UPDATEACCESSTOKEN,
  SUBMITUSERINFOTODB,
  USER_CLEARTYPE,
  UPDATE_USERINFOEDIT,
  RESET_USERINFOEDIT,
  UPDATE_USERINFOEDITTIPS,
  USER_ERROR,
  UPDATE_USERFILE,
  GET_USERFILES,
  DELETE_USERFILE
} from "../constants";
import {
  UserProfileType,
  UserInfoFromDbType,
  UserInfoEditType,
  UserFileType
} from "../reducers";
import {
  getSetting,
  getUserInfo,
  updateUser,
  uploadFile,
  getResumesList,
  delResumes
} from "../../api";

export const updateUserFile = (type: string, data?: UserFileType[]) => {
  return data
    ? {
        type,
        data
      }
    : {
        type: USER_ERROR,
        data: type
      };
};

export const updateUserInfoEditTips = (value: string) => {
  return {
    type: UPDATE_USERINFOEDITTIPS,
    data: value
  };
};

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

export const userClearType = () => {
  return {
    type: USER_CLEARTYPE
  };
};

const updateUserProfile = (data?: UserProfileType) => {
  return data
    ? {
        type: UPDATE_USERPROFILE,
        data
      }
    : {
        type: USER_ERROR,
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
        type: USER_ERROR,
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
        type: USER_ERROR,
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

export const asyncGetUserFiles = (access_token: string) => async dispatch => {
  try {
    const { data } = await getResumesList(access_token);
    dispatch(
      updateUserFile(
        GET_USERFILES,
        data.map(item => {
          return {
            id: item.id,
            path: item.path,
            name: item.file_name
          };
        })
      )
    );
  } catch (e) {
    dispatch(updateUserFile(GET_USERFILES));
    console.log(e);
    throw e;
  }
};

export const asyncUpdateUserFile = (
  access_token: string,
  name: string,
  path: string
) => async dispatch => {
  try {
    await uploadFile(access_token, name, path);
    const { data } = await getResumesList(access_token);
    dispatch(
      updateUserFile(
        UPDATE_USERFILE,
        data.map(item => {
          return {
            id: item.id,
            path: item.path,
            name: item.file_name
          };
        })
      )
    );
    Taro.atMessage({
      message: "上传简历成功",
      type: "success"
    });
  } catch (e) {
    dispatch(updateUserFile(UPDATE_USERFILE));
    Taro.atMessage({
      message: "上传简历失败",
      type: "error"
    });
    console.log(e);
    throw e;
  }
};

export const asyncDelUserFile = (
  access_token: string,
  id: number
) => async dispatch => {
  try {
    await delResumes(access_token, id);
    const { data } = await getResumesList(access_token);
    Taro.atMessage({
      message: "删除简历成功",
      type: "success"
    });
    dispatch(
      updateUserFile(
        DELETE_USERFILE,
        data.map(item => {
          return {
            id: item.id,
            path: item.path,
            name: item.file_name
          };
        })
      )
    );
  } catch (e) {
    dispatch(updateUserFile(DELETE_USERFILE));
    Taro.atMessage({
      message: "删除简历失败",
      type: "error"
    });
    console.log(e);
    throw e;
  }
};
