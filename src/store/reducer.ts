import { combineReducers } from "redux";

import taskSlice from "@store/taskSlice";
import taskUISlice from "./taskUISlice";

const entitiesReducer = combineReducers({
  task: taskSlice.reducer,
});

const uiReducer = combineReducers({
  taskUI: taskUISlice.reducer, //TODO: remove taskUI if task is removed
});

const rootReducer =  combineReducers({
  entities: entitiesReducer,
  ui: uiReducer,
});

export default rootReducer;

export type ReducerType = ReturnType<typeof rootReducer>
