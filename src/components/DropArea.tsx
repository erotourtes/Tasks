export default function DropArea({ isOver }: { isOver: boolean }) {
  return (
    <>
      {isOver && (
        <div
          style={{
            left: 300 + 5, // TODO: use redux to save width of the treeview
          }}
          className={`z-100 border-2 rounded-xl border-dashed border-zinc-700 dark:border-zinc-200 fixed top-5 bottom-5 right-5 flex items-center justify-center dark:text-zinc-200 text-3xl dark:bg-dark-drop bg-light-drop`}
        >
          Drop here
        </div>
      )}
    </>
  );
}
