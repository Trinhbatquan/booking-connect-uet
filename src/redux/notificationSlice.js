import { createSlice } from "@reduxjs/toolkit";
import { current } from "@reduxjs/toolkit";

const notificationInit = {
  notify: [],
  pageCurrent: 0,
  pageTotal: 0,
};

const notificationSlice = createSlice({
  name: "notificationSlice",
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

const { actions, reducer } = notificationSlice;
export const { getAllNotify } = actions;
export default reducer;
