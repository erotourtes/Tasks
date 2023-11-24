import { MoveType, StoreState, Task,TaskUIState } from "../utils/types.ts";
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

  const str = new Tabs(tasks, uiTasks);

  const markAsDone = (task: Task) =>
    actions.markTaskAsDoneInstantly(dispatch, task);

  const craeteTask = () =>
    actions.addTaskInstantly(dispatch, createBlankTask());

 const toggleOpen = (task: Task) => {
    const taskUI = uiTasks[task.id];
    const isOppened = taskUI?.isOpened;
    dispatch(uiActions.setOppened({ taskID: task.id, isOpened: !isOppened  }));
  };

  const moveTab = (srcIndex: string, dstIndex: string, type: MoveType) => {
    const moveActions: {
      [key in MoveType]: (srcIndex: string, dstIndex: string) => Tabs<Task>;
    } = {
      inside: str.moveInside.bind(str),
      after: str.moveAfter.bind(str),
      firstChild: str.moveAtBeginning.bind(str),
    };

    const synced = moveActions[type](srcIndex, dstIndex).syncForeignData();

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
          moveTab={(srcID, type) => moveTab(srcID, tab.id, type)}
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
          className="dark:hover:bg-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 px-2 py-2 w-full rounded-lg border dark:border-zinc-700 border-zinc-300"
          onClick={craeteTask}
        >
          Add Task
        </button>
      </div>
    </>
  );
}

export default TreeView;
