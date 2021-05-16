import React, { useState, useEffect, useRef, useMemo } from "react";
import Taro, { useTabItemTap } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import ListView, { LazyBlock, Skeleton } from "taro-listview";
import { AtCard, AtSteps, AtSearchBar, AtButton, AtToast } from "taro-ui";
import classNames from "classnames";
import { useSelector, useDispatch } from "react-redux";

import {
  StoreType,
  UserStateType,
  SchedulesType,
  HistoryStateType,
  updateAccessToken,
  asyncUpdateUserInfoFromDb,
  asyncGetFiles,
  updateHistoryList,
  updateCurrentHistory,
  UPDATE_USERINFOFROMDB,
  USER_ERROR
} from "../../store";
import { getHistoryList, wxLogin, login as dbLogin } from "../../api";
import FilterDropdown from "../filterDropdown";
import "./index.scss";

enum ToastStatus {
  Error = "error",
  Loading = "loading",
  Success = "success"
}

const LoaingStatus = {
  [ToastStatus.Error]: "登录失败",
  [ToastStatus.Loading]: "登录中",
  [ToastStatus.Success]: "登录成功"
};

enum ScheduleStatus {
  NOT_APPLY = "not_apply",
  POSTED = "posted",
  WAIT_CHECK = "wait_check",
  CHECKING = "checking",
  WRITTEN_EXAM = "written_exam",
  TESTING = "testing",
  OFFERED = "offered",
  HIRED = "hired",
  HR_FAILED = "hr_fail",
  CHECK_FAILED = "check_failed",
  TEST_FAILED = "test_failed",
  WAIT_OFFER = "wait_offer",
  OFFER_FAILED = "offer_failed",
  OFFER_SUCCESS = "offer_success",
  IN_OTHER_PROGRESS = "in_other"
}

const StepOnePadding = [
  ScheduleStatus.NOT_APPLY,
  ScheduleStatus.POSTED,
  ScheduleStatus.WAIT_CHECK
];

const StepOneFailed = [
  ScheduleStatus.HR_FAILED,
  ScheduleStatus.IN_OTHER_PROGRESS
];

const StepOneSuccess = [
  ScheduleStatus.WRITTEN_EXAM,
  ScheduleStatus.TESTING,
  ScheduleStatus.OFFERED,
  ScheduleStatus.HIRED,
  ScheduleStatus.TEST_FAILED,
  ScheduleStatus.WAIT_OFFER,
  ScheduleStatus.OFFER_FAILED,
  ScheduleStatus.OFFER_SUCCESS,
  ScheduleStatus.CHECKING,
  ScheduleStatus.CHECK_FAILED
];

const StepTwoPadding = [
  ScheduleStatus.WRITTEN_EXAM,
  ScheduleStatus.TESTING,
  ScheduleStatus.CHECKING
];

const StepTwoFailed = [ScheduleStatus.TEST_FAILED, ScheduleStatus.CHECK_FAILED];

const StepTwoSuccess = [
  ScheduleStatus.OFFERED,
  ScheduleStatus.HIRED,
  ScheduleStatus.WAIT_OFFER,
  ScheduleStatus.OFFER_FAILED,
  ScheduleStatus.OFFER_SUCCESS
];

const StepThreePadding = [
  ScheduleStatus.WAIT_OFFER,
  ScheduleStatus.OFFERED,
  ScheduleStatus.OFFER_SUCCESS
];

const StepThreeFailed = [ScheduleStatus.OFFER_FAILED];

const StepThreeSuccess = [ScheduleStatus.HIRED];

const disableStatus = [
  ScheduleStatus.HR_FAILED,
  ScheduleStatus.CHECK_FAILED,
  ScheduleStatus.TEST_FAILED,
  ScheduleStatus.WAIT_OFFER,
  ScheduleStatus.OFFER_FAILED,
  ScheduleStatus.OFFER_SUCCESS,
  ScheduleStatus.IN_OTHER_PROGRESS
];

