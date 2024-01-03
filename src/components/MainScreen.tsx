import { useState } from "react";
import AllCardsScreen from "./AllCardsScreen";
import { DragTypes, Task } from "@/utils/types";
import CardViewScreen from "./CardViewScreen";
import { useDrop } from "react-dnd";
import { TabNode } from "@/utils/TabsMethods";
import DropArea from "./DropArea";

export default function MainScreen() {
  const [task, setTask] = useState<Task | null>();

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: DragTypes.TAB,
    drop: (item: { id: string; tab: TabNode<Task> }) => {
      setTask(item.tab.getForeign());
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const screen =
    task == null ? (
      <AllCardsScreen isOver={isOver} onTaskClick={(task) => setTask(task)} />
    ) : (
      <CardViewScreen task={task} onBackPressed={() => setTask(null)} />
    );

  return (
    <div
      ref={dropRef}
      className={`w-full h-full relative dark:bg-zinc-700 p-4 overflow-y-auto`}
    >
      {screen}

      <DropArea isOver={isOver} />
    </div>
  );
}
