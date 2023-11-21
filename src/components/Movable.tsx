import { LegacyRef, useEffect, useRef, useState } from "react";
import { DragTypes, TabDragItem } from "../utils/types";
import { useDrop } from "react-dnd";
import { Task } from "../data/dummyTasks";
import { dummyTasks } from "../data/dummyTasks";

function DropArea({ isOver }: { isOver: boolean }) {
  return (
    <>
      {isOver && (
        <div
          className={`z-100 border-2 rounded-xl border-dashed border-zinc-200 absolute top-5 left-5 bottom-5 right-5 flex items-center justify-center dark:text-zinc-200 text-3xl dark:bg-dark-drop`}
        >
          Drop here
        </div>
      )}
    </>
  );
}

interface CardProps {
  task: Task;
  changeTitle: (title: string) => void;
  changeDescription: (description: string) => void;
}

function Card(props: CardProps) {
  const cardHeight = 200;
  // TODO: extract to list component
  const ulContainerRef = useRef<HTMLDivElement | null>(null);
  const [liHeight, setLiHeight] = useState(0);
  const [ulHeight, setUliHeight] = useState(0);

  useEffect(() => {
    const div = ulContainerRef.current;
    if (!div) throw new Error("ulContainerRef.current is null");
    const ul = div.children[0] as HTMLUListElement;
    if (!ul) throw new Error("ulRef.current is null");

    try {
      const ulHeight = div.getBoundingClientRect().height;
      setUliHeight(ulHeight ? ulHeight : 0);

      const liHeight = ul.children[0].getBoundingClientRect().height;
      setLiHeight(liHeight ? liHeight : 0);
    } catch (e) {
      /*Just to not handle index problem*/
    }
  }, [ulContainerRef]);

  const taskText = (type: string) =>
    type === "Completed" ? "line-through" : "";

  const renderSubtasks = (subtasks?: Task[]) => {
    if (!subtasks) return null;
    const tasks = [];

    for (let i = 0; i < subtasks.length; i++) {
      const task = subtasks[i];
      const liFitCount = Math.floor(ulHeight / liHeight);

      if (i + 1 >= liFitCount) {
        tasks.push(
          <li key={task.id} className={`text-sm dark:text-zinc-300`}>
            ...
          </li>,
        );
        break;
      }

      tasks.push(
        <li
          key={task.id}
          className={`text-sm dark:text-zinc-300 ${taskText(task.status)}`}
        >
          {task.title}
        </li>,
      );
    }
    return tasks;
  };

  return (
    <div
      style={{ height: cardHeight, maxHeight: cardHeight }}
      className={`dark:bg-zinc-800 dark:text-zinc-200 w-fit rounded-lg ${
        props.task.status === "Completed" ? "opacity-50" : ""
      } shadow-lg flex flex-col`}
    >
      <div className="flex justify-between flex-col p-2">
        <input
          type="text"
          className={`text-3xl bg-transparent border-none outline-none ${taskText(
            props.task.status,
          )}`}
          value={props.task.title}
          onChange={(e) => props.changeTitle(e.target.value)}
        />

        <input
          type="text"
          className="text-sm text-zinc-500 bg-transparent border-none outline-none w-fit"
          value={props.task.description}
          onChange={(e) => props.changeDescription(e.target.value)}
        />
      </div>
      <div style={{ height: 1.5 }} className={`w-full bg-zinc-300`} />

      <div ref={ulContainerRef} className={`flex-1 overflow-hidden p-2`}>
        <ul className="overflow-hidden">
          {renderSubtasks(props.task.subtasks)}
        </ul>
      </div>
    </div>
  );
}

function Movable() {
  const [tasks, setTasks] = useState<Task[]>(dummyTasks);

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

  const changeDescription = (id: number, description: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, description } : t)),
    );
  };

  const changeTitle = (id: number, title: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));
  };

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
              changeTitle={(title) => {
                changeTitle(task.id, title);
              }}
              changeDescription={(description) =>
                changeDescription(task.id, description)
              }
            />
          ))}
        </div>

        <DropArea isOver={isOver} />
      </div>
    </>
  );
}

export default Movable;
