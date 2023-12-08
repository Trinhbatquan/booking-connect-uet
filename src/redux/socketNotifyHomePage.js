import { createSlice } from "@reduxjs/toolkit";
// import { T_i18n } from "../containers/HomePage/HomeHeader";
import { current } from "@reduxjs/toolkit";

const socketNotifyHomePageInitial = {
  countNewNotifyHomePage: 0,
  changeNotifyIcon: false,
  changeNotifyButton: false,
  pathNameOfNotifySeeAll: false,
  optionNotification: "",
};

const socketNotifyHomePage = createSlice({
  name: "newNotify",
  initialState: socketNotifyHomePageInitial,
  reducers: {
    setCountNewNotifyHomePage: (state, action) => {
      return {
        ...current(state),
        countNewNotifyHomePage: action.payload,
      };
    },
    setChangeNotifyIcon: (state, action) => {
      return {
        ...current(state),
        changeNotifyIcon: action.payload,
      };
    },
    setChangeNotifyButton: (state, action) => {
      return {
        ...current(state),
        changeNotifyButton: action.payload,
      };
    },
    setPathNameOfNotifySeeAll: (state, action) => {
      return {
        ...current(state),
        pathNameOfNotifySeeAll: action.payload,
      };
    },
    setOptionNotification: (state, action) => {
      return {
        ...current(state),
        optionNotification: action.payload,
      };
    },
  },
});

const { actions, reducer } = socketNotifyHomePage;
export const {
  setCountNewNotifyHomePage,
  setChangeNotifyIcon,
  setChangeNotifyButton,
  setPathNameOfNotifySeeAll,
  setOptionNotification,
} = actions;
export default reducer;