import React, { useEffect, useState, useMemo } from "react";
import classnames from "classnames";
import { View, Text, ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AtButton, AtToast } from "taro-ui";
import { useSelector, useDispatch } from "react-redux";

import {
  StoreType,
  RecommendsStateType,
  UserStateType,
  updateCurrentRecommend,
  updateAccessToken,
  asyncUpdateUserInfoFromDb,
  asyncGetFiles,
  UPDATE_USERINFOFROMDB,
  USER_ERROR
} from "../../store";
import { wxLogin, login as dbLogin } from "../../api";

import classNames from "classnames";

enum ToastStatus {
  Error = "error",
  Loading = "loading",
  Success = "success"
}

const LoaingStatus = {
  [ToastStatus.Error]: "登录失败",
  [ToastStatus.Loading]: "登录中",
  [ToastStatus.Success]: "登录成功"
};

const RecommendDetail = () => {
  const recommends = useSelector<StoreType, RecommendsStateType>(
    state => state.recommends
  );
  const userInfo = useSelector<StoreType, UserStateType>(state => state.user);
  const dispatch = useDispatch();
  const recommendInfo = useMemo(() => recommends.currentRecommend, [
    recommends
  ]);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMask, setToastMask] = useState(false);
  const [toastStatus, setToastStatus] = useState<ToastStatus>(
    ToastStatus.Loading
  );

  useEffect(() => {
    return () => {
      dispatch(updateCurrentRecommend());
    };
  }, []);

  const login = async () => {
    setToastOpen(true);
    setToastMask(true);
    setToastStatus(ToastStatus.Loading);
    try {
      const wxRes = await wxLogin();
      const {
        data: { access_token }
      } = await dbLogin(wxRes.code);
      Taro.setStorageSync("loginSessionKey", access_token);
      dispatch(updateAccessToken(access_token));
      dispatch(asyncUpdateUserInfoFromDb(access_token));
      dispatch(asyncGetFiles(access_token));
    } catch (e) {
      console.log(e);
      setToastStatus(ToastStatus.Error);
      setToastMask(false);
    }
  };

  useEffect(() => {
    if (
      toastOpen &&
      userInfo.userInfoFromDb.nickname &&
      userInfo.actionType === UPDATE_USERINFOFROMDB
    ) {
      setToastStatus(ToastStatus.Success);
    }
    if (
      toastOpen &&
      !userInfo.userInfoFromDb.nickname &&
      userInfo.actionType === USER_ERROR
    ) {
      setToastStatus(ToastStatus.Error);
    }
  }, [userInfo]);

  useEffect(() => {
    if (toastStatus !== ToastStatus.Loading) {
      setToastMask(false);
      setTimeout(() => {
        setToastOpen(false);
      }, 500);
    }
  }, [toastStatus]);

  return (
    <View
      className={classNames("recommend-detail", {
        ios: Taro.getSystemInfoSync().system.includes("iOS")
      })}
    >
      <ScrollView className={"recommend-info"} scrollY>
        {recommendInfo ? (
          <View className={classNames("at-article", "info-container")}>
            <View className={classNames("at-article__h1", "info-h1")}>
              {recommendInfo.name}
            </View>
            <View className={classNames("at-article__info", "info-info")}>
              {recommendInfo.origin}&nbsp;&nbsp;|&nbsp;&nbsp;
              {recommendInfo.workPlace}
              &nbsp;&nbsp;|&nbsp;&nbsp;{recommendInfo.reqWorkYearsName}
              &nbsp;&nbsp;|&nbsp;&nbsp;
              {recommendInfo.reqEducationName}
            </View>
            <View className={classNames("at-article__content", "info_content")}>
              <View
                className={classNames("at-article__section", "info_section")}
              >
                <View className={classNames("at-article__h2", "info-h2")}>
                  职位部门
                </View>
                <View
                  className={classNames("at-article__h2", "info-p-container")}
                >
                  <Text className={classNames("at-article__p", "info-p")}>
                    {recommendInfo.depFullName}
                  </Text>
                </View>

                <View className={classNames("at-article__h2", "info-h2")}>
                  职位描述
                </View>
                <View
                  className={classNames("at-article__h2", "info-p-container")}
                >
                  <Text className={classNames("at-article__p", "info-p")}>
                    {recommendInfo.description.replace("岗位描述: \n\n", "")}
                  </Text>
                </View>

                <View className={classNames("at-article__h2", "info-h2")}>
                  岗位要求
                </View>
                <View
                  className={classNames("at-article__h2", "info-p-container")}
                >
                  <Text className={classNames("at-article__p", "info-p")}>
                    {recommendInfo.requirement.replace("岗位要求：\n\n", "")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View className={classNames("at-article", "info-container")}>
            <View
              className={classNames("at-article__h1", "info-h1", "skeletonBg")}
            ></View>
            <View className={classNames("at-article__info", "info-info")}>
              <View className={classNames("skeletonBg")} />
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <View className={classNames("skeletonBg")} />
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <View className={classNames("skeletonBg")} />
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <View className={classNames("skeletonBg")} />
            </View>
            <View className={classNames("at-article__content", "info_content")}>
              <View
                className={classNames("at-article__section", "info_section")}
              >
                <View className={classNames("at-article__h2", "info-h2")}>
                  职位部门
                </View>
                <View
                  className={classNames("at-article__h2", "info-p-container")}
                >
                  <View
                    className={classNames(
                      "at-article__p",
                      "info-p",
                      "skeletonBg"
                    )}
                  />
                </View>

                <View className={classNames("at-article__h2", "info-h2")}>
                  职位描述
                </View>
                <View
                  className={classNames("at-article__h2", "info-p-container")}
                >
                  <View
                    className={classNames(
                      "at-article__p",
                      "info-p",
                      "skeletonBg"
                    )}
                  />
                  <View
                    className={classNames(
                      "at-article__p",
                      "info-p",
                      "skeletonBg"
                    )}
                  />
                  <View
                    className={classNames(
                      "at-article__p",
                      "info-p",
                      "skeletonBg"
                    )}
                  />
                  <View
                    className={classNames(
                      "at-article__p",
                      "info-p",
                      "skeletonBg"
                    )}
                  />
                </View>

                <View className={classNames("at-article__h2", "info-h2")}>
                  岗位要求
                </View>
                <View
                  className={classNames("at-article__h2", "info-p-container")}
                >
                  <View
                    className={classNames(
                      "at-article__p",
                      "info-p",
                      "skeletonBg"
                    )}
                  />
                  <View
                    className={classNames(
                      "at-article__p",
                      "info-p",
                      "skeletonBg"
                    )}
                  />
                  <View
                    className={classNames(
                      "at-article__p",
                      "info-p",
                      "skeletonBg"
                    )}
                  />
                  <View
                    className={classNames(
                      "at-article__p",
                      "info-p",
                      "skeletonBg"
                    )}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      <View className={classNames("button-group")}>
        <AtButton
          type="primary"
          disabled={false}
          className={classNames("submit-button", {
            ios: Taro.getSystemInfoSync().system.includes("iOS")
          })}
          onClick={() => {
            userInfo.userInfoFromDb.nickname
              ? Taro.navigateTo({
                  url: "/pages/selectFile/index"
                })
              : login();
          }}
        >
          {userInfo.userInfoFromDb.nickname ? "投个简历" : "请先登录"}
        </AtButton>
      </View>
      <AtToast
        duration={0}
        isOpened={toastOpen}
        status={toastStatus}
        text={LoaingStatus[toastStatus]}
        hasMask
      />
    </View>
  );
};

export default RecommendDetail;
