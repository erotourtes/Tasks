import { useEffect, useRef, useState } from "react";
import { updateTask } from "@/store/taskSlice";
import { produce } from "immer";
import { changeOnEvent } from "@/utils/utils";
import { Task } from "@/utils/types";
import { useDispatch } from "react-redux";

interface CardProps {
  task: Task;
  subtasks: Task[];
}

const taskText = (type: string) => (type === "Completed" ? "line-through" : "");

export default function Card({ task, subtasks }: CardProps) {
  const cardHeight = 200;

  const dispatch = useDispatch();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [isEditing, setIsEditing] = useState(false);

  const changeTitle = changeOnEvent(setTitle, (title) =>
    setIsEditing(task.title !== title),
  );
  const changeDescription = changeOnEvent(setDescription, (description) =>
    setIsEditing(task.description !== description),
  );

  const saveUpdatedTask = () => {
    const newTask = produce(task, (draft) => {
      draft.title = title;
      draft.description = description;
    });

    dispatch(updateTask(newTask));
    setIsEditing(false);
  };

  const cancel = () => {
    setTitle(task.title);
    setDescription(task.description);
    setIsEditing(false);
  };

  return (
    <div
      style={{ height: cardHeight, maxHeight: cardHeight }}
      className={`dark:bg-zinc-800 dark:text-zinc-200 w-fit rounded-lg ${
        task.status === "Completed" ? "opacity-50" : ""
      } shadow-lg flex flex-col relative`}
    >
      <div className="flex justify-between flex-col p-2">
        <input
          type="text"
          className={`text-3xl bg-transparent border-none outline-none ${taskText(
            task.status,
          )}`}
          value={title}
          onChange={changeTitle}
        />

        <input
          type="text"
          className="text-sm text-zinc-500 bg-transparent border-none outline-none w-fit"
          value={description}
          onChange={changeDescription}
        />
      </div>
      <div style={{ height: 1.5 }} className={`w-full bg-zinc-300`} />

      <ListContainer iterable={subtasks} />

      {isEditing && (
        <div className="bg-zinc-500 text-zinc-50 absolute rounded-lg bottom-2 right-2 space-x-2">
          <button
            className={`bg-zinc-500 text-zinc-50 rounded-lg px-2 py-1`}
            onClick={saveUpdatedTask}
          >
            Save
          </button>
          <button
            className={`bg-zinc-500 text-zinc-50 rounded-lg px-2 py-1`}
            onClick={cancel}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

// TODO: make more generic
function ListContainer({ iterable }: { iterable: Task[] }) {
  const ulContainerRef = useRef<HTMLDivElement | null>(null);
  const [liHeight, setLiHeight] = useState(0);
  const [ulHeight, setUliHeight] = useState(0);

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

  return (
    <div ref={ulContainerRef} className={`flex-1 overflow-hidden p-2`}>
      <ul className="overflow-hidden">{renderSubtasks(iterable)}</ul>
    </div>
  );
}
