import Taro from "@tarojs/taro";

const userUrl = "https://doudou0.online/bg";

export const getSchoolList = async (name: string) =>
  await Taro.request({
    url: `${userUrl}/school?name=${name}`,
    method: "GET"
  });
