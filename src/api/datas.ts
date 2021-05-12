import Taro from "@tarojs/taro";

import { userUrl } from "./";

export const getSchoolList = async (name: string) =>
  await Taro.request({
    url: `${userUrl}/school?name=${name}`,
    method: "GET"
  });
