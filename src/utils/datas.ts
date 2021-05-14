export const degreeList = ["大专", "本科", "硕士", "博士"];
export const tipsList = [
  {
    trade: "开发",
    tips: ["Java", "js", "golang", "rust", "c++"]
  },
  {
    trade: "其他",
    tips: ["产品", "运维", "hr"]
  }
];

export const filterDatas = [
  // {
  //   // name:'智能排序',
  //   type: "hierarchy",
  //   submenu: [
  //     {
  //       name: "智能排序",
  //       value: "智能排序"
  //     },
  //     {
  //       name: "离我最近",
  //       value: "离我最近"
  //     },
  //     {
  //       name: "人均从高到低",
  //       value: "人均从高到低"
  //     },
  //     {
  //       name: "人均从低到高",
  //       value: "人均从低到高"
  //     }
  //   ]
  // },
  {
    name: "职位",
    type: "filter",
    submenu: [
      {
        name: "开发",
        submenu: [
          {
            name: "Java",
            value: "Java"
          },
          {
            name: "js",
            value: "js"
          },
          {
            name: "golang",
            value: "golang"
          }
        ]
      },
      {
        name: "其他",
        submenu: [
          {
            name: "rust",
            value: "rust"
          },
          {
            name: "c++",
            value: "c++"
          },
          {
            name: "产品",
            value: "产品"
          },
          {
            name: "运维",
            value: "运维"
          },
          {
            name: "hr",
            value: "hr"
          }
        ]
      }
    ]
  },
  {
    name: "城市",
    type: "radio",
    submenu: [
      {
        submenu: [
          {
            name: "不限",
            value: ""
          },
          {
            name: "杭州市",
            value: "杭州市"
          },
          {
            name: "北京市",
            value: "北京市"
          },
          {
            name: "上海市",
            value: "上海市"
          },
          {
            name: "广州市",
            value: "广州市"
          }
        ]
      }
    ]
  }
];
