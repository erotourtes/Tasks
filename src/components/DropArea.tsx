export default function DropArea({ isOver }: { isOver: boolean }) {
  return (
    <>
      {isOver && (
        <div
          className={`z-100 border-2 rounded-xl border-dashed border-zinc-200 absolute top-5 left-5 bottom-5 right-5 flex items-center justify-center dark:text-zinc-200 text-3xl dark:bg-dark-drop`}
        >
          Drop here
        </div>
      )}
    </>
  );
}
