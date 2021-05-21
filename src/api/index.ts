import Taro from "@tarojs/taro";

export * from "./user";
export * from "./wx";
export * from "./datas";
export * from "./search";
export * from "./resume";
export * from "./history";
export const userUrl =
  Taro.getEnv() === "WEB" ? "/bg" : "https://doudou0.online/bg";
export const baseUrl = Taro.getEnv() === "WEB" ? "/" : "https://doudou0.online";
export const recommendsUrl =
  Taro.getEnv() === "WEB" ? "/rec" : "https://doudou0.online/rec";
