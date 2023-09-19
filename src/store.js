import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./redux/authSlice";
import teacherReducer from "./redux/teacherSlice";
import navigateReducer from "./redux/navigateSlice";
import studentReducer from "./redux/studentSlice";
import notificationReducer from "./redux/notificationSlice";

const store = configureStore({
  reducer: {
    authReducer,
    teacherReducer,
    navigateReducer,
    studentReducer,
    notificationReducer,
  },
});

export default store;
