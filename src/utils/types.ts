import { TabNode } from "./TabsMethods";

export const DragTypes = {
  TAB: "tab",
};

export type MoveType = "inside" | "after" | "firstChild"


export type TabDragItem = {
  id: string;
  tab: TabNode;
};
