import "./App.css";
import Movable from "./components/Movable";
import TreeView from "./components/TreeView";

function App() {
  return (
    <>
      <div className="flex h-screen">
        <TreeView />

        <div className="flex-1 overflow-y-auto">
          <Movable />
        </div>
      </div>
    </>
  );
}

export default App;
