import { generateId } from "./utils";

export class TabNode {
  #title: string;
  #level: number;
  #id: string = generateId();
  #isOpen: boolean = true;
  #children: TabNode[] = [];
  #parent?: TabNode;

  constructor(title: string, parent?: TabNode, isOpen = true) {
    this.#title = title;
    this.#level = parent ? parent.#level + 1 : -1;
    this.#parent = parent;
    this.#isOpen = isOpen;
  }

  addChild(...child: TabNode[]) {
    this.#children.push(...child);
  }

  removeChild(child: TabNode) {
    const index = this.#children.indexOf(child);
    if (index === -1) throw new Error("Child not found");
    this.#children.splice(index, 1);
    console.log("root children", this.#children);
  }

  removeItself() {
    if (!this.#parent) throw new Error("Root cannot be removed");
    this.#parent.removeChild(this);
  }

  removeAllChildren() {
    this.#children = [];
  }

  isParentOf(tab: TabNode) {
    const children = this.#children;
    for (const child of children) {
      if (tab.id === this.#id) return true;
      if (child.isParentOf(child)) return true;
    }
  }

  get state() {
    return {
      title: this.#title,
      level: this.#level,
      id: this.#id,
      isOpen: this.#isOpen,
    };
  }

  get hasChildren() {
    return this.#children.length > 0;
  }

  get title() {
    return this.#title;
  }

  get id() {
    return this.#id;
  }

  get childrenTitles() {
    return this.#children.map((child) => child.title);
  }

  get __children() {
    return this.#children;
  }

  get __parent() {
    return this.#parent;
  }

  set __parent(parent: TabNode | undefined) {
    this.#parent = parent;
  }

  get isOpen() {
    return this.#isOpen;
  }

  set isOpen(isOpen: boolean) {
    this.#isOpen = isOpen;
  }
}

export class Tabs {
  #root = new TabNode("root", undefined);
  #tabs: { [key: string]: TabNode } = {};

  constructor(nodes?: TabNode[]) {
    if (!nodes) return;
    for (const node of nodes) {
      this.#tabs[node.id] = node;
      this.#root.addChild(node);
      node.__parent = this.#root;
    }
  }

  addTab(...titles: string[]) {
    for (const title of titles) {
      const tab = new TabNode(title, this.#root);
      this.#tabs[tab.id] = tab;
      this.#root.addChild(tab);
    }

    return this;
  }

  /**
  Remove the tab based on if tab is open or closed.
  */
  remove(tabID: string) {
    const tab = this.#tabs[tabID];
    if (tab.isOpen) this.removeTab(tabID);
    else this.removeTabAndChildren(tabID);

    return this;
  }

  /**
  Toggle the isOpen property of the tab
  */
  toggleOpen(tabID: string) {
    const tab = this.#tabs[tabID];
    tab.isOpen = !tab.isOpen;

    return this;
  }

  /**
  Move the tab inside the dstTab
  */
  moveInside(srcID: string, dstID: string) {
    if (srcID == dstID) return this;

    const srcTab = this.#tabs[srcID];
    const dstTab = this.#tabs[dstID];

    if (srcTab.isParentOf(dstTab)) return this;

    srcTab.__parent?.removeChild(srcTab);
    dstTab.addChild(srcTab);
    srcTab.__parent = dstTab;

    console.log("root children", this.#root.__children);

    return this;
  }

  moveAfter(srcID: string, dstID: string) {
    return this
  }

  removeTabAndChildren(tabID: string) {
    const tab = this.#tabs[tabID];
    tab.removeItself();
    for (const child of tab.childrenTitles) {
      delete this.#tabs[child];
    }
    delete this.#tabs[tabID];
  }

  removeTab(tabID: string) {
    const tab = this.#tabs[tabID];
    tab.removeItself();
    delete this.#tabs[tabID];

    const parent = tab.__parent!;
    parent.addChild(...tab.__children);
  }

  get tabNodes() {
    return [...this.#root.__children];
  }
}

// export const generateTabs = () => {
//   const tabs: Tab[] = [
//     {
//       title: "Tab 1",
//       level: 0,
//       id: generateId(),
//       isOpen: true,
//       isHidden: false,
//       children: [],
//     },
//     {
//       title: "Tab 2",
//       level: 0,
//       id: generateId(),
//       isOpen: true,
//       isHidden: false,
//       children: [],
//     },
//     {
//       title: "Tab 3",
//       level: 1,
//       id: generateId(),
//       isOpen: true,
//       isHidden: false,
//       children: [],
//     },
//     {
//       title: "Tab 4",
//       level: 2,
//       id: generateId(),
//       isOpen: true,
//       isHidden: false,
//       children: [],
//     },
//     {
//       title: "Tab 5",
//       level: 1,
//       id: generateId(),
//       isOpen: true,
//       isHidden: false,
//       children: [],
//     },
//   ];
//
//   tabs[1].children = [tabs[2], tabs[4]];
//   tabs[2].children = [tabs[3]];
//
//   tabs[2].parent = tabs[1];
//   tabs[3].parent = tabs[2];
//   tabs[4].parent = tabs[1];
//
//   return tabs;
// };
//
// /**
//
//   This function will recursively toggle the isHidden property for all children
//   of the tab. If the tab is closed or the parent is hidden, the child will be hidden.
// */
// export const sToggleHideForChildren = (tab: Tab, isHidden: boolean) => {
//   for (const child of tab.children) {
//     child.isHidden = isHidden;
//     // if the child is closed or the parent is hidden, hide the child
//     const isHiddenChild = !child.isOpen || isHidden;
//     sToggleHideForChildren(child, isHiddenChild);
//   }
// };
//
// export const sCountChildren = (tab: Tab) => {
//   let count = 0;
//   for (const child of tab.children) {
//     count++;
//     count += sCountChildren(child);
//   }
//
//   return count;
// };
//
// /**
//
// Remove the tab and all children
// */
// export const sRemoveTabAndChildren = (tabs: Tab[], index: number) => {
//   const tab = tabs[index];
//   const childrenCount = sCountChildren(tab);
//
//   tabs.splice(index, childrenCount + 1);
//
//   _sRemoveTabFromParent(tab);
// };
//
// /**
//
// Remove the tab from the parent.children array
// without updating the tabs array
// */
// export const _sRemoveTabFromParent = (tab: Tab) => {
//   const parent = tab.parent;
//   if (!parent) return;
//
//   const parentIndex = parent.children?.indexOf(tab);
//   if (parentIndex == undefined || parentIndex == -1)
//     throw new Error("Severe, the children array is out of sync");
//   parent.children?.splice(parentIndex, 1);
// };
//
// const _sForEveryChild = (tab: Tab, callback: (tab: Tab, level: number) => void) => {
//   const helper = (
//     tab: Tab,
//     levelFromTab: number,
//     callback: (tab: Tab, level: number) => void,
//   ) => {
//     for (const child of tab.children) {
//       helper(child, levelFromTab + 1, callback);
//       callback(child, levelFromTab + 1);
//     }
//   };
//
//   helper(tab, 0, callback);
// };
//
// /**
//
// Remove the tab and update the level of all children, as well as the parent.children array
// */
// export const sRemoveTab = (tabs: Tab[], tab: Tab) => {
//   const index = tabs.findIndex((cur) => cur.id === tab.id);
//   const parent = tab.parent;
//
//   _sForEveryChild(tab, (child) => child.level--);
//
//   for (const child of tab.children) child.parent = parent;
//   parent?.children.push(...tab.children);
//
//   tabs.splice(index, 1);
//
//   _sRemoveTabFromParent(tab);
// };
//
// /**
//
// Update the level of the tab and all children
// */
// const _sUpdateLevel = (tab: Tab, level: number) => {
//   tab.level = level;
//   _sForEveryChild(tab, (child, level) => child.level = tab.level + level);
// };
//
// /**
//
// Updating parent for the tab and its children
// */
// const _sUpdateParent = (tabs: Tab[], tab: Tab, parent: Tab) => {
//   _sRemoveTabFromParent(tab);
//
//   // update the parent for the tab and its children
//   tab.parent = parent;
//   _sUpdateLevel(tab, parent.level + 1);
//   parent.children.push(tab);
//
//   // reorder the indexes in the tabs array
//   const srcIndex = tabs.indexOf(tab);
//   const toMove = tabs.splice(srcIndex, sCountChildren(tab) + 1);
//
//   const dstIndex = tabs.indexOf(parent) + 1;
//   tabs.splice(dstIndex, 0, ...toMove);
//
//   // update the isHidden property for the tab and its children
//   const isHidden = !parent.isOpen || parent.isHidden;
//   tab.isHidden = isHidden;
//   sToggleHideForChildren(tab, isHidden);
// };
//
// const _isTabInside = (srcTab: Tab, dstTab: Tab) => {
//   for (const child of dstTab.children) {
//     if (child.id === srcTab.id) return true;
//     if (_isTabInside(srcTab, child)) return true;
//   }
// };
//
// export const sMoveTabInside = (tabs: Tab[], srcTab: Tab, dstTab: Tab) => {
//   if (_isTabInside(dstTab, srcTab)) return;
//   _sUpdateParent(tabs, srcTab, dstTab);
// };
//
// export const sFindTab = (tabs: Tab[], id: string): Tab | undefined => {
//   return tabs.find((tab) => tab.id === id);
// };
//
// export const sInsertTabAfter = (tabs: Tab[], src: number, dstTab: Tab) => {
//   const srcTab = tabs[src];
//   const parent = dstTab.parent;
//
//   srcTab.parent = parent;
//   srcTab.level = dstTab.level;
//   const index = parent?.children.indexOf(dstTab) || 0;
//   parent?.children.splice(index + 1, 0, srcTab);
// };