const ScheduleStatusMap = {
  [ScheduleStatus.NOT_APPLY]: "未投递",
  [ScheduleStatus.POSTED]: "投递成功",
  [ScheduleStatus.WAIT_CHECK]: "等待筛选",
  [ScheduleStatus.CHECKING]: "筛选通过，评估中",
  [ScheduleStatus.WRITTEN_EXAM]: "笔试中",
  [ScheduleStatus.TESTING]: "面试中",
  [ScheduleStatus.OFFERED]: "已发offer",
  [ScheduleStatus.HIRED]: "已入职",
  [ScheduleStatus.HR_FAILED]: "筛选未通过",
  [ScheduleStatus.CHECK_FAILED]: "评估不通过",
  [ScheduleStatus.TEST_FAILED]: "面试不通过",
  [ScheduleStatus.WAIT_OFFER]: "offer沟通中",
  [ScheduleStatus.OFFER_FAILED]: "拒绝offer",
  [ScheduleStatus.OFFER_SUCCESS]: "接受offer",
  [ScheduleStatus.IN_OTHER_PROGRESS]: "在别的流程中，或已接受offer"
};

type StepType = {
  title: string;
  desc?: string;
  status?: "success" | "error";
};

const getStepsList = (type: ScheduleStatus) => {
  let result: {
    items: StepType[];
    current: number;
  };
  if (StepOnePadding.includes(type)) {
    result = {
      items: [
        {
          title: "筛选中",
          desc: ScheduleStatusMap[type]
        },
        {
          title: "未面试"
        },
        {
          title: "暂未获得offer"
        }
      ],
      current: 0
    };
  } else if (StepOneFailed.includes(type)) {
    result = {
      items: [
        {
          title: "筛选未通过",
          desc: ScheduleStatusMap[type],
          status: "error"
        },
        {
          title: "未面试"
        },
        {
          title: "未获得offer"
        }
      ],
      current: 0
    };
  } else if (StepTwoPadding.includes(type)) {
    result = {
      items: [
        {
          title: "筛选通过",
          status: "success"
        },
        {
          title: "面试中",
          desc: ScheduleStatusMap[type]
        },
        {
          title: "暂未获得offer"
        }
      ],
      current: 1
    };
  } else if (StepTwoFailed.includes(type)) {
    result = {
      items: [
        {
          title: "筛选通过",
          status: "success"
        },
        {
          title: "面试未通过",
          desc: ScheduleStatusMap[type],
          status: "error"
        },
        {
          title: "未获得offer"
        }
      ],
      current: 1
    };
  } else if (StepThreePadding.includes(type)) {
    result = {
      items: [
        {
          title: "筛选通过",
          status: "success"
        },
        {
          title: "面试通过",
          status: "success"
        },
        {
          title: "offer沟通中",
          desc: ScheduleStatusMap[type]
        }
      ],
      current: 2
    };
  } else if (StepThreeFailed.includes(type)) {
    result = {
      items: [
        {
          title: "筛选通过",
          status: "success"
        },
        {
          title: "面试通过",
          status: "success"
        },
        {
          title: "未获得offer",
          desc: ScheduleStatusMap[type],
          status: "error"
        }
      ],
      current: 2
    };
  } else if (StepThreeSuccess.includes(type)) {
    result = {
      items: [
        {
          title: "筛选通过",
          status: "success"
        },
        {
          title: "面试通过",
          status: "success"
        },
        {
          title: "offer",
          desc: ScheduleStatusMap[type],
          status: "success"
        }
      ],
      current: 2
    };
  }

  return (
    <AtSteps
      items={result.items}
      current={result.current}
      onChange={() => {}}
    />
  );
};

type HistoryFilterDataType = {
  name: string;
  type: "radio";
  submenu: {
    submenu: {
      name: string;
      value: string;
    }[];
  }[];
};

