import React, { useState, useEffect, useMemo } from "react";
import { View, Text, Picker, ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import {
  AtForm,
  AtButton,
  AtInput,
  AtList,
  AtListItem,
  AtMessage,
  AtToast
} from "taro-ui";
import { useSelector, useDispatch } from "react-redux";

import {
  StoreType,
  UserStateType,
  asyncSubmitUserInfoToDb,
  clearType,
  SUBMITUSERINFOTODB,
  ERROR
} from "../../store";
import { schoolList, degreeList } from "../../utils";

import "./index.scss";
import classNames from "classnames";

export type UserInfoType = {
  name: string;
  phone: string;
  email: string;
  school: string;
  degree: string;
  exp: number;
  tips: string;
};

const InfoEdit = () => {
  const [info, setInfo] = useState<UserInfoType>({
    name: "",
    phone: "",
    email: "",
    school: "",
    degree: "",
    exp: 0,
    tips: ""
  });
  const [toastOpen, setToastOpen] = useState(false);
  const [school, setSchool] = useState([...schoolList]);
  const [schoolListShow, setSchoolListShow] = useState(false);
  const userInfo = useSelector<StoreType, UserStateType>(state => state.user);
  const dispatch = useDispatch();

  const reset = () => {
    const {
      userInfoFromDb: { name, phone, email, school, exp, tips, degree }
    } = userInfo;
    setInfo({
      name,
      phone,
      email,
      school,
      degree,
      exp,
      tips
    });
  };

  const submit = () => {
    if (
      !Object.keys(info).every(item => {
        if (item === "exp") {
          return true;
        } else {
          return !!info[item];
        }
      })
    ) {
      Taro.atMessage({
        message: "个人信息必须填写完整",
        type: "error"
      });
    }
    dispatch(asyncSubmitUserInfoToDb(userInfo.accessToken, info));
  };

  const handleChange = (value, target) => {
    console.log(value);
    setInfo({
      ...info,
      [target]: value
    });
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return value;
  };

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    setSchool([
      ...schoolList.filter(item => {
        return item.includes(info.school);
      })
    ]);
  }, [info.school]);

  useEffect(() => {
    if (userInfo.actionType === SUBMITUSERINFOTODB) {
      console.log(userInfo.actionType);
      setToastOpen(true);
      setTimeout(() => {
        Taro.navigateBack();
        setToastOpen(false);
        dispatch(clearType());
      }, 500);
    } else if (userInfo.actionType === ERROR) {
      Taro.atMessage({
        message: "更新失败",
        type: "error"
      });
    }
  }, [userInfo]);

  return (
    <View className="info-edit" catchMove={true}>
      <AtMessage />
      <AtForm
      // onSubmit={() => {
      //   submit();
      // }}
      // onReset={() => {
      //   reset();
      // }}
      >
        <AtInput
          name="name"
          title="姓名"
          type="text"
          placeholder="请输入您的真实姓名"
          value={info.name}
          onChange={v => handleChange(v, "name")}
          onFocus={() => {
            setSchoolListShow(false);
          }}
        />
        <AtInput
          name="phone"
          title="手机号"
          type="phone"
          placeholder="请输入您的手机号"
          value={info.phone}
          onChange={v => handleChange(v, "phone")}
          onFocus={() => {
            setSchoolListShow(false);
          }}
        />
        <AtInput
          name="email"
          title="email"
          type="text"
          placeholder="请输入您的email"
          value={info.email}
          onChange={v => handleChange(v, "email")}
          onFocus={() => {
            setSchoolListShow(false);
          }}
        />
        <AtInput
          name="school"
          title="school"
          type="text"
          placeholder="请输入您的毕业院校"
          value={info.school}
          onChange={v => {
            schoolListShow && handleChange(v, "school");
          }}
          onFocus={() => {
            setSchoolListShow(true);
          }}
          // onBlur={v => {
          //   console.log(v);
          //   handleChange(info.school, "school");
          // }}
        />
        <ScrollView
          className={classNames("scrollview", "school-scroll-view", {
            "list-show": schoolListShow
          })}
          scrollY
          scrollWithAnimation
          scrollTop={0}
          lowerThreshold={0}
          upperThreshold={0}
          onScrollToUpper={() => {}} // 使用箭头函数的时候 可以这样写 `onScrollToUpper={this.onScrollToUpper}`
        >
          <AtList className={classNames("school-list")}>
            {school.map((item, i) => {
              return (
                <AtListItem
                  className={classNames("school-list-item")}
                  title={item}
                  key={item + i}
                  onClick={() => {
                    setSchoolListShow(false);
                    handleChange(item, "school");
                  }}
                />
              );
            })}
          </AtList>
        </ScrollView>
        <View className={classNames("degree-list")}>
          <Picker
            mode="selector"
            range={degreeList}
            onChange={v => {
              handleChange(degreeList[v.detail.value], "degree");
            }}
          >
            <AtList>
              <AtListItem title="学历" extraText={info.degree} />
            </AtList>
          </Picker>
        </View>
        <AtInput
          name="exp"
          title="工作年限"
          type="number"
          placeholder="请输入您的工作年限"
          value={`${info.exp}`}
          onChange={v => handleChange(v, "exp")}
          onFocus={() => {
            setSchoolListShow(false);
          }}
        />
        <AtInput
          name="tips"
          title="意向岗位"
          type="text"
          placeholder="请输入您的意向岗位，如有多项请用“,”分隔"
          value={info.tips}
          onChange={v => handleChange(v, "tips")}
          onFocus={() => {
            setSchoolListShow(false);
          }}
        />
        <View
          className={classNames("button-group", {
            ios: Taro.getSystemInfoSync().system.includes("iOS")
          })}
        >
          <AtButton
            type="primary"
            formType="submit"
            className={classNames("submit-button")}
            onClick={() => {
              submit();
            }}
          >
            提交
          </AtButton>
          <AtButton formType="reset" onClick={() => reset()}>
            重置
          </AtButton>
        </View>
      </AtForm>
      <AtToast
        duration={0}
        isOpened={toastOpen}
        status={"success"}
        text={"更新成功"}
        hasMask
      />
    </View>
  );
};

export default InfoEdit;
