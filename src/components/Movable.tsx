import { DragTypes, StoreState } from "../utils/types";
import { useDrop } from "react-dnd";
import { Task } from "@types";
import { useSelector } from "react-redux";
import DropArea from "./DropArea";
import Card from "./Card";

function Movable() {
  const tasks = useSelector<StoreState, Task[]>(
    (state) => state.entities.task.tasks,
  );

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: DragTypes.TAB,
    drop: () => {
      // setTasks((prev) =>
      // prev.indexOf(item.tab) === -1 ? [...prev, item.tab] : prev,
      // );
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <>
      <div
        ref={dropRef}
        className={`w-full h-full relative dark:bg-zinc-700 p-4 overflow-y-auto`}
      >
        <div
          className={`${
            isOver && "brightness-50"
          } flex flex-wrap gap-4 justify-start`}
        >
          {tasks.map((task) => (
            <Card
              key={task.id}
              task={task}
              subtasks={task.subtasks.map(
                (id) => tasks.find((task) => task.id === id)!,
              )}
            />
          ))}
        </div>

        <DropArea isOver={isOver} />
      </div>
    </>
  );
}

export default Movable;
