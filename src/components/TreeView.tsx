import { Children, useState } from "react";

interface TreeTabProps {
  children?: React.ReactNode;
  title: string;
  destroyTab: (title: string) => void;
}

const closeIcon = (
  <svg
    className="w-4 h-4 inline-block"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {" "}
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M6 18L18 6M6 6l12 12"
    />{" "}
  </svg>
);

function TreeTab({ children = [], title, destroyTab }: TreeTabProps) {
  const [isOpen, setIsOpen] = useState(true);

  const getIcon = (children: React.ReactNode) => {
    if (Children.count(children) <= 0) return;

    return (
      <svg
        className="w-4 h-4 inline-block"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
          clipRule="evenodd"
        />{" "}
      </svg>
    );
  };

  return (
    <>
      <div className="text-inherit w-full bg-red-800 flex relative px-2">
        <div className="flex flex-1 items-center py-2">
          <span
            className={`mr-2 ${!isOpen && "-rotate-90"}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {getIcon(children)}
          </span>
          <p className="text-sm font-bold line-clamp-1">{title}</p>
        </div>

        <div
          className="text-sm font-bold cursor-pointer flex items-center"
          onClick={() => destroyTab(title)}
        >
          {closeIcon}
        </div>
      </div>

      <div className={`ms-5 space-y-2 ${!isOpen && "hidden"}`}>{children}</div>
    </>
  );
}

type Tab = {
  title: string;
  children?: Tab[];
};

function TreeView() {
  const treeViewWidth = 300;
  const [tabs, setTabs] = useState<Tab[]>([
    { title: "1" },
    {
      title: "2",
      children: [
        { title: "2.1" },
        {
          title: "2.2",
          children: [
            { title: "2.2.1" },
            { title: "2.2.2 veeeeeeeery long text right here" },
          ],
        },
      ],
    },
    {
      title: "3",
    },
  ]);

  const removeTab = (tabs: Tab[], title: string) => {
    console.log("removeTab", title);
    console.log("tabs", tabs);
  };

  const renderTree = (tabs?: Tab[]) => {
    if (!tabs) return;

    return tabs.map((tab) => (
      <TreeTab
        key={tab.title}
        destroyTab={(title) => removeTab(tabs, title)}
        title={tab.title}
      >
        {renderTree(tab.children)}
      </TreeTab>
    ));
  };


  return (
    <>
      <div
        style={{ width: treeViewWidth }}
        className="bg-gray-800 overflow-y-auto text-gray-200 space-y-2 p-2"
      >
        {renderTree(tabs)}
      </div>
    </>
  );
}

export default TreeView;
