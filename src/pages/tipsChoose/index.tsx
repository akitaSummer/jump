import React, { useEffect, useState } from "react";
import { View, ScrollView, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AtButton, AtMessage } from "taro-ui";
import { useSelector, useDispatch } from "react-redux";

import { StoreType, UserStateType, updateUserInfoEditTips } from "../../store";
import { tipsList } from "../../utils";

import "./index.scss";
import classNames from "classnames";

const TipsChoose = () => {
  const userInfo = useSelector<StoreType, UserStateType>(state => state.user);
  const dispatch = useDispatch();
  const [saveClick, setSaveClick] = useState(false);
  const [activeTrade, setActiveTrade] = useState(tipsList[0].trade);
  const [tips, setTips] = useState([...userInfo.userInfoEdit.tips.split(",")]);

  const handleTradeChange = (item: string) => {
    setActiveTrade(item);
  };

  const handleTipsClick = (item: string) => {
    if (tips.includes(item)) {
      return setTips([
        ...tips.filter(tip => item !== tip).filter(item => item !== "")
      ]);
    }
    if (tips.length >= 3) {
      return Taro.atMessage({
        message: "意向不能超过3个",
        type: "error"
      });
    }
    setTips([...tips, item]);
  };

  const saveTips = () => {
    setSaveClick(true);
  };

  useEffect(() => {
    setSaveClick(false);
    return () => {
      if (!saveClick) {
        dispatch(updateUserInfoEditTips(userInfo.userInfoEdit.tips));
      }
    };
  }, []);

  useEffect(() => {
    if (saveClick) {
      Taro.navigateBack({
        complete: () => {
          dispatch(
            updateUserInfoEditTips(tips.filter(item => item !== "").join(","))
          );
        }
      });
    }
  }, [saveClick]);

  return (
    <View
      className={classNames("tips-choose-container", {
        ios: Taro.getSystemInfoSync().system.includes("iOS")
      })}
    >
      <AtMessage />
      <View className="tips-choose" catchMove={true}>
        <ScrollView scrollY className={classNames("trade")}>
          {tipsList.map((item, i) => (
            <View
              className={classNames("trade-item", {
                "trade-item-active": item.trade === activeTrade
              })}
              onClick={() => {
                handleTradeChange(item.trade);
              }}
            >
              <Text className="content">{item.trade}</Text>
            </View>
          ))}
        </ScrollView>
        <ScrollView scrollY className={classNames("tips")}>
          <View className={classNames("tips-container")}>
            <View className="title"> </View>
            <View className="labels">
              {tipsList
                .filter(item => item.trade === activeTrade)[0]
                .tips.map((item, i) => (
                  <View
                    key={item + i}
                    className={classNames("tips-item", {
                      "tips-item-active": tips.includes(item)
                    })}
                    onClick={() => {
                      handleTipsClick(item);
                    }}
                  >
                    {item}
                  </View>
                ))}
            </View>
          </View>
        </ScrollView>
      </View>
      <View className={classNames("save-button")}>
        <AtButton
          type="primary"
          className={classNames("submit-button")}
          onClick={() => {
            saveTips();
          }}
        >
          保存
        </AtButton>
      </View>
    </View>
  );
};

export default TipsChoose;
