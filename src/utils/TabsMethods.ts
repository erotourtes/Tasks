import { generateId } from "./utils";
import { Tab } from "./types";

export const generateTabs = () => {
  const tabs: Tab[] = [
    {
      title: "Tab 1",
      level: 0,
      id: generateId(),
      isOpen: false,
      isHidden: false,
      children: [],
    },
    {
      title: "Tab 2",
      level: 0,
      id: generateId(),
      isOpen: false,
      isHidden: false,
      children: [],
    },
    {
      title: "Tab 3",
      level: 1,
      id: generateId(),
      isOpen: false,
      isHidden: true,
      children: [],
    },
    {
      title: "Tab 4",
      level: 2,
      id: generateId(),
      isOpen: false,
      isHidden: true,
      children: [],
    },
    {
      title: "Tab 5",
      level: 1,
      id: generateId(),
      isOpen: false,
      isHidden: true,
      children: [],
    },
  ];

  tabs[1].children = [tabs[2], tabs[4]];
  tabs[2].children = [tabs[3]];

  tabs[2].parent = tabs[1];
  tabs[3].parent = tabs[2];
  tabs[4].parent = tabs[1];

  return tabs;
};

/**

  This function will recursively toggle the isHidden property for all children
  of the tab. If the tab is closed or the parent is hidden, the child will be hidden.
*/
export const sToggleHideForChildren = (tab: Tab, isHidden: boolean) => {
  for (const child of tab.children) {
    child.isHidden = isHidden;
    // if the child is closed or the parent is hidden, hide the child
    const isHiddenChild = !child.isOpen || isHidden;
    sToggleHideForChildren(child, isHiddenChild);
  }
};

export const sCountChildren = (tab: Tab) => {
  let count = 0;
  for (const child of tab.children) {
    count++;
    count += sCountChildren(child);
  }

  return count;
};

/**

Remvoe the tab and all children
*/
export const sRemoveTabAndChildren = (tabs: Tab[], index: number) => {
  const tab = tabs[index];
  const childrenCount = sCountChildren(tab);

  tabs.splice(index, childrenCount + 1);
};

export const sForEveryChild = (tab: Tab, callback: (tab: Tab) => void) => {
  for (const child of tab.children) {
    sForEveryChild(child, callback);
    callback(child);
  }
};

/**

Remvoe the tab and update the level of all children
*/
export const sRemoveTab = (tabs: Tab[], index: number) => {
  const tab = tabs[index];
  const parent = tab.parent;

  sForEveryChild(tab, (child) => {
    child.level--;
  });

  for (const child of tab.children) child.parent = parent;

  tabs.splice(index, 1);
};
