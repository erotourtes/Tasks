import { useState } from "react";
import Movable from "./Movable";
import { Task } from "@/utils/types";
import CardViewScreen from "./CardViewScreen";

export default function MainScreen() {
  const [task, setTask] = useState<Task | null>();

  const screen =
    task == null ? (
      <Movable onMoveTaskToScreen={setTask} />
    ) : (
      <CardViewScreen task={task} onBackPressed={() => setTask(null)} />
    );

  return (
    <div
      // ref={dropRef}
      // className={`w-full h-full relative dark:bg-zinc-700 p-4 overflow-y-auto`}
    >
      {screen}
    </div>
  );
}
