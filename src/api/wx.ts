import Taro from "@tarojs/taro";

export const getSetting = async () => await Taro.getSetting();

export const wxLogin = async () => await Taro.login();

export const wxGetUserInfo = async () =>
  await Taro.getUserProfile({
    desc: "初始化用户信息"
  });
