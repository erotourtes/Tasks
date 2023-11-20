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

  set __level(level: number) {
    this.#level = level;
  }

  addChild(...children: TabNode[]) {
    for (const child of children) {
      // WTF typescript refresher doesn't allow to access private properties of the same class (works with double refresh)
      child.__level = this.#level + 1;
      child.__parent = this;
      this.#children.push(child);
    }
  }

  removeChild(child: TabNode) {
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

  isParentOf(tab: TabNode) {
    const children = this.#children;
    for (const child of children) {
      if (tab.id === child.#id) return true;
      if (child.isParentOf(tab)) return true;
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

  set __id(id: string) {
    this.#id = id;
  }

  set __parent(parent: TabNode | undefined) {
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

  toString() {
    return `TabNode(title:${this.#title}, level:${this.#level}, id:${
      this.#id
    }, open:${this.#isOpen}, children:${this.#children.length})`;
  }
}

export class Tabs {
  #root = new TabNode("root", undefined);
  #rootID = "__root__";
  #tabs: { [key: string]: TabNode } = {};

  constructor(flatTabNodes?: TabNode[]) {
    this.#root.__id = this.#rootID;
    console.log("level of root is", this.#root.level);

    if (!flatTabNodes) return;
    this.#checkUniqueness(flatTabNodes);

    for (const node of flatTabNodes) {
      this.#tabs[node.id] = node;
    }

    for (const node of flatTabNodes) {
      const parent = node.__parent;
      if (!parent) throw new Error("Parent not found");
      if (parent.id === this.#rootID) {
        this.#root.addChild(node);
      }
    }

    console.log("this.#root", this.#root);
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
    console.log(`moveInside(${srcID}, ${dstID})`);
    if (srcID == dstID) return this;

    const srcTab = this.#tabs[srcID];
    const dstTab = this.#tabs[dstID];

    if (srcTab.isParentOf(dstTab)) return this;
    console.log("allow moving")

    srcTab.__parent?.removeChild(srcTab);
    dstTab.addChild(srcTab);

    this.#checkUniqueness(this.flatTabNodes);

    return this;
  }

  moveAfter(srcID: string, dstID: string) {
    return this;
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

  get flatTabNodes() {
    const toFlat = (tab: TabNode) => {
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

  #checkUniqueness(flatStructure: TabNode[]) {
    const set = new Set(flatStructure);
    if (set.size !== flatStructure.length) throw new Error("Duplicate found");
  }
}
