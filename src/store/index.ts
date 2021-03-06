import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducer, {
  UserStateType,
  DatasStateType,
  RecommendsStateType,
  HistoryStateType
} from "./reducers";

const composeEnhancers =
  typeof window === "object" &&
  //@ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? //@ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const middlewares = [thunkMiddleware];

if (
  process.env.NODE_ENV === "development" &&
  process.env.TARO_ENV !== "quickapp"
) {
  middlewares.push(require("redux-logger").createLogger());
}

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares)
  // other store enhancers if any
);

export {
  UserStateType,
  DatasStateType,
  RecommendsStateType,
  HistoryStateType
} from "./reducers";

export type StoreType = {
  user: UserStateType;
  datas: DatasStateType;
  recommends: RecommendsStateType;
  history: HistoryStateType;
};

export * from "./reducers";

export * from "./actions";

export * from "./constants";

export default function configStore() {
  const store = createStore(rootReducer, enhancer);
  return store;
}
