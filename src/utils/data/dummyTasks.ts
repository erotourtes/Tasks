import { Task } from "../types";

export const dummyTasks: Task[] = [
  {
    id: "1",
    title: "You can",
    status: "todo",
    description: "Description 1",
    createdAt: "2021-08-01",
    subtasks: ["2"],
    tags: [],
    removed: false,
  },
  {
    id: "2",
    title: "reorder tasks",
    status: "todo",
    description: "Description 2",
    createdAt: "2021-08-02",
    subtasks: [],
    tags: [],
    removed: false,
  },
  {
    id: "3",
    title: "in the left sidebar",
    status: "todo",
    description: "Description 3",
    createdAt: "2021-08-01",
    subtasks: ["4", "5", "6", "7", "8", "9", "10"],
    tags: [],
    removed: false,
  },
  {
    id: "4",
    title: "Toggle the visibility",
    status: "todo",
    description: "Description 4",
    createdAt: "2021-08-02",
    subtasks: [],
    tags: [],
    removed: false,
  },
  {
    id: "5",
    title: "of the subtasks",
    status: "todo",
    description: "Description 5",
    createdAt: "2021-08-01",
    subtasks: [],
    tags: [],
    removed: false,
  },
  {
    id: "6",
    title: "with the arrow icon",
    status: "todo",
    description: "Description 6",
    createdAt: "2021-08-02",
    subtasks: [],
    tags: [],
    removed: false,
  },
  {
    id: "7",
    title: "Lock/Unlock the task",
    status: "todo",
    description: "Description 7",
    createdAt: "2021-08-01",
    subtasks: [],
    tags: [],
    removed: false,
  },
  {
    id: "8",
    title: "to apply changes",
    status: "todo",
    description: "Description 8",
    createdAt: "2021-08-02",
    subtasks: [],
    tags: [],
    removed: false,
  },
  {
    id: "9",
    title: "to subtasks",
    status: "todo",
    description: "Description 9",
    createdAt: "2021-08-01",
    subtasks: [],
    tags: [],
    removed: false,
  },
  {
    id: "10",
    title: "HF!",
    status: "todo",
    description: "Description 10",
    createdAt: "2021-08-02",
    subtasks: [],
    tags: [],
    removed: false,
  },
];
