import React, { useState, useEffect, useRef, useMemo } from "react";
import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtCard, AtActivityIndicator, AtSearchBar } from "taro-ui";
import ListView, { LazyBlock, Skeleton } from "taro-listview";
import classNames from "classnames";
import { useSelector, useDispatch } from "react-redux";

import {
  StoreType,
  DatasStateType,
  RecommendsStateType,
  recommendsClearType,
  updateRecommendsList,
  updateCurrentRecommend,
  UserStateType
} from "../../store";
import { filterDatas as filterDefaultDatas, changeNavBarTitle } from "../../utils";
import { getRecommends } from "../../api";
import FilterDropdown from "../filterDropdown";
import "./index.scss";

const blankList = [
  {
    author: {},
    title: "this is a example"
  }
];
let pageIndex = 1;

type RecommendType = {
  depFullName: string;
  description: string;
  jobId: string;
  name: string;
  num: number;
  origin: string;
  reqEducationName: string;
  reqWorkYearsName: string;
  requirement: string;
  type: "social" | "school";
  workPlace: string;
};

const Search = () => {
  const [isFrist, setIsFirst] = useState(true);
  const [selector, setSelector] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [years, setYears] = useState("");
  const [education, setEducation] = useState("");
  const [citys, setCitys] = useState("");
  const [filterDropdownValue, setFilterDropdownValue] = useState([
    [[]],
    [[]],
    [[]]
  ]);
  const [searchValue, setSearchValue] = useState("");
  const [list, setList] = useState<RecommendType[]>([]);
  const datas = useSelector<StoreType, DatasStateType>(state => state.datas);
  const recommends = useSelector<StoreType, RecommendsStateType>(
    state => state.recommends
  );
  const userInfo = useSelector<StoreType, UserStateType>(state => state.user);
  const filterDatas = useMemo(() => {
    const data = [...filterDefaultDatas];
    data[2] = {
      name: "??????",
      type: "radio",
      submenu: [
        ...datas.citysList.map(item => {
          return {
            name: item.title,
            submenu: item.value.map(city => {
              return {
                name: city,
                value: city
              };
            })
          };
        })
      ]
    };
    return data;
  }, [datas.citysList]);
  const dispatch = useDispatch();
  const refList = useRef(null);
  const searchChange = async () => {
    if (isFrist) return;
    dispatch(updateRecommendsList([]));
    const {
      data: { datas, pageNum, totalPages }
    } = await getRecommends(
      1,
      10,
      searchValue,
      userInfo.userInfoFromDb.tips,
      years,
      education,
      citys
    );
    if (selector) {
      setSelector(false);
    }
    setList([...datas]);
    dispatch(updateRecommendsList([...datas]));
    setHasMore(pageNum < totalPages);
    setIsEmpty(datas.length === 0);
  };

  const getData = async (pIndex = pageIndex) => {
    const {
      data: { datas, pageNum, totalPages }
    } = await getRecommends(
      pIndex,
      10,
      searchValue,
      userInfo.userInfoFromDb.tips,
      years,
      education,
      citys
    );
    if (selector) {
      setSelector(false);
    }
    return {
      list: datas,
      hasMore: pageNum < totalPages,
      isEmpty: datas.length === 0
    };
  };

  const pullDownRefresh = async () => {
    pageIndex = 1;
    const { list, hasMore, isEmpty } = await getData(1);
    setList([...list]);
    dispatch(updateRecommendsList([...list]));
    setHasMore(hasMore);
    setIsEmpty(isEmpty);
  };

  const onScrollToLower = async fn => {
    const { list: newList, hasMore } = await getData(++pageIndex);
    setList(list.concat(newList));
    setHasMore(hasMore);
    fn();
  };

  const confirm = e => {
    const years = e.value[0]
      .flat(5)
      .filter(item => item !== "")
      .join(",");
    const education = e.value[1]
      .flat(5)
      .filter(item => item !== "")
      .join(",");
    const citys = e.value[2]
      .flat(5)
      .filter(item => item !== "")
      .join(",");

    setYears(years);
    setEducation(education);
    setCitys(citys);
  };

  useEffect(() => {
    // @ts-ignore
    setIsFirst(false);
  }, []);

  useEffect(() => {
    changeNavBarTitle('UFreedom')
  }, []);

  useEffect(() => {
    searchChange();
  }, [searchValue, education, citys, years]);

  return (
    <View className={classNames("index-search")}>
      <AtSearchBar
        className={"search-bar"}
        inputType="text"
        value={searchValue}
        onChange={v => {
          setSelector(true);
          setSearchValue(v);
        }}
        onActionClick={() => {
          searchChange();
        }}
        actionName={"??????"}
      />
      <FilterDropdown
        filterData={filterDatas}
        defaultSelected={filterDropdownValue}
        updateMenuName={true}
        confirm={confirm}
        dataFormat="Object"
      />
      <ListView
        ref={refList}
        isError={error}
        hasMore={hasMore}
        className={classNames("scroll-view-list")}
        selector={"selector"}
        isEmpty={isEmpty}
        onPullDownRefresh={pullDownRefresh}
        onScrollToLower={onScrollToLower}
        emptyText={"??????????????????????????????"}
        needInit
        indicator={{
          release: "?????????",
          activate: "????????????",
          deactivate: "????????????"
        }}
        footerLoadingText={""}
      >
        {selector &&
          recommends.recommendsList.length < 6 &&
          Array(9)
            .fill(0)
            .map((item, i) => (
              <AtCard
                className={classNames("selector-item")}
                key={`${i}-selector`}
                note={"..."}
                extra={"..."}
                title={"..."}
                // thumb=""
              >
                <View className="item skeletonBg">
                  <View className="selector-item-value"></View>
                </View>
              </AtCard>
            ))}
        {selector &&
          recommends.recommendsList.length >= 0 &&
          recommends.recommendsList.slice(0, 9).map((item, index) => {
            return (
              <AtCard
                className={classNames("recommend-item")}
                key={index + item.depFullName + item.jobId}
                note={`?????????${item.origin}; ???????????????${item.workPlace}???`}
                extra={item.reqWorkYearsName}
                title={item.name}
                // thumb=""
              >
                <View className="itemtitle">{item.depFullName}</View>
              </AtCard>
            );
          })}

        {list.map((item, index) => {
          return (
            <>
              <AtCard
                className={classNames("recommend-item")}
                key={index + item.depFullName + item.jobId}
                note={`?????????${item.origin}; ???????????????${item.workPlace}`}
                extra={item.reqWorkYearsName}
                title={item.name}
                onClick={() => {
                  dispatch(updateCurrentRecommend(item));
                  Taro.navigateTo({
                    url: "/pages/recommendDetail/index",
                    complete: () => {
                      dispatch(recommendsClearType());
                    }
                  });
                }}
                // thumb=""
              >
                <View className="itemtitle">{item.depFullName}</View>
              </AtCard>
              {index === list.length - 1 && hasMore && (
                <View className={classNames("footer-loading")}>
                  <AtActivityIndicator mode="center"></AtActivityIndicator>
                </View>
              )}
            </>
          );
        })}
      </ListView>
    </View>
  );
};
export default Search;
