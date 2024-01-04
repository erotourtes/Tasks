import { ApiPayload } from "@/utils/types";
import { createAction } from "@reduxjs/toolkit";

export const apiStart = createAction<ApiPayload>("api/start");
export const apiEnd = createAction("api/end");
export const apiError = createAction("api/error");
export const apiInstantSuccess = createAction("api/instantSuccess");
