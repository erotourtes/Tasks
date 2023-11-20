import { useState } from "react";
import { MoveType } from "../utils/types.ts";
import { Tabs } from "../utils/TabsMethods.ts";
import TreeTab from "./TreeTab.tsx";
import { TabNode } from "../utils/TabsMethods.ts";

function TreeView() {
  const treeViewWidth = 300;
  const [tabs, setTabs] = useState<TabNode[]>([]);
  const str = new Tabs(tabs);

  const removeTab = (id: string) => setTabs([...str.remove(id).flatTabNodes]);
  const toggleOpen = (id: string) => setTabs(str.toggleOpen(id).flatTabNodes);

  const moveTab = (srcIndex: string, dstIndex: string, type: MoveType) => {
    const actions: {
      [key in MoveType]: (srcIndex: string, dstIndex: string) => Tabs;
    } = {
      inside: str.moveInside.bind(str),
      after: str.moveAfter.bind(str),
      firstChild: str.moveAtBeginning.bind(str),
    };

    setTabs(actions[type](srcIndex, dstIndex).flatTabNodes);
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
        className="dark:bg-zinc-950 dark:text-zinc-200 overflow-y-auto p-2"
      >
        {renderTabs(str.flatRoot)}

        <button
          className="dark:hover:bg-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 px-2 py-2 w-full rounded-lg border dark:border-zinc-700 border-zinc-300"
          onClick={() =>
            setTabs(str.addTab(`Tab ${tabs.length + 1}`).flatTabNodes)
          }
        >
          Add Tab
        </button>
      </div>
    </>
  );
}

export default TreeView;
