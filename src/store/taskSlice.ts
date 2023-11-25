import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { produce } from "immer";

import { CustomTask, StoreDispatch, Task } from "@types";
import { apiStart } from "./apiActions";
import { generateId } from "@/utils/utils";
import * as uiActions from "./taskUISlice";

const taskSlice = createSlice({
  name: "task",
  initialState: {
    tasks: [] as Task[],
    loading: false,
    error: null as string | null,
  },
  reducers: {
    requestedTasks: (state) => {
      state.loading = true;
      state.error = null;
    },
    gotTasks: (state, { payload: tasks }: PayloadAction<Task[]>) => {
      state.loading = false;
      state.tasks = tasks;
    },
    setTasks: (state, { payload: tasks }: PayloadAction<Task[]>) => {
      console.log("setTasks", tasks);
      state.tasks = tasks;
    },
    addedTask: (state, { payload: task }: PayloadAction<Task>) => {
      state.tasks.push(task);
    },
    updatedTaskByOldID: (
      state,
      {
        payload: { task, oldID },
      }: PayloadAction<{ task: Task; oldID: string }>,
    ) => {
      const index = state.tasks.findIndex((t) => t.id === oldID);
      if (index === -1) throw new Error("Can't update task");
      state.tasks[index] = task;
    },
    updatedTask: (state, { payload: task }: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((t) => t.id === task.id);
      if (index === -1) throw new Error("Can't update task");
      state.tasks[index] = task;
    },
    deletedTask: (state, { payload: taskID }: PayloadAction<string>) => {
      const index = state.tasks.findIndex((t) => t.id === taskID);
      if (index === -1) throw new Error("Can't delete task");
      state.tasks.splice(index, 1);
    },
  },
});

export default taskSlice;

// Action Creators
const taskActions = taskSlice.actions;

// Thunks (send request to server; then update the state)
// TODO: remove url
const url = "/tasks";

export const getTasks = () =>
  apiStart({
    url,
    method: "GET",
    onStart: [taskActions.requestedTasks.type],
    onSuccess: [
      uiActions.setTasksStatusSuccess.type,
      taskActions.gotTasks.type,
    ],
  });
export const addTask = (
  task: CustomTask,
  isInstant = false,
  onErrorInstant?: () => void,
  onSuccessInstant?: (t: Task) => void,
) =>
  apiStart({
    url,
    method: "POST",
    data: task,
    onSuccess: [taskActions.addedTask.type],
    isInstant,
    onErrorInstant,
    onSuccessInstant,
  });
const updateTask = (
  task: Task,
  isInstant = false,
  onErrorInstant?: () => void,
  onSuccessInstant?: (t: Task) => void,
) => {
  return apiStart({
    url: `${url}/${task.id}`,
    method: "PUT",
    data: task,
    onSuccess: [taskActions.updatedTask.type],
    isInstant,
    onErrorInstant,
    onSuccessInstant,
  });
};
export const deleteTask = (id: string) =>
  apiStart({
    url: `${url}/${id}`,
    method: "DELETE",
    onSuccess: [taskActions.deletedTask.type],
  });

// Instant Actions (update the state instantly, then send request to server)

export const markTaskAsDoneInstantly = (
  dispatch: StoreDispatch,
  task: Task,
  onSuccessInstant?: (t: Task) => void,
) => {
  const newTask = produce(task, (draft) => {
    draft.status = "Completed";
  });
  dispatch(uiActions.setStatus({ taskID: task.id, status: "loading" }));
  dispatch(
    updateTask(
      newTask,
      true,
      () => {
        dispatch(uiActions.setStatus({ taskID: task.id, status: "failed" }));
        dispatch(taskActions.updatedTask(task));
      },
      (t) => {
        dispatch(uiActions.setStatus({ taskID: task.id, status: "succeeded" }));
        if (onSuccessInstant) onSuccessInstant(t);
      },
    ),
  );
};

export const addTaskInstantly = (
  dispatch: StoreDispatch,
  task: CustomTask,
  onSuccessInstant?: (t: Task) => void,
  onErrorInstant?: () => void,
) => {
  const customTempID = `CUSTOM_ID:${generateId()}`;
  const newTask = { ...task, id: customTempID };

  dispatch(uiActions.setStatus({ taskID: customTempID, status: "loading" }));

  dispatch(
    addTask(
      newTask,
      true,
      () => {
        dispatch(taskActions.deletedTask(customTempID));
        onErrorInstant && onErrorInstant();
        dispatch(
          uiActions.setStatus({ taskID: customTempID, status: "failed" }),
        );
      },
      (t) => {
        dispatch(
          taskActions.updatedTaskByOldID({ task: t, oldID: customTempID }),
        );
        dispatch(uiActions.setStatus({ taskID: t.id, status: "succeeded" }));
        if (onSuccessInstant) onSuccessInstant(t);
      },
    ),
  );
};

export const updateTaskInstantly = (
  dispatch: StoreDispatch,
  task: Task,
  onSuccessInstant?: (t: Task) => void,
  onErrorInstant?: () => void,
) => {
  dispatch(uiActions.setStatus({ taskID: task.id, status: "loading" }));
  dispatch(
    updateTask(
      task,
      true,
      () => {
        dispatch(uiActions.setStatus({ taskID: task.id, status: "failed" }));
        dispatch(taskActions.updatedTask(task));
        onErrorInstant && onErrorInstant();
      },
      (t) => {
        dispatch(uiActions.setStatus({ taskID: task.id, status: "succeeded" }));
        if (onSuccessInstant) onSuccessInstant(t);
      },
    ),
  );
}

// Local Actions (update the state locally)
export const setTasks = (tasks: Task[]) => taskActions.setTasks(tasks);
