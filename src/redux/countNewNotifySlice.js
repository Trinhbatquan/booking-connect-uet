import { createSlice } from "@reduxjs/toolkit";
// import { T_i18n } from "../containers/HomePage/HomeHeader";
import { current } from "@reduxjs/toolkit";

const countNewNotifyInitialState = {
  countNewNotifyHomePage: 0,
  countNewNotifyManager: 0,
};

const countNewNotifySlice = createSlice({
  name: "newNotify",
  initialState: countNewNotifyInitialState,
  reducers: {
    setCountNewNotifyHomePage: (state, action) => {
      return {
        ...current(state),
        countNewNotifyHomePage: action.payload,
      };
    },
    setCountNewNotifyManager: (state, action) => {
      return {
        ...current(state),
        countNewNotifyManager: action.payload,
      };
    },
  },
});

const { actions, reducer } = countNewNotifySlice;
export const { setCountNewNotifyHomePage, setCountNewNotifyManager } = actions;
export default reducer;
