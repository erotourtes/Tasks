import "./App.css";
import Movable from "./components/Movable";
import TreeView from "./components/TreeView";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="flex h-screen">
          <TreeView />

          <div className="flex-1 overflow-y-auto">
            <Movable />
          </div>
        </div>
      </DndProvider>
    </>
  );
}

export default App;
