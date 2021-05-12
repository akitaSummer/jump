import Taro from "@tarojs/taro";
import { recommendsUrl } from "./";

export const getRecommends = async (
  pageNum: number,
  pageSize: number,
  searchVal: string,
  tags?: string
) =>
  await Taro.request({
    url: `${recommendsUrl}/recommends`,
    data: {
      pageNum,
      pageSize,
      searchVal,
      ...(tags
        ? {
            tags
          }
        : {})
    },
    method: "POST"
  });
