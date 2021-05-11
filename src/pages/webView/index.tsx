import React, { useEffect, useState } from "react";
import { View, WebView as Web } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AtButton, AtMessage } from "taro-ui";
import { useSelector, useDispatch } from "react-redux";

import { StoreType, UserStateType, updateUserInfoEditTips } from "../../store";
import { tipsList } from "../../utils";

import "./index.scss";
import classNames from "classnames";

const WebView = () => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const {params} = Taro.Current.router;
    setUrl(params.url)
  });

  return <Web src={url}/>;
};

export default WebView;
