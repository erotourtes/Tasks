import { useState } from "react";
import { MoveType } from "../utils/types.ts";
import { Tabs } from "../utils/TabsMethods.ts";
import TreeTab from "./TreeTab.tsx";
import { TabNode } from "../utils/TabsMethods.ts";

function TreeView() {
  const treeViewWidth = 300;
  const [tabs, setTabs] = useState<TabNode[]>([]);
  const str = new Tabs(tabs);

  const removeTab = (id: string) => setTabs([...str.remove(id).tabNodes]);
  const toggleOpen = (id: string) => setTabs(str.toggleOpen(id).tabNodes);

  const moveTab = (srcIndex: string, dstIndex: string, type: MoveType) => {
    if (type === "inside") {
      setTabs(str.moveInside(srcIndex, dstIndex).tabNodes);
    }
    // this problem
    // const actions: {
    //   [key in MoveType]: (srcIndex: string, dstIndex: string) => Tabs;
    // } = {
    //   inside: str.moveInside,
    //   after: str.moveAfter,
    // };
    //
    // setTabs(actions[type](srcIndex, dstIndex).tabNodes);
  };

  const renderTabs = (tabs?: TabNode[]) => {
    return tabs?.map((tab) => {
      return (
        <TreeTab
          key={tab.id}
          tab={tab}
          destroyTab={() => removeTab(tab.id)}
          toggleOpen={() => toggleOpen(tab.id)}
          moveTab={(srcID, type) => moveTab(srcID, tab.id, type)}
        >
          {renderTabs(tab.__children)}
        </TreeTab>
      );
    });
  };

  return (
    <>
      <div
        style={{ width: treeViewWidth }}
        className="dark:bg-zinc-950 dark:text-zinc-200 overflow-y-auto space-y-2 p-2"
      >
        {renderTabs(tabs)}

        <button
          className="dark:hover:bg-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 px-2 py-2 w-full rounded-lg border dark:border-zinc-700 border-zinc-300"
          onClick={() => setTabs(str.addTab(`Tab ${tabs.length + 1}`).tabNodes)}
        >
          Add Tab
        </button>
      </div>
    </>
  );
}

export default TreeView;
