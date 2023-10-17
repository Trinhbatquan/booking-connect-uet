import { createSlice } from "@reduxjs/toolkit";
import { current } from "@reduxjs/toolkit";

const notificationInit = {
  notify: [],
  pageCurrent: 0,
  pageTotal: 0,
};

const notificationManagerSlice = createSlice({
  name: "notificationManagerSlice",
  initialState: notificationInit,
  reducers: {
    getAllNotify: (state, action) => {
      return {
        ...current(state),
        notify: action.payload.notify,
        pageCurrent: action.payload.pageCurrent,
        pageTotal: action.payload.pageTotal,
      };
    },
  },
});

const { actions, reducer } = notificationManagerSlice;
export const { getAllNotify } = actions;
export default reducer;
