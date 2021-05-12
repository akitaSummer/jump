import {
  UPDATER_ECOMMENDS_LIST,
  RECOMMENDS_ERROR,
  RECOMMENDS_CLEARTYPE
} from "../constants";

import { RecommendType } from "../reducers";

export const updateRecommendsList = (data?: RecommendType[]) => {
  return data
    ? {
        type: UPDATER_ECOMMENDS_LIST,
        data
      }
    : {
        type: RECOMMENDS_ERROR,
        data: UPDATER_ECOMMENDS_LIST
      };
};

export const recommendsClearType = () => {
  return {
    type: RECOMMENDS_CLEARTYPE
  };
};
