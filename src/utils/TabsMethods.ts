import { generateId } from "./utils";
import { Tab } from "./types";

export const generateTabs = () => {
  const tabs: Tab[] = [
    {
      title: "Tab 1",
      level: 0,
      id: generateId(),
      isOpen: true,
      isHidden: false,
      children: [],
    },
    {
      title: "Tab 2",
      level: 0,
      id: generateId(),
      isOpen: true,
      isHidden: false,
      children: [],
    },
    {
      title: "Tab 3",
      level: 1,
      id: generateId(),
      isOpen: true,
      isHidden: false,
      children: [],
    },
    {
      title: "Tab 4",
      level: 2,
      id: generateId(),
      isOpen: true,
      isHidden: false,
      children: [],
    },
    {
      title: "Tab 5",
      level: 1,
      id: generateId(),
      isOpen: true,
      isHidden: false,
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

Remove the tab and all children
*/
export const sRemoveTabAndChildren = (tabs: Tab[], index: number) => {
  const tab = tabs[index];
  const childrenCount = sCountChildren(tab);

  tabs.splice(index, childrenCount + 1);

  _sRemoveTabFromParent(tab);
};

/**

Remove the tab from the parent.children array
without updating the tabs array
*/
export const _sRemoveTabFromParent = (tab: Tab) => {
  const parent = tab.parent;
  if (!parent) return;

  const parentIndex = parent.children?.indexOf(tab);
  if (parentIndex == undefined || parentIndex == -1)
    throw new Error("Severe, the children array is out of sync");
  parent.children?.splice(parentIndex, 1);
};

const _sForEveryChild = (tab: Tab, callback: (tab: Tab, level: number) => void) => {
  const helper = (
    tab: Tab,
    levelFromTab: number,
    callback: (tab: Tab, level: number) => void,
  ) => {
    for (const child of tab.children) {
      helper(child, levelFromTab + 1, callback);
      callback(child, levelFromTab + 1);
    }
  };

  helper(tab, 0, callback);
};

/**

Remove the tab and update the level of all children, as well as the parent.children array
*/
export const sRemoveTab = (tabs: Tab[], tab: Tab) => {
  const index = tabs.findIndex((cur) => cur.id === tab.id);
  const parent = tab.parent;

  _sForEveryChild(tab, (child) => child.level--);

  for (const child of tab.children) child.parent = parent;
  parent?.children.push(...tab.children);

  tabs.splice(index, 1);

  _sRemoveTabFromParent(tab);
};

/**

Update the level of the tab and all children
*/
const _sUpdateLevel = (tab: Tab, level: number) => {
  tab.level = level;
  _sForEveryChild(tab, (child, level) => child.level = tab.level + level);
};

/**

Updating parent for the tab and its children
*/
const _sUpdateParent = (tabs: Tab[], tab: Tab, parent: Tab) => {
  _sRemoveTabFromParent(tab);

  // update the parent for the tab and its children
  tab.parent = parent;
  _sUpdateLevel(tab, parent.level + 1);
  parent.children.push(tab);

  // reorder the indexes in the tabs array
  const srcIndex = tabs.indexOf(tab);
  const toMove = tabs.splice(srcIndex, sCountChildren(tab) + 1);

  const dstIndex = tabs.indexOf(parent) + 1;
  tabs.splice(dstIndex, 0, ...toMove);

  // update the isHidden property for the tab and its children
  const isHidden = !parent.isOpen || parent.isHidden;
  tab.isHidden = isHidden;
  sToggleHideForChildren(tab, isHidden);
};

const _isTabInside = (srcTab: Tab, dstTab: Tab) => {
  for (const child of dstTab.children) {
    if (child.id === srcTab.id) return true;
    if (_isTabInside(srcTab, child)) return true;
  }
};

export const sMoveTabInside = (tabs: Tab[], srcTab: Tab, dstTab: Tab) => {
  if (_isTabInside(dstTab, srcTab)) return;
  _sUpdateParent(tabs, srcTab, dstTab);
};

export const sFindTab = (tabs: Tab[], id: string): Tab | undefined => {
  return tabs.find((tab) => tab.id === id);
};

export const sInsertTabAfter = (tabs: Tab[], src: number, dstTab: Tab) => {
  const srcTab = tabs[src];
  const parent = dstTab.parent;

  srcTab.parent = parent;
  srcTab.level = dstTab.level;
  const index = parent?.children.indexOf(dstTab) || 0;
  parent?.children.splice(index + 1, 0, srcTab);
};