const History: React.FC = props => {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMask, setToastMask] = useState(false);
  const [toastStatus, setToastStatus] = useState<ToastStatus>(
    ToastStatus.Loading
  );
  const [isEmpty, setIsEmpty] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDropdownValue, setFilterDropdownValue] = useState([
    [[null]],
    [[null]]
  ]);
  const [steps, setSteps] = useState<StepType[]>([
    {
      title: "未投递",
      desc: ""
    },
    {
      title: "未面试",
      desc: ""
    },
    {
      title: "暂未获得offer",
      desc: ""
    }
  ]);

  const history = useSelector<StoreType, HistoryStateType>(
    state => state.history
  );
  const userInfo = useSelector<StoreType, UserStateType>(state => state.user);
  const dispatch = useDispatch();
  const filterDatas = useMemo(
    () => [
      {
        name: "公司",
        type: "radio",
        submenu: [
          {
            submenu: [
              ...new Set(history.historyList.map(item => item.company))
            ].map(item => {
              return {
                name: item,
                value: item
              };
            })
          }
        ]
      },
      {
        name: "状态",
        type: "radio",
        submenu: [
          {
            submenu: [
              {
                name: "结束",
                value: "over"
              },
              {
                name: "进行中",
                value: "padding"
              }
            ]
          }
        ]
      }
    ],
    [history.historyList]
  );
  const [paddingList, setPaddingList] = useState<SchedulesType[]>(
    history.historyList.filter(
      item => !disableStatus.includes(item.status as ScheduleStatus)
    )
  );
  const [failedList, setFailedList] = useState<SchedulesType[]>(
    history.historyList.filter(item =>
      disableStatus.includes(item.status as ScheduleStatus)
    )
  );
  const refList = useRef(null);

  const getData = async () => {
    if (!userInfo.accessToken) return;
    const { data } = await getHistoryList(userInfo.accessToken);
    return {
      list: data,
      isEmpty: data.length === 0
    };
  };

  const searchChange = async () => {
    if (!userInfo.accessToken) return;
    const { data } = await getHistoryList(userInfo.accessToken);
    setPaddingList(
      [...data].filter(item => {
        return !disableStatus.includes(item.status as ScheduleStatus);
      })
    );
    setFailedList(
      [...data].filter(item =>
        disableStatus.includes(item.status as ScheduleStatus)
      )
    );
    dispatch(updateHistoryList([...data]));
    setIsEmpty(data.length === 0);
  };

  const pullDownRefresh = async () => {
    const { list, isEmpty } = await getData();
    setPaddingList(
      [...list].filter(
        item => !disableStatus.includes(item.status as ScheduleStatus)
      )
    );
    setFailedList(
      [...list].filter(item =>
        disableStatus.includes(item.status as ScheduleStatus)
      )
    );
    dispatch(updateHistoryList([...list]));
    setIsEmpty(isEmpty);
  };

  const confirm = e => {
    const company = e.value[0].flat(5).filter(item => item !== "")[0];
    const status = e.value[1].flat(5).filter(item => item !== "")[0];
    setFilterCompany(company || "");
    setFilterStatus(status || "");
  };

  const login = async () => {
    setToastOpen(true);
    setToastMask(true);
    setToastStatus(ToastStatus.Loading);
    try {
      const wxRes = await wxLogin();
      const {
        data: { access_token }
      } = await dbLogin(wxRes.code);
      Taro.setStorageSync("loginSessionKey", access_token);
      dispatch(updateAccessToken(access_token));
      dispatch(asyncUpdateUserInfoFromDb(access_token));
      dispatch(asyncGetFiles(access_token));
    } catch (e) {
      console.log(e);
      setToastStatus(ToastStatus.Error);
      setToastMask(false);
    }
  };

  useEffect(() => {
    searchChange();
  }, [searchValue, filterCompany, filterStatus]);

  useEffect(() => {
    if (
      toastOpen &&
      userInfo.userInfoFromDb.nickname &&
      userInfo.actionType === UPDATE_USERINFOFROMDB
    ) {
      setToastStatus(ToastStatus.Success);
    }
    if (
      toastOpen &&
      !userInfo.userInfoFromDb.nickname &&
      userInfo.actionType === USER_ERROR
    ) {
      setToastStatus(ToastStatus.Error);
    }
  }, [userInfo]);

  useEffect(() => {
    if (toastStatus !== ToastStatus.Loading) {
      setToastMask(false);
      setTimeout(() => {
        setToastOpen(false);
      }, 500);
    }
  }, [toastStatus]);

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: "进度查询"
    });
    // @ts-ignore
    if (userInfo.accessToken) refList.current.fetchInit();
  }, []);

  return (
    <View className="index-history">
      <AtSearchBar
        className={"search-bar"}
        inputType="text"
        value={searchValue}
        onChange={v => {
          setSearchValue(v);
        }}
        onActionClick={() => {
          searchChange();
        }}
        actionName={"搜索"}
      />
      <FilterDropdown
        filterData={filterDatas}
        defaultSelected={filterDropdownValue}
        updateMenuName={true}
        confirm={confirm}
        dataFormat="Object"
      />
      {userInfo.accessToken ? (
        <ListView
          ref={refList}
          isError={error}
          hasMore={hasMore}
          className={classNames("scroll-view-list")}
          selector={"selector"}
          isEmpty={isEmpty}
          onPullDownRefresh={pullDownRefresh}
          onScrollToLower={() => {}}
          emptyText={"没有找到您的投递记录"}
          needInit
          indicator={{
            release: "加载中",
            activate: "下拉刷新",
            deactivate: "释放刷新"
          }}
          footerLoadingText={""}
        >
          {(filterStatus === "padding" || filterStatus === "") &&
            paddingList
              .filter(
                item =>
                  item.company.includes(filterCompany) &&
                  item.target_name.includes(searchValue)
              )
              .map((item, index) => {
                return (
                  <AtCard
                    className={classNames("schedule-item")}
                    key={index + item.target_name}
                    note={`公司：${item.company}`}
                    extra={""}
                    title={item.target_name}
                    onClick={() => {
                      dispatch(updateCurrentHistory(item));
                      // Taro.navigateTo({
                      //   url: "/pages/scheduleDetail/index",
                      //   complete: () => {
                      //     dispatch(historyClearType());
                      //   }
                      // });
                    }}
                    // thumb=""
                  >
                    {getStepsList(item.status as ScheduleStatus)}
                  </AtCard>
                );
              })}
          {(filterStatus === "over" || filterStatus === "") &&
            failedList
              .filter(
                item =>
                  item.company.includes(filterCompany) &&
                  item.target_name.includes(searchValue)
              )
              .map((item, index) => {
                return (
                  <AtCard
                    className={classNames("schedule-item", "disable-item")}
                    key={index + item.target_name}
                    note={`公司：${item.company}`}
                    extra={""}
                    title={item.target_name}
                    onClick={() => {
                      dispatch(updateCurrentHistory(item));
                      // Taro.navigateTo({
                      //   url: "/pages/scheduleDetail/index",
                      //   complete: () => {
                      //     dispatch(historyClearType());
                      //   }
                      // });
                    }}
                    // thumb=""
                  >
                    {getStepsList(item.status as ScheduleStatus)}
                  </AtCard>
                );
              })}
        </ListView>
      ) : (
        <View className={classNames("not-login")}>
          <AtButton
            className={classNames("login")}
            type="primary"
            onClick={() => {
              login();
            }}
          >
            登录
          </AtButton>
        </View>
      )}
      <AtToast
        duration={0}
        isOpened={toastOpen}
        status={toastStatus}
        text={LoaingStatus[toastStatus]}
        hasMask
      />
    </View>
  );
};

export default History;
