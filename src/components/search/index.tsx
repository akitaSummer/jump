import React, { useEffect } from "react";
import { View, Text } from "@tarojs/components";
import { AtButton } from "taro-ui";
import Taro from "@tarojs/taro";

import "taro-ui/dist/style/components/button.scss"; // 按需引入
import "taro-ui/dist/style/components/icon.scss"; // 按需引入
import "./index.scss";

const Search = () => {
  const getUserProfile = async () => {
    const res = await Taro.getUserProfile({
      desc: "用于完善会员资料"
    });
    console.log(res);
  };

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: "跳一下"
    });
  });

  return (
    <View className="index">
      <Text>Hello world!</Text>
      <AtButton type="primary">Hello world!</AtButton>
      <Text>button</Text>
      <AtButton type="primary" circle={true}>
        button
      </AtButton>
      <Text>登录</Text>
      <AtButton
        type="secondary"
        circle={true}
        onClick={() => {
          getUserProfile();
        }}
      >
        权限申请
      </AtButton>
    </View>
  );
};

export default Search;
