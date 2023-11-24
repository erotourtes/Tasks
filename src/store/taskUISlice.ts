import { TaskID, TaskUIState } from "@/utils/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const taskUISlice = createSlice({
  name: "taskUI",
  initialState: {
    taskUIInfo: {} as TaskUIState,
  },
  reducers: {
    // setSynced: (state, { payload: { taskID, synced } }: PayloadAction<TaskID, Vjjj) => {
    //   const taskInfo = state.taskUIInfo[taskID]
    //   taskInfo.isSynced
    // },
    setOppened: (
      state,
      {
        payload: { taskID, isOpened },
      }: PayloadAction<{ taskID: TaskID; isOpened: boolean }>,
    ) => {
      const taskInfo = state.taskUIInfo[taskID];
      if (!taskInfo) state.taskUIInfo[taskID] = { isOpened, isSynced: true, isSyncing: false, error: "" };
      state.taskUIInfo[taskID].isOpened = isOpened;
    },
  },
});

export default taskUISlice;

const taskUIActions = taskUISlice.actions;
export const { setOppened } = taskUIActions;
