import { CustomTask } from "@types";

export const generateId = () => Math.random().toString(36).substring(2, 12);

export const changeOnEvent = (
  setter: (val: string) => void,
  callback?: (val: string) => void,
) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setter(value);
    if (callback) callback(value);
  };
};

export const createBlankTask = (): CustomTask => ({
  title: "",
  status: "todo",
  description: "",
  createdAt: new Date().toISOString().slice(0, 10),
  subtasks: [],
  tags: [],
  removed: false,
});
