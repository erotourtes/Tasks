import "./App.css";
import TreeView from "./components/TreeView";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import createStore from "@store/createStore";
import { Provider } from "react-redux";
import { getTasks } from "./store/taskSlice";
import MainScreen from "./components/MainScreen";

const store = createStore();

function App() {
  store.dispatch(getTasks());

  return (
    <>
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <div className="flex h-screen">
            <TreeView />

            <div className="flex-1 overflow-y-auto">
              <MainScreen />
            </div>
          </div>
        </DndProvider>
      </Provider>
    </>
  );
}

export default App;
