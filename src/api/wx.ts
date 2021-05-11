import Taro from "@tarojs/taro";

export const getSetting = async () => await Taro.getSetting();

export const wxLogin = async () => await Taro.login();

export const wxGetUserInfo = async () => await Taro.getUserInfo();
