import React, { useEffect } from "react";
import classnames from "classnames";
import { View, Text } from "@tarojs/components";
import { AtAvatar, AtIcon } from "taro-ui";
import Taro from "@tarojs/taro";
import "taro-ui/dist/style/components/flex.scss";
import "taro-ui/dist/style/components/avatar.scss";
import "taro-ui/dist/style/components/icon.scss";
import "./index.scss";

const User: React.FC<{}> = () => {
  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: "我的"
    });
  });

  return (
    <View className="index">
      <View className={classnames("at-row", "user-avatar")}>
        <View className={classnames("at-col", "avatar")}>
          <AtAvatar
            size={"large"}
            image="https://thirdwx.qlogo.cn/mmopen/vi_32/qKhKjlGb3QtbiaxZbpIRRTOiaeSuwb5dn8A2hLIUfm6GeKfgJJVvBOiagadwwDn8uOvpd09tQJh4RcVaCXDq5PLKg/132"
          />
        </View>
        <View className={classnames("at-col", "detail")}>
          <Text className={classnames("nickname")}>AkitaSummer</Text>
          <Text className={classnames("tel")}>tel: 1234567890</Text>
        </View>
        <View className={classnames("at-icon", "at-icon-chevron-right")} />
      </View>
    </View>
  );
};

export default User;
