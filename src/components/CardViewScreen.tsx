import { Task } from "@/utils/types";

interface CardViewScreenProps {
  task: Task;
  onBackPressed: () => void;
}

export default function CardViewScreen({
  task,
  onBackPressed,
}: CardViewScreenProps) {
  return (
    <div>
      <button className={`border-zinc-800 mb-3`} onClick={onBackPressed}>
        Click to go Back
      </button>
      <div> TODO: display card</div>
      <div>Title:{task.title} </div>
      <div>ID:{task.id}</div>
    </div>
  );
}
