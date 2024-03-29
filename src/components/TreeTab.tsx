import { useDrag, useDrop } from "react-dnd";
import LinkIcon, { CloseIcon, ArrowIcon } from "../assets/icons";
import {
  DragTypes,
  MoveType,
  TabDragItem,
  Task,
  TaskUIInfo,
} from "../utils/types.ts";
import { TabNode } from "../utils/TabsMethods.ts";

interface TreeTabProps {
  tab: TabNode<Task>;
  destroyTab: () => void;
  toggleLock: () => void;
  toggleOpen: () => void;
  moveTab: (to: string, type: MoveType) => void;
  children?: React.ReactNode;
  uiInfo?: TaskUIInfo;
}

const howeverText = `
  dark:hover:bg-zinc-700 dark:hover:text-zinc-50
  hover:bg-zinc-300 hover:text-zinc-800
`;

function DevideLine({
  moveTab,
  moveType = "after",
}: {
  tab: TabNode<Task>;
  moveTab: (to: string, type: MoveType) => void;
  moveType?: MoveType;
}) {
  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: DragTypes.TAB,
      drop: (item: TabDragItem) => {
        // tab - that is dropped on
        // item - that is dragged
        moveTab(item.id, moveType);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [moveTab],
  );

  return (
    <div
      ref={dropRef}
      className={`h-1 w-full rounded-lg ${
        isOver ? "dark:bg-zinc-200 bg-zinc-800" : "bg-transparent"
      }`}
    ></div>
  );
}

const Spinner = () => {
  return (
    <div className="animate-spin rounded-full w-3 h-3 border-t-2 border-zinc-500 border-t-zinc-700 dark:border-zinc-200"></div>
  );
};

function TreeTab({
  children,
  tab,
  destroyTab,
  toggleLock,
  toggleOpen,
  moveTab,
  uiInfo,
}: TreeTabProps) {
  const { isOpen } = tab.state;
  const task = tab.getForeign();

  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: DragTypes.TAB,
      item: { id: tab.id, tab },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [tab],
  );

  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: DragTypes.TAB,
      drop: (item: TabDragItem) => {
        // item is the dragged tab
        const dstTab = item.id;

        moveTab(dstTab, "inside");
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [moveTab],
  );

  return (
    <>
      {tab.isFirst() && (
        <DevideLine tab={tab} moveTab={moveTab} moveType={"firstChild"} />
      )}

      <div
        style={{ height: "38px" }} // TODO: chnage this
        ref={(node) => dragRef(dropRef(node))}
        className={`text-inherit w-full flex ${isDragging && "opacity-50"}`}
      >
        <div
          className={`flex box-border flex-1 relative items-center py-2 rounded-lg ${howeverText} 
            border overflow-x-hidden
            ${
              isOver
                ? "dark:border-zinc-200 border-zinc-800"
                : "border-transparent"
            }
            ${uiInfo?.status === "loading" && "animate-pulse"}
            ${task.status === "done" && "opacity-50 line-through"}
`}
        >
          <span className={`${!isOpen && "-rotate-90"}`} onClick={toggleOpen}>
            {tab.hasChildren && <ArrowIcon className="w-4 h-4" />}
          </span>
          <div className="pr-2">
            {uiInfo?.status === "loading" && <Spinner />}
            {uiInfo?.status === "failed" && (
              <span className="text-red-500">!</span>
            )}
          </div>
          <p className="text-sm font-bold line-clamp-1">{`${task.title}`}</p>

          <div
            className={`text-sm font-bold cursor-pointer flex items-center absolute right-2 top-1/2 transform -translate-y-1/2 ${howeverText}`}
          >
            {task.subtasks.length > 0 && (
              <div onClick={toggleLock}>
                <LinkIcon
                  isLinked={uiInfo?.isLocked}
                  className="w-3 h-3 mr-2"
                />
              </div>
            )}
            <div onClick={destroyTab}>
              <CloseIcon className="w-4 h-4 text-inherit" />
            </div>
          </div>
        </div>
      </div>

      {isOpen && <div className="ml-8">{children}</div>}

      <DevideLine tab={tab} moveTab={moveTab} />
    </>
  );
}

export default TreeTab;
