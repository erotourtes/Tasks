import { CloseIcon, ArrowIcon } from "../assets/icons.tsx";
import { Tab } from "../utils/types.ts";

interface TreeTabProps {
  tab: Tab;
  destroyTab: () => void;
  toggleOpen: () => void;
}

const howeverText = `
  dark:hover:bg-zinc-700 dark:hover:text-zinc-50
  hover:bg-zinc-300 hover:text-zinc-800
`;

function TreeTab({ tab, destroyTab, toggleOpen }: TreeTabProps) {
  const isParent = tab.children.length > 0;
  const { title, level, isOpen } = tab;
  return (
    <>
      <div className="text-inherit w-full flex px-2">
        <div
          style={{ marginLeft: level * 20 }}
          className={`flex flex-1 relative items-center py-2 rounded-lg ${howeverText}`}
        >
          <span
            className={`mr-2 ${!isOpen && "-rotate-90"}`}
            onClick={toggleOpen}
          >
            {isParent && <ArrowIcon className="w-4 h-4" />}
          </span>
          <p className="text-sm font-bold line-clamp-1">{title}</p>

          <div
            className={`text-sm font-bold cursor-pointer flex items-center absolute right-2 top-1/2 transform -translate-y-1/2 ${howeverText}`}
            onClick={destroyTab}
          >
            <CloseIcon className="w-4 h-4 text-inherit" />
          </div>
        </div>
      </div>
    </>
  );
}

export default TreeTab;
