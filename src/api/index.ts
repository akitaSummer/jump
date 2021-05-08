import Taro from "@tarojs/taro";

import { UserInfoType } from "../pages/infoEdit";

const userUrl = "https://doudou0.online/bg";

export const getSetting = async () => await Taro.getSetting();

export const wxLogin = async () => await Taro.login();

export const wxGetUserInfo = async () => await Taro.getUserInfo();

export const login = async (code: string) =>
  await Taro.request({
    url: `${userUrl}/login`,
    data: {
      code
    },
    method: "POST"
  });

export const getUserInfo = async (access_token: string) =>
  await Taro.request({
    url: `${userUrl}/users?access_token=${access_token}`,
    method: "GET"
  });

export const updateUser = async (access_token: string, data: UserInfoType) =>
  await Taro.request({
    header: {
      AccessToken: access_token
    },
    url: `${userUrl}/users`,
    data: {
      ...data
    },
    method: "PUT"
  });
