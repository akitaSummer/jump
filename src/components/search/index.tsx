import React, { useState, useEffect, useRef } from "react";
import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtCard, AtActivityIndicator, AtSearchBar } from "taro-ui";
import ListView, { LazyBlock, Skeleton } from "taro-listview";
import classNames from "classnames";
import { useSelector, useDispatch } from "react-redux";

import {
  StoreType,
  RecommendsStateType,
  recommendsClearType,
  updateRecommendsList,
  updateCurrentRecommend
} from "../../store";
import { filterDatas } from "../../utils";
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
  const [tags, setTags] = useState("");
  const [citys, setCitys] = useState("");
  const [filterDropdownValue, setFilterDropdownValue] = useState([
    [[], []],
    [[0]]
  ]);
  const [searchValue, setSearchValue] = useState("");
  const [list, setList] = useState<RecommendType[]>([]);
  const recommends = useSelector<StoreType, RecommendsStateType>(
    state => state.recommends
  );
  const dispatch = useDispatch();
  const refList = useRef(null);

  const searchChange = async () => {
    if (isFrist) return;
    dispatch(updateRecommendsList([]));
    const {
      data: { datas, pageNum, totalPages }
    } = await getRecommends(1, 10, searchValue, tags, citys);
    console.log(selector);
    if (selector) {
      setSelector(false);
    }
    setList([...datas]);
    dispatch(updateRecommendsList([...datas]));
    setHasMore(pageNum < totalPages);
  };

  const getData = async (pIndex = pageIndex) => {
    const {
      data: { datas, pageNum, totalPages }
    } = await getRecommends(pIndex, 10, searchValue, tags, citys);
    if (selector) {
      setSelector(false);
    }
    return {
      list: datas,
      hasMore: pageNum < totalPages
    };
  };

  const pullDownRefresh = async () => {
    pageIndex = 1;
    const { list, hasMore } = await getData(1);
    setList([...list]);
    dispatch(updateRecommendsList([...list]));
    setHasMore(hasMore);
  };

  const onScrollToLower = async fn => {
    const { list: newList, hasMore } = await getData(++pageIndex);
    setList(list.concat(newList));
    setHasMore(hasMore);
    fn();
  };

  const confirm = e => {
    console.log(e.value);
    const tags = e.value[0]
      .flat(5)
      .filter(item => item !== "")
      .join(",");
    const citys = e.value[1]
      .flat(5)
      .filter(item => item !== "")
      .join(",");

    setTags(tags);
    setCitys(citys);
  };

  useEffect(() => {
    console.log(recommends.recommendsList.length);
    // @ts-ignore
    refList.current.fetchInit();
    setIsFirst(false);
  }, []);

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: "跳一下"
    });
  }, []);

  useEffect(() => {
    searchChange();
  }, [searchValue, tags, citys]);

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
        actionName={"搜索"}
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
        emptyText={"没有找到您搜索的岗位"}
        needInit
        indicator={{
          release: "加载中",
          activate: "下拉刷新",
          deactivate: "释放刷新"
        }}
        footerLoadingText={""}
      >
        {selector &&
          recommends.recommendsList.length < 6 &&
          Array(9)
            .fill(1)
            .map(i => (
              <AtCard
                className={classNames("selector-item")}
                key={i}
                note={"..."}
                extra={"..."}
                title={"..."}
                // thumb=""
              >
                <View className="item skeletonBg" key={i}>
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
                key={index + item.depFullName}
                note={`公司：${item.origin}; 工作地点：${item.workPlace}；`}
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
            <AtCard
              className={classNames("recommend-item")}
              key={index + item.depFullName}
              note={`公司：${item.origin}; 工作地点：${item.workPlace}`}
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
          );
        })}
        {hasMore && (
          <View className={classNames("footer-loading")}>
            <AtActivityIndicator mode="center"></AtActivityIndicator>
          </View>
        )}
      </ListView>
    </View>
  );
};
export default Search;
