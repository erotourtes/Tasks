import { generateId } from "./utils";

export class TabNode<T> {
  #level: number;
  #id: string = generateId();
  #isOpen: boolean = true;
  #children: TabNode<T>[] = [];
  #parent?: TabNode<T>;
  #foreign?: T;

  getForeign() {
    if (!this.#foreign) throw new Error("Foreign not found");
    return this.#foreign;
  }

  constructor(foreign?: T, parent?: TabNode<T>, isOpen = false) {
    this.#foreign = foreign;
    this.#level = parent ? parent.#level + 1 : -1;
    this.#parent = parent;
    this.#isOpen = isOpen;
  }

  set __level(level: number) {
    this.#level = level;
  }

  addChild(...children: TabNode<T>[]) {
    for (const child of children) {
      // WTF typescript refresher doesn't allow to access private properties of the same class (works with double refresh)
      child.__level = this.#level + 1;
      child.__parent = this;
      this.#children.push(child);
      child.updateChildrenLevel();
    }
  }

  updateChildrenLevel() {
    for (const child of this.#children) {
      child.__level = this.#level + 1;
      child.updateChildrenLevel();
    }
  }

  addSiblingAfter(...tabs: TabNode<T>[]) {
    for (const tab of tabs) {
      tab.__level = this.level;
    }

    this.__parent!.addChildNextTo(this, ...tabs);
  }

  addSiblingsAtBeginning(...tabs: TabNode<T>[]) {
    for (const tab of tabs) {
      tab.__level = this.level;
    }

    this.__parent!.addChildNextTo(undefined, ...tabs);
  }

  /**
  Adds child after the tab
  if the tab is undefined, adds children at index 0
  */
  addChildNextTo(tab?: TabNode<T>, ...children: TabNode<T>[]) {
    if (tab === undefined) {
      for (const child of children) {
        child.__level = this.#level + 1;
        child.__parent = this;
      }

      this.#children.splice(0, 0, ...children);
      return;
    }

    const index = this.#children.indexOf(tab);
    if (index === -1) throw new Error("Tab not found");
    for (const child of children) {
      child.__level = this.#level + 1;
      child.__parent = this;
      this.#children.splice(index + 1, 0, child);
    }
  }

  removeChild(child: TabNode<T>) {
    const index = this.#children.indexOf(child);
    if (index === -1) throw new Error("Child not found");
    this.#children.splice(index, 1);
  }

  removeItself() {
    if (!this.#parent) throw new Error("Root cannot be removed");
    this.#parent.removeChild(this);
  }

  removeAllChildren() {
    this.#children = [];
  }

  isParentOf(tab: TabNode<T>) {
    const children = this.#children;
    for (const child of children) {
      if (tab.id === child.#id) return true;
      if (child.isParentOf(tab)) return true;
    }
  }

  get state() {
    return {
      level: this.#level,
      id: this.#id,
      isOpen: this.#isOpen,
    };
  }

  get hasChildren() {
    return this.#children.length > 0;
  }

  get id() {
    return this.#id;
  }

  get childrenIDs() {
    return this.#children.map((child) => child.id);
  }

  get __children() {
    return this.#children;
  }

  get __parent() {
    return this.#parent;
  }

  set __id(id: string) {
    this.#id = id;
  }

  set __parent(parent: TabNode<T> | undefined) {
    this.#parent = parent;
  }

  get isOpen() {
    return this.#isOpen;
  }

  get level() {
    return this.#level;
  }

  set isOpen(isOpen: boolean) {
    this.#isOpen = isOpen;
  }

  isFirst() {
    const parent = this.#parent;
    if (!parent) throw new Error("Root can't be checked");
    return this.#getPositionInChildren() === 0;
  }

  #getPositionInChildren() {
    const parent = this.#parent;
    if (!parent) throw new Error("Root can't be checked");
    return parent.__children.findIndex((el) => el.id === this.id);
  }
}

type ID = string | number;

export class Tabs<
  T extends {
    id: ID;
    subtasks: ID[];
  },
> {
  #rootID = "__root__";
  #root = new TabNode<T>();
  #tabs: { [key: string]: TabNode<T> } = {};

  constructor(data: T[]) {
    this.#populateTabsFromData(data);
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

  moveInside(srcID: string, dstID: string): Tabs<T> {
    const srcTab = this.#tabs[srcID];
    if (!srcTab.isOpen) this.moveInsideWithChildren(srcID, dstID);
    else this.moveInsideWithoutChildren(srcID, dstID);

    return this;
  }

  moveInsideWithChildren(srcID: string, dstID: string) {
    if (srcID == dstID) return;

    const srcTab = this.#tabs[srcID];
    const dstTab = this.#tabs[dstID];

    if (srcTab.isParentOf(dstTab)) return;

    srcTab.removeItself();
    dstTab.addChild(srcTab);

    this.#checkUniqueness(this.flatTabNodes);
  }

  moveInsideWithoutChildren(srcID: string, dstID: string) {
    if (srcID == dstID) return;

    const srcTab = this.#tabs[srcID];
    const dstTab = this.#tabs[dstID];

    if (srcTab.isParentOf(dstTab)) return;

    srcTab.addSiblingAfter(...srcTab.__children);
    srcTab.removeAllChildren();
    srcTab.removeItself();
    dstTab.addChild(srcTab);
  }

  moveAfter(srcID: string, dstID: string): Tabs<T> {
    const srcTab = this.#tabs[srcID];

    if (!srcTab.isOpen) this.moveAfterWithChildren(srcID, dstID);
    else this.moveAfterWithoutChildren(srcID, dstID);

    return this;
  }

  moveAfterWithChildren(srcID: string, dstID: string) {
    if (srcID == dstID) return;

    const srcTab = this.#tabs[srcID];
    const dstTab = this.#tabs[dstID];

    if (srcTab.isParentOf(dstTab)) return;

    srcTab.removeItself();
    dstTab.addSiblingAfter(srcTab);
  }

  moveAfterWithoutChildren(srcID: string, dstID: string) {
    if (srcID == dstID) return;

    const srcTab = this.#tabs[srcID];
    const dstTab = this.#tabs[dstID];

    if (srcTab.isParentOf(dstTab)) return;

    srcTab.addSiblingAfter(...srcTab.__children);
    srcTab.removeAllChildren();
    srcTab.removeItself();
    dstTab.addSiblingAfter(srcTab);
  }

  moveAtBeginning(srcID: string, dstID: string): Tabs<T> {
    const srcTab = this.#tabs[srcID];

    if (!srcTab.isOpen) this.moveAtBeginningWithChildren(srcID, dstID);
    else this.moveAtBeginningWithoutChildren(srcID, dstID);

    return this;
  }

  moveAtBeginningWithChildren(srcID: string, dstID: string) {
    if (srcID == dstID) return;

    const srcTab = this.#tabs[srcID];
    const dstTab = this.#tabs[dstID];

    if (srcTab.isParentOf(dstTab)) return;

    srcTab.removeItself();
    dstTab.addSiblingsAtBeginning(srcTab);
  }

  moveAtBeginningWithoutChildren(srcID: string, dstID: string) {
    if (srcID == dstID) return;

    const srcTab = this.#tabs[srcID];
    const dstTab = this.#tabs[dstID];

    if (srcTab.isParentOf(dstTab)) return;

    srcTab.addSiblingsAtBeginning(...srcTab.__children);
    srcTab.removeAllChildren();
    srcTab.removeItself();
    dstTab.addSiblingsAtBeginning(srcTab);
  }

  removeTabAndChildren(tabID: string) {
    const tab = this.#tabs[tabID];
    tab.removeItself();
    for (const childID of tab.childrenIDs) {
      delete this.#tabs[childID];
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

  get flatTabNodes() {
    const toFlat = (tab: TabNode<T>) => {
      const result = [tab];

      for (const child of tab.__children) {
        result.push(...toFlat(child));
      }

      return result;
    };

    const result = toFlat(this.#root);
    result.shift();
    this.#checkUniqueness(result);
    return result;
  }

  get flatRoot() {
    return [...this.#root.__children];
  }

  #checkUniqueness(flatStructure: TabNode<T>[]) {
    const set = new Set(flatStructure);
    if (set.size !== flatStructure.length) throw new Error("Duplicate found");
  }

  #populateTabsFromData(foreignData: T[]) {
    this.#root.__id = this.#rootID;

    // mapping foreign.id to tab
    const originalTabsMap: { [key: ID]: TabNode<T> } = {};

    // mapping foreignData and tabs
    for (const data of foreignData) {
      const tab = new TabNode<T>(data);
      this.#tabs[tab.id] = tab;
      if (originalTabsMap[data.id]) throw new Error("Duplicate found");
      originalTabsMap[data.id] = tab;
    }

    // adding subtasks
    for (const data of foreignData) {
      const tab = originalTabsMap[data.id];
      for (const subtask of data.subtasks) {
        const child = originalTabsMap[subtask];
        tab.addChild(child);
      }
    }

    // adding to the root
    for (const [, tab] of Object.entries(originalTabsMap)) {
      if (!tab.__parent) {
        this.#root.addChild(tab);
      }
    }

    console.log(this.#root);
  }

}
