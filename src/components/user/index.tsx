import React, { useState, useEffect } from "react";
import classnames from "classnames";
import { View, Text } from "@tarojs/components";
import { AtAvatar, AtToast, AtButton, AtInput } from "taro-ui";
import Taro from "@tarojs/taro";
import { useSelector, useDispatch } from "react-redux";

import {
  StoreType,
  UserStateType,
  updateAccessToken,
  asyncUpdateUserInfoFromDb,
  UPDATE_USERINFOFROMDB
} from "../../store";
import { wxLogin, login as dbLogin } from "../../api";

import "./index.scss";

const showInfo = ["name", "sex", "email", "degree", "school", "tips"];

const showInfoMap = {
  name: {
    name: "姓名",
    icon: "icon-name"
  },
  sex: {
    name: "性别",
    icon: "icon-sex"
  },
  email: {
    name: "email",
    icon: "icon-email"
  },
  // city: {
  //   name: "城市",
  //   icon: "icon-shangquan"
  // },
  degree: {
    name: "学历",
    icon: "icon-academicdegree"
  },
  school: {
    name: "学校",
    icon: "icon-school"
  },
  tips: {
    name: "意向",
    icon: "icon-line-codesslashdaimasxiegang"
  }
};

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

const User: React.FC<{}> = () => {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMask, setToastMask] = useState(false);
  const [toastStatus, setToastStatus] = useState<ToastStatus>(
    ToastStatus.Loading
  );
  const userInfo = useSelector<StoreType, UserStateType>(state => state.user);
  const dispatch = useDispatch();

  const login = async () => {
    setToastOpen(true);
    setToastMask(true);
    setToastStatus(ToastStatus.Loading);
    try {
      const wxRes = await wxLogin();
      const {
        data: { access_token }
      } = await dbLogin(wxRes.code);
      console.log(access_token);
      Taro.setStorageSync("loginSessionKey", access_token);
      dispatch(updateAccessToken(access_token));
      dispatch(asyncUpdateUserInfoFromDb(access_token));
    } catch (e) {
      console.log(e);
      setToastStatus(ToastStatus.Error);
      setToastMask(false);
    }
  };

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: "我的"
    });
  }, []);

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
      userInfo.actionType === UPDATE_USERINFOFROMDB
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
    <View className="index">
      <View className={classnames("at-row", "user-avatar")}>
        <View className={classnames("at-col", "avatar")}>
          <AtAvatar size={"large"} image={userInfo.userInfoFromDb.headimgurl} />
        </View>
        <View className={classnames("at-col", "detail")}>
          <Text className={classnames("nickname")}>
            {userInfo.userInfoFromDb.nickname && userInfo.accessToken
              ? userInfo.userInfoFromDb.nickname
              : "请先登录"}
          </Text>
          {userInfo.userInfoFromDb.nickname && userInfo.accessToken ? (
            <Text className={classnames("tel")}>
              tel: {userInfo.userInfoFromDb.phone}
            </Text>
          ) : (
            <View style={{ width: 48 }}>
              <AtButton
                onClick={() => login()}
                type="secondary"
                size="small"
                circle
              >
                登录
              </AtButton>
            </View>
          )}
        </View>
        {userInfo.userInfoFromDb.nickname && userInfo.accessToken && (
          <View className={classnames("at-icon", "at-icon-chevron-right")} />
        )}
      </View>
      {userInfo.userInfoFromDb.nickname &&
        showInfo.map(item => {
          return (
            <View className={classnames("info_item")}>
              <View
                className={classnames("iconfont", showInfoMap[item].icon)}
              ></View>
              <Text className={classnames("item_name")}>
                {showInfoMap[item].name}
              </Text>
              <Text>{userInfo.userInfoFromDb[item]}</Text>
            </View>
          );
        })}
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

export default User;
