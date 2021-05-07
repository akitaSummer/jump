import Taro from "@tarojs/taro";
import {
  UPDATE_USERPROFILE,
  UPDATE_USERINFOFROMDB,
  UPDATEACCESSTOKEN
} from "../constants";

export type UserProfileType = {
  /** 是否授权通讯地址，对应接口 [wx.chooseAddress](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/address/wx.chooseAddress.html) */
  "scope.address"?: boolean;
  /** 是否授权摄像头，对应[[camera](https://developers.weixin.qq.com/miniprogram/dev/component/camera.html)](https://developers.weixin.qq.com/miniprogram/dev/component/camera.html) 组件 */
  "scope.camera"?: boolean;
  /** 是否授权获取发票，对应接口 [wx.chooseInvoice](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/invoice/wx.chooseInvoice.html) */
  "scope.invoice"?: boolean;
  /** 是否授权发票抬头，对应接口 [wx.chooseInvoiceTitle](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/invoice/wx.chooseInvoiceTitle.html) */
  "scope.invoiceTitle"?: boolean;
  /** 是否授权录音功能，对应接口 [wx.startRecord](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/wx.startRecord.html) */
  "scope.record"?: boolean;
  /** 是否授权用户信息，对应接口 [wx.getUserInfo](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html) */
  "scope.userInfo"?: boolean;
  /** 是否授权地理位置，对应接口 [wx.getLocation](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html), [wx.chooseLocation](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.chooseLocation.html) */
  "scope.userLocation"?: boolean;
  /** 是否授权微信运动步数，对应接口 [wx.getWeRunData](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/werun/wx.getWeRunData.html) */
  "scope.werun"?: boolean;
  /** 是否授权保存到相册 [wx.saveImageToPhotosAlbum](https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.saveImageToPhotosAlbum.html), [wx.saveVideoToPhotosAlbum](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.saveVideoToPhotosAlbum.html) */
  "scope.writePhotosAlbum"?: boolean;
};

export type UserInfoFromDbType = {
  city: string;
  content: string;
  create_time: string;
  email: string;
  from_id: string;
  headimgurl: null | string;
  id: number;
  name: string;
  nickname: string;
  openid: string;
  phone: string;
  school: string;
  sex: "1" | "0";
  status: string;
  tips: string;
};

export type UserStateType = {
  // 用户授权登录
  userProfile: UserProfileType;
  hasUserInfo: boolean;
  // 后台获取用户信息
  userInfoFromDb: UserInfoFromDbType;
  hasUserInfoFromDb: Boolean;
  // 登录token
  accessToken: null | string;
  // 广告
  showAdvertise: boolean;
  actionType: string
};

export const INITIAL_STATE: UserStateType = {
  // 用户授权登录
  userProfile: {},
  hasUserInfo: false,
  // 后台获取用户信息
  userInfoFromDb: {
    city: "",
    content: "",
    create_time: "",
    email: "",
    from_id: "",
    headimgurl: null,
    id: -996,
    name: "",
    nickname: "",
    openid: "",
    phone: "",
    school: "",
    sex: "1",
    status: "",
    tips: ""
  },
  hasUserInfoFromDb: false,
  // 登录token
  accessToken: Taro.getStorageSync("loginSessionKey"),
  // 广告
  showAdvertise: false,
  actionType: 'DEFAULT'
};

export default (state = INITIAL_STATE, actions) => {
  switch (actions.type) {
    case UPDATE_USERPROFILE:
      return {
        ...state,
        actionType: actions.type,
        userProfile: actions.data
          ? {
              ...actions.data
            }
          : {
              ...state.userProfile
            }
      };
    case UPDATE_USERINFOFROMDB:
      return {
        ...state,
        actionType: actions.type,
        userInfoFromDb: actions.data
          ? {
              ...actions.data
            }
          : {
              ...state.userInfoFromDb
            }
      };
    case UPDATEACCESSTOKEN:
      return {
        ...state,
        actionType: actions.type,
        accessToken: actions.data
      };
    default:
      return {
          ...state,
          actionType: actions.type,
      };
  }
};
