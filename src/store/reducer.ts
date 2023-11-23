import { combineReducers } from "redux";

import taskSlice from "@store/taskSlice";

const entitiesReducer = combineReducers({
  task: taskSlice.reducer,
});

const rootReducer =  combineReducers({
  entities: entitiesReducer,
});

export default rootReducer;

export type ReducerType = ReturnType<typeof rootReducer>
