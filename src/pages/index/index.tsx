import React, { useState, useEffect, useMemo } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AtButton, AtTabBar } from "taro-ui";
import { useSelector, useDispatch } from "react-redux";

import Search from "../../components/search";
import History from "../../components/history";
import User from "../../components/user";
import {
  StoreType,
  UserStateType,
  asyncUpdateUserInfoFromDb
} from "../../store";

import "./index.scss";

const ComponentMaps = {
  0: History,
  1: Search,
  2: User
};

const Index = () => {
  const [current, setCurrent] = useState(2);
  const userInfo = useSelector<StoreType, UserStateType>(state => state.user);
  const dispatch = useDispatch();

  const Component = useMemo(() => ComponentMaps[current], [current]);

  const getUserMessage = () => {
    try {
      if (!userInfo.accessToken) return;
      dispatch(asyncUpdateUserInfoFromDb(userInfo.accessToken));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUserMessage();
  }, []);

  return (
    <View className="index">
      <Component />
      <AtTabBar
        fixed
        tabList={[
          { title: "进度查询", iconType: "bullet-list", text: "new" },
          { title: "内推岗位", iconType: "search" },
          { title: "我的", iconType: "user", text: "100", max: 99 }
        ]}
        onClick={number => {
          setCurrent(number);
        }}
        current={current}
      />
    </View>
  );
};

export default Index;
