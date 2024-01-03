import {
  MoveType,
  StoreState,
  Task,
  TaskID,
  TaskUIState,
} from "../utils/types.ts";
import { Tabs } from "../utils/TabsMethods.ts";
import TreeTab from "./TreeTab.tsx";
import { TabNode } from "../utils/TabsMethods.ts";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "@/store/taskSlice.ts";
import * as uiActions from "@/store/taskUISlice.ts";
import { createBlankTask } from "@/utils/utils.ts";

function TreeView() {
  const treeViewWidth = 300;

  const dispatch = useDispatch();
  const uiTasks = useSelector<StoreState, TaskUIState>(
    (state) => state.ui.taskUI.taskUIInfo,
  );
  const tasks = useSelector<StoreState, Task[]>(
    (state) => state.entities.task.tasks,
  );
  const loading = useSelector<StoreState, boolean>(
    (state) => state.entities.task.loading,
  );

  const str = new Tabs(tasks, uiTasks);

  const notFromServer = (taskID: TaskID) => taskID.startsWith("CUSTOM_ID");

  const markAsDone = (task: Task) => {
    if (notFromServer(task.id)) return;
    const isLocked = uiTasks[task.id]?.isLocked;
    if (isLocked) actions.markTaskAsDoneRecInstantly(dispatch, task, tasks);
    else actions.markTaskAsDoneInstantly(dispatch, task);
  };

  const craeteTask = () =>
    actions.addTaskInstantly(dispatch, createBlankTask());

  const toggleOpen = (task: Task) => {
    if (notFromServer(task.id)) return;
    const taskUI = uiTasks[task.id];
    const isOppened = taskUI?.isOpened;
    dispatch(uiActions.setOppened({ taskID: task.id, isOpened: !isOppened }));
  };

  const toggleLock = (task: Task) => {
    if (notFromServer(task.id)) return;
    const taskUI = uiTasks[task.id];
    const isLocked = taskUI?.isLocked;
    dispatch(uiActions.setLocked({ taskID: task.id, isLocked: !isLocked }));
  };

  const moveTab = (srcIndex: string, dstIndex: string, type: MoveType) => {
    const f1 = str.getForeign(srcIndex);
    const f2 = str.getForeign(dstIndex);
    if (notFromServer(f1.id) || notFromServer(f2.id)) return;
    const synced = str.moveForeign(srcIndex, dstIndex, type).syncForeignData();

    dispatch(actions.setTasks(synced));
  };

  const renderTabs = (tabs?: TabNode<Task>[]) => {
    return tabs?.map((tab) => {
      const task = tab.getForeign();
      return (
        <TreeTab
          key={tab.id}
          tab={tab}
          destroyTab={() => markAsDone(task)}
          toggleOpen={() => toggleOpen(task)}
          toggleLock={() => toggleLock(task)}
          moveTab={(srcID, type) => moveTab(srcID, tab.id, type)}
          uiInfo={uiTasks[task.id]}
        >
          {(tab.isOpen || !tab.hasChildren) && renderTabs(tab.__children)}
        </TreeTab>
      );
    });
  };

  return (
    <>
      <div
        style={{ width: treeViewWidth }}
        className="dark:bg-zinc-950 dark:text-zinc-200 overflow-y-auto p-2"
      >
        {renderTabs(str.flatRoot)}

        <button
          className={`dark:hover:bg-zinc-700 hover:bg-zinc-300 px-2 py-2 w-full rounded-lg border dark:border-zinc-700 border-zinc-300 ${
            loading
              ? "dark:text-orange-300 text-orange-700"
              : "dark:text-zinc-200"
          }`}
          disabled={loading}
          onClick={craeteTask}
        >
          Add Task
        </button>
      </div>
    </>
  );
}

export default TreeView;
