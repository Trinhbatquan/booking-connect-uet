import { createSlice } from "@reduxjs/toolkit";
import { current } from "@reduxjs/toolkit";

const notificationInit = {
  notify: [],
};

const notificationSlice = createSlice({
  name: "notificationSlice",
  initialState: notificationInit,
  reducers: {
    getAllNotify: (state, action) => {
      return {
        ...current(state),
        notify: action.payload,
      };
    },
  },
});

const { actions, reducer } = notificationSlice;
export const { getAllNotify } = actions;
export default reducer;
