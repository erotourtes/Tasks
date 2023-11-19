export type Tab = {
  title: string;
  level: number;
  id: string;
  isOpen: boolean;
  isHidden: boolean;
  parent?: Tab;
  children: Tab[];
};

