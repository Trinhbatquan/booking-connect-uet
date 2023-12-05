import { createSlice } from "@reduxjs/toolkit";
// import { T_i18n } from "../containers/HomePage/HomeHeader";
import { current } from "@reduxjs/toolkit";

const socketNotifyManagerInitial = {
  countNewNotifyManager: 0,
  changeNotifyIcon: false,
  changeNotifyButton: false,
  pathNameOfNotifySeeAll: false,
  optionNotification: "",
};

const socketNotifyManager = createSlice({
  name: "newNotifyManager",
  initialState: socketNotifyManagerInitial,
  reducers: {
    setCountNewNotifyManager: (state, action) => {
      return {
        ...current(state),
        countNewNotifyManager: action.payload,
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

const { actions, reducer } = socketNotifyManager;
export const {
  setCountNewNotifyManager,
  setChangeNotifyIcon,
  setChangeNotifyButton,
  setPathNameOfNotifySeeAll,
  setOptionNotification,
} = actions;
export default reducer;
