import Taro from "@tarojs/taro";

const userUrl = "https://doudou0.online/bg";

export const getSetting = async () => await Taro.getSetting();

export const wxLogin = async () => await Taro.login();

export const wxGetUserInfo = async () => await Taro.getUserInfo()

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
