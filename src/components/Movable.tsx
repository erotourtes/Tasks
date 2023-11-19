import { useState } from "react";
import { DragTypes, Tab } from "../utils/types";
import { useDrop } from "react-dnd";

function Movable() {
  const [currentTab, setCurrentTab] = useState<Tab | null>(null);

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: DragTypes.TAB,
    drop: (item) => {
      setCurrentTab(item.tab as Tab);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={dropRef} className={`w-full h-full relative dark:bg-zinc-700 flex items-center justify-center`}>
      {isOver && (
        <div
          className={`border-2 rounded-xl border-dashed border-zinc-200 absolute top-5 left-5 bottom-5 right-5 flex items-center justify-center dark:text-zinc-200 text-3xl`}
        >
          Drop here
        </div>
      )}

      {currentTab && <div className="dark:bg-zinc-800 dark:text-zinc-200 w-1/2 h-1/2 rounded-lg">You selected {currentTab.title}</div>}
    </div>
  );
}

export default Movable;
