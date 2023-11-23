import { ApiPayload, StoreState } from "@/utils/types";
import { Middleware } from "@reduxjs/toolkit";
import { apiError, apiStart } from "@store/apiActions";
import { dummyTasks } from "@dummies/dummyTasks";

const apiMiddleware: Middleware<object, StoreState> =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (action.type !== apiStart.type) return next(action);

    const { url, method, data, onStart, onSuccess, onError } =
      action.payload as ApiPayload;

    if (onStart) dispatch({ type: onStart });
    next(action);

    // TODO: remove baseURL
    const baseURL = "http://localhost:3000";
    const fullURL = baseURL + url;

    // TODO: fetch data from server
    const fetch = async (
      url: string,
      { method, body }: { method: string; body?: object },
    ) => {
      const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      await sleep(1000);
      if (method === "GET" && url === baseURL + "/tasks")
        return { json: () => ({ success: true, body: dummyTasks}) };
      if (method === "PUT" && url.search(baseURL + "/tasks") !== -1 && body)
        return { json: () => ({ success: true, body: data }) };

      throw new Error("Error fetching data");
    };

    const json = await fetch(fullURL, { method, body: data })
      .then((data) => data.json())
      .catch((err) => {
        const payload = { err: err.message };
        if (onError) dispatch({ type: onError, payload });
        else dispatch({ type: apiError.type, payload });
      });

    if (!json) return;
    dispatch({ type: onSuccess, payload: json.body });
  };

export default apiMiddleware;
