import { TabNode } from "./TabsMethods";
import { ReducerType } from "@store/reducer";

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
}

export type Task = {
  id: TaskID;
} & CustomTask;


// Store
export type StoreState = ReducerType;

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
  onStart?: string;
  onSuccess: string;
  onError?: string;
  isInstant?: boolean;
  resetState?: () => void;
};
