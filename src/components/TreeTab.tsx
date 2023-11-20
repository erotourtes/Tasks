import { useDrag, useDrop } from "react-dnd";
import { CloseIcon, ArrowIcon } from "../assets/icons";
import { DragTypes, MoveType, TabDragItem } from "../utils/types.ts";
import { TabNode } from "../utils/TabsMethods.ts";

interface TreeTabProps {
  tab: TabNode;
  destroyTab: () => void;
  toggleOpen: () => void;
  moveTab: (to: string, type: MoveType) => void;
  children?: React.ReactNode;
}

const howeverText = `
  dark:hover:bg-zinc-700 dark:hover:text-zinc-50
  hover:bg-zinc-300 hover:text-zinc-800
`;

function DevideLine({
  tab,
  moveTab,
  moveType = "after",
}: {
  tab: TabNode;
  moveTab: (to: string, type: MoveType) => void;
  moveType?: MoveType 
}) {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: DragTypes.TAB,
    drop: (item: TabDragItem, monitor) => {
      // tab - that is dropped on
      // item - that is dragged
      moveTab(item.id, moveType);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={dropRef}
      className={`h-1 w-full rounded-lg ${
        isOver ? "dark:bg-zinc-200 bg-zinc-800" : "bg-transparent"
      }`}
    ></div>
  );
}

function TreeTab({
  children,
  tab,
  destroyTab,
  toggleOpen,
  moveTab,
}: TreeTabProps) {
  const { title, level, isOpen } = tab.state;

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
      drop: (item: TabDragItem, monitor) => {
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
      {tab.isFirst() && <DevideLine tab={tab} moveTab={moveTab} moveType={"firstChild"} />}

      <div
        ref={(node) => dragRef(dropRef(node))}
        className={`text-inherit w-full flex ${isDragging && "opacity-50"}`}
      >
        <div
          className={`flex box-border flex-1 relative items-center py-2 rounded-lg ${howeverText} 
            border
            ${
              isOver
                ? "dark:border-zinc-200 border-zinc-800"
                : "border-transparent"
            }
`}
        >
          <span
            className={`mr-2 ${!isOpen && "-rotate-90"}`}
            onClick={toggleOpen}
          >
            {tab.hasChildren && <ArrowIcon className="w-4 h-4" />}
          </span>
          <p className="text-sm font-bold line-clamp-1">
            {/* title */ level + "     " + title}
          </p>

          <div
            className={`text-sm font-bold cursor-pointer flex items-center absolute right-2 top-1/2 transform -translate-y-1/2 ${howeverText}`}
            onClick={destroyTab}
          >
            <CloseIcon className="w-4 h-4 text-inherit" />
          </div>
        </div>
      </div>

      {isOpen && <div className="ml-8">{children}</div>}

      <DevideLine tab={tab} moveTab={moveTab} />
    </>
  );
}

export default TreeTab;
