import { useState } from "react";
import { generateId } from "../utils/utils.ts";
import { Tab } from "../utils/types.ts";
import * as Tabs from "../utils/TabsMethods.ts";
import TreeTab from "./TreeTab.tsx";

function TreeView() {
  const treeViewWidth = 300;
  const [tabs, setTabs] = useState<Tab[]>(Tabs.generateTabs());

  const removeTab = (id: number) => {
    const newTabs = [...tabs];
    const tab = newTabs[id];

    if (tab.isOpen) Tabs.sRemoveTab(newTabs, id);
    else Tabs.sRemoveTabAndChildren(newTabs, id);

    setTabs(newTabs);
  };

  const toggleOpen = (id: number) => {
    const newTabs = [...tabs];
    const tab = newTabs[id];

    tab.isOpen = !tab.isOpen;
    Tabs.sToggleHideForChildren(tab, !tab.isOpen);

    setTabs(newTabs);
  };

  return (
    <>
      <div
        style={{ width: treeViewWidth }}
        className="dark:bg-zinc-950 dark:text-zinc-200 overflow-y-auto space-y-2 p-2"
      >
        {tabs.map((tab, index) => {
          if (tab.isHidden) return;

          return (
            <TreeTab
              key={tab.id}
              tab={tab}
              toggleOpen={() => toggleOpen(index)}
              destroyTab={() => removeTab(index)}
            />
          );
        })}

        <button
          className = "dark:hover:bg-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 px-2 py-2 w-full rounded-lg border dark:border-zinc-700 border-zinc-300"
          onClick={() =>
            setTabs([
              ...tabs,
              {
                title: `Tab ${tabs.length + 1}`,
                level: 0,
                id: generateId(),
                isOpen: false,
                isHidden: false,
                children: [],
              },
            ])
          }
        >
          Add Tab
        </button>
      </div>
    </>
  );
}

export default TreeView;
