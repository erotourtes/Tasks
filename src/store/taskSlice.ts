import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CustomTask, Task } from "@types";
import { apiStart } from "./apiActions";

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
    addedTask: (state, { payload: task }: PayloadAction<Task>) => {
      state.tasks.push(task);
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

// TODO: remove url
const url = "/tasks";

export const getTasks = () =>
  apiStart({
    url,
    method: "GET",
    onStart: taskActions.requestedTasks.type,
    onSuccess: taskActions.gotTasks.type,
  });
export const addTask = (task: CustomTask, isInstant = false, resetState?: () => void) =>
  apiStart({
    url,
    method: "POST",
    data: task,
    onSuccess: taskActions.addedTask.type,
    isInstant,
    resetState,
  });
export const updateTask = (task: Task, isInstant = false, resetState?: () => void) => {
  return apiStart({
    url: `${url}/${task.id}`,
    method: "PUT",
    data: task,
    onSuccess: taskActions.updatedTask.type,
    isInstant,
    resetState,
  });
}
export const deleteTask = (id: string) =>
  apiStart({
    url: `${url}/${id}`,
    method: "DELETE",
    onSuccess: taskActions.deletedTask.type,
  });

export const updateTaskWithoutApi = (task: Task) => taskActions.updatedTask(task);
export const deleteTaskWithoutApi = (id: string) => taskActions.deletedTask(id);
