import React, { useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./index.scss";

const History: React.FC = props => {
  
  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: "进度查询"
    });
  });

  return (
    <View className="index">
      <Text>进度查询</Text>
    </View>
  );
};

export default History;
