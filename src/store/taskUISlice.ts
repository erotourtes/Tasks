import {
  ApiStatus,
  Task,
  TaskID,
  TaskUIInfo,
  TaskUIState,
} from "@/utils/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const defaultTaskUIInfo: () => TaskUIInfo = () => ({
  isOpened: false,
  status: "idle",
});

const setStatusForTasks = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any,
  {
    payload: { tasks, type },
  }: PayloadAction<{ tasks: Task[]; type: ApiStatus }>,
) => {
  const taskIDs = tasks.map((t) => t.id);
  for (const taskID of taskIDs) {
    const taskInfo = state.taskUIInfo[taskID];
    if (!taskInfo) state.taskUIInfo[taskID] = defaultTaskUIInfo();
    state.taskUIInfo[taskID].status = type;
  }
};

const taskUISlice = createSlice({
  name: "taskUI",
  initialState: {
    taskUIInfo: {} as TaskUIState,
  },
  reducers: {
    setOppened: (
      state,
      {
        payload: { taskID, isOpened },
      }: PayloadAction<{ taskID: TaskID; isOpened: boolean }>,
    ) => {
      const taskInfo = state.taskUIInfo[taskID];
      if (!taskInfo) state.taskUIInfo[taskID] = defaultTaskUIInfo();
      state.taskUIInfo[taskID].isOpened = isOpened;
    },
    setStatus: (
      state,
      {
        payload: { taskID, status },
      }: PayloadAction<{ taskID: TaskID; status: ApiStatus }>,
    ) => {
      const taskInfo = state.taskUIInfo[taskID];
      if (!taskInfo) state.taskUIInfo[taskID] = defaultTaskUIInfo();
      state.taskUIInfo[taskID].status = status;
    },
    setTasksStatusSuccess: (
      state,
      { payload: tasks, type }: PayloadAction<Task[]>,
    ) => {
      const payload: PayloadAction<{ tasks: Task[]; type: ApiStatus }> = {
        payload: { tasks, type: "succeeded" },
        type,
      };
      setStatusForTasks(state, payload);
    },
  },
});

export default taskUISlice;

const taskUIActions = taskUISlice.actions;
export const { setOppened, setStatus, setTasksStatusSuccess } = taskUIActions;
