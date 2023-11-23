import { ApiAction } from "@/utils/types";
import { createAction } from "@reduxjs/toolkit";

export const apiStart = createAction<ApiAction>("api/start");
export const apiEnd = createAction("api/end");
export const apiError = createAction("api/error");
