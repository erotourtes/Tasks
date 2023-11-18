import "./App.css";
import TreeView from "./components/TreeView";

function App() {
  return (
    <>
      <div className="flex h-screen">
        <TreeView />

        <div className="flex-1 overflow-y-auto">
          <div className="bg-yellow-800 h-screen"></div>
        </div>
      </div>
    </>
  );
}

export default App;
