export type Tab = {
  title: string;
  level: number;
  id: string;
  isOpen: boolean;
  isHidden: boolean;
  parent?: Tab;
  children: Tab[];
};

export const DragTypes = {
  TAB: "tab",
};

export type MoveType = "inside" | "after"
