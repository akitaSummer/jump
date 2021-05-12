import React, { useEffect, useState } from "react";
import classnames from "classnames";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AtButton, AtMessage } from "taro-ui";
import { useSelector, useDispatch } from "react-redux";

import {
  StoreType,
  UserStateType,
  asyncUpdateUserFile,
  asyncDelUserFile
} from "../../store";
import { downloadResumes } from "../../api";

import "./index.scss";
import classNames from "classnames";
import user from "../../store/reducers/user";

const FileDetail = () => {
  const userInfo = useSelector<StoreType, UserStateType>(state => state.user);
  const dispatch = useDispatch();

  return (
    <View
      className={classNames("file-detail", {
        ios: Taro.getSystemInfoSync().system.includes("iOS")
      })}
    >
      <AtMessage />
      <View className={"tips-container"}>
        <Text className={"tips"}>点击文件名即可预览</Text>
      </View>
      {userInfo.userInfoFromDb.nickname &&
        userInfo.userFiles.map((item, i) => (
          <View className={classnames("info_item")} key={item.name + item.id}>
            <Text
              className={classnames("item_name")}
              onClick={async () => {
                try {
                  Taro.atMessage({
                    message: "简历下载中",
                    type: "warning"
                  });
                  // @ts-ignore
                  const { tempFilePath } = await downloadResumes(
                    userInfo.accessToken,
                    item.path,
                    item.name
                  );
                  Taro.atMessage({
                    message: "简历下载完成",
                    type: "success"
                  });
                  Taro.openDocument({
                    filePath: tempFilePath
                  });
                } catch (e) {
                  Taro.atMessage({
                    message: "预览简历失败",
                    type: "error"
                  });
                }
              }}
            >
              {item.name}
            </Text>
            <View
              className={classnames("at-icon", "at-icon-close", "delete")}
              onClick={() => {
                dispatch(asyncDelUserFile(userInfo.accessToken, item.id));
              }}
            />
          </View>
        ))}
      <View
        className={classNames("button-group", {
          ios: Taro.getSystemInfoSync().system.includes("iOS")
        })}
      >
        <AtButton
          type="primary"
          disabled={userInfo.userFiles.length >= 3}
          className={classNames("submit-button")}
          onClick={() => {
            Taro.atMessage({
              message: "简历上传中",
              type: "warning"
            });
            Taro.chooseMessageFile({
              count: 1,
              extension: ["pdf", "word"],
              type: "file",
              success: data => {
                const { tempFiles } = data;
                const { name, path } = tempFiles[0];
                dispatch(
                  asyncUpdateUserFile(
                    userInfo.accessToken,
                    name.replace(" ", "_"),
                    path
                  )
                );
              },
              fail: () => {
                Taro.atMessage({
                  message: "简历上传失败",
                  type: "error"
                });
              }
            });
          }}
        >
          {userInfo.userFiles.length >= 3 ? "简历最多只能上传3份" : "上传"}
        </AtButton>
      </View>
    </View>
  );
};

export default FileDetail;
