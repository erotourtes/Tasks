import { TabNode } from "./TabsMethods";
import { ReducerType } from "@store/reducer";

// Task
export type TaskID = string;

export type Task = {
  id: TaskID;
  title: string;
  status: string;
  description: string;
  createdAt: string;
  subtasks: TaskID[];
  tags: string[];
};


// Store
export type StoreState = ReducerType;

// Drag
export const DragTypes = {
  TAB: "tab",
};

export type MoveType = "inside" | "after" | "firstChild";

export type TabDragItem = {
  id: string;
  tab: TabNode;
};

// Api
export type ApiPayload = {
  url: string;
  method: string;
  data?: object;
  onStart?: string;
  onSuccess: string;
  onError?: string;
};
