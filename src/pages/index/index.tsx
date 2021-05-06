import React, { useState, useEffect, useMemo } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AtButton, AtTabBar } from "taro-ui";

import Search from "../../components/search";
import History from "../../components/history";
import User from "../../components/user";

import "taro-ui/dist/style/components/button.scss"; // 按需引入
import "taro-ui/dist/style/components/tab-bar.scss"; // 按需引入
import "taro-ui/dist/style/components/badge.scss"; // 按需引入
import "taro-ui/dist/style/components/icon.scss"; // 按需引入
import "./index.scss";

const ComponentMaps = {
  0: History,
  1: Search,
  2: User
};

const Index = () => {
  const [current, setCurrent] = useState(1);

  const Component = useMemo(() => ComponentMaps[current], [current]);

  const login = async () => {
    const wxRes = await Taro.login();
    const res = await Taro.request({
      url: "https://doudou0.online/bg/login",
      data: {
        code: wxRes.code
      },
      method: "POST"
    });
    console.log(res);
  };

  useEffect(() => {
    login();
    Taro.getSetting({
      success(res) {
        console.log(res);
        const { authSetting } = res;
        if (!authSetting["scope.userInfo"]) {
          Taro.login({
            success(res) {
              console.log(res);
            }
          });
        }
      }
    });
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
