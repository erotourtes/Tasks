import { StoreState } from "../utils/types";
import { Task } from "@types";
import { useSelector } from "react-redux";
import Card from "./Card";

interface AllCardsScreenProps {
  isOver: boolean;
  onTaskClick: (task: Task) => void
}

function AllCardsScreen({ isOver, onTaskClick }: AllCardsScreenProps) {
  const tasks = useSelector<StoreState, Task[]>(
    (state) => state.entities.task.tasks,
  );

  return (
    <>
      <div
        className={`${
          isOver && "brightness-50"
        } flex flex-wrap gap-4 justify-start`}
      >
        {tasks.map((task) => (
          <Card
            key={task.id}
            task={task}
            onTaskClick={() => onTaskClick(task)}
            subtasks={task.subtasks.map(
              (id) => tasks.find((task) => task.id === id)!,
            )}
          />
        ))}
      </div>
    </>
  );
}

export default AllCardsScreen;
