import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "@store/reducer";
import apiMiddleware from "@store/middleware/api";

export default function store() {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), apiMiddleware]
  });

  return store;
}
