import { TabNode } from "./TabsMethods";
import { ReducerType } from "@store/reducer";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";

// Task
export type TaskID = string;

export type CustomTask = {
  title: string;
  status: string;
  description: string;
  createdAt: string;
  subtasks: TaskID[];
  tags: string[];
  removed: boolean;
};

type ServerTask = {
  id: TaskID;
} & CustomTask;

export type Task = ServerTask;

export interface IsOpenable {
  isOpened: boolean;
}

export interface Lockable {
  isLocked: boolean;
}

export type ApiStatus = "idle" | "loading" | "succeeded" | "failed";

export type TaskUIInfo = {
  status: ApiStatus;
} & IsOpenable & Lockable;

export type TaskUIState = {
  [taskID: TaskID]: TaskUIInfo;
};

// Store
export type StoreState = ReducerType;

export type StoreDispatch = Dispatch<AnyAction>;

// Drag
export const DragTypes = {
  TAB: "tab",
};

export type MoveType = "inside" | "after" | "firstChild";

export type TabDragItem = {
  id: string;
  tab: TabNode<TaskID>;
};

// Api
export type ApiPayload = {
  url: string;
  method: string;
  data?: object;
  onStart?: string[];
  onSuccess: string[];
  onError?: string[];
  isInstant?: boolean;
  onErrorInstant?: () => void;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  // TODO
  onSuccessInstant?: (response: any) => void;
};
