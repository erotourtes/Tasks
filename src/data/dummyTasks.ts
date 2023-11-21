export type Task = {
  id: number;
  title: string;
  description: string;
  status: "In Progress" | "Completed" | "TODO";
  subtasks?: Task[];
};

export const dummyTasks: Task[] = [
  {
    id: 1,
    title: "Learn Angular",
    description: "Learn Angular",
    status: "In Progress",
    subtasks: [
      {
        id: 4,
        title: "Learn Angular",
        description: "Learn Angular",
        status: "In Progress",
      },
      {
        id: 5,
        title: "Write Angular App",
        description: "Write Angular App",
        status: "TODO",
      },
    ],
  },
  {
    id: 2,
    title: "Learn React",
    description: "Learn React",
    status: "Completed",
    subtasks: [
      {
        id: 6,
        title: "Learn React",
        description: "Learn React",
        status: "Completed",
      },
      {
        id: 7,
        title: "Write React App",
        description: "Write React App",
        status: "Completed",
      },

      {
        id: 8,
        title: "Learn React",
        description: "Learn React",
        status: "Completed",
      },
      {
        id: 9,
        title: "Write React App",
        description: "Write React App",
        status: "Completed",
      },

      {
        id: 10,
        title: "Write React App",
        description: "Write React App",
        status: "Completed",
      },

      {
        id: 11,
        title: "Write React App",
        description: "Write React App",
        status: "Completed",
      },
      {
        id: 12,
        title: "Learn React",
        description: "Learn React",
        status: "Completed",
      },
    ],
  },
  {
    id: 3,
    title: "Learn Vue",
    description: "Learn Vue",
    status: "In Progress",
  },
];
