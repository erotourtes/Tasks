import "./App.css";
import Movable from "./components/Movable";
import TreeView from "./components/TreeView";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import createStore from "@store/createStore";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { getTasks } from "./store/taskSlice";

const store = createStore();

// TODO: remove this hack
let isFirst = true;

function App() {
  useEffect(() => {
    if (isFirst) {
      isFirst = false;
      return;
    }
    store.dispatch(getTasks())
  }, []);

  return (
    <>
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <div className="flex h-screen">
            <TreeView />

            <div className="flex-1 overflow-y-auto">
              <Movable />
            </div>
          </div>
        </DndProvider>
      </Provider>
    </>
  );
}

export default App;
