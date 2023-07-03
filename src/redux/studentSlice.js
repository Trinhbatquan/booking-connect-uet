import { createSlice } from "@reduxjs/toolkit";

const studentLocalStorage = JSON.parse(
  localStorage.getItem("auth-bookingCare-UET_student")
);

const studentInitialState = studentLocalStorage || {
  isLogin: false,
  role: null,
  email: null,
  fullName: null,
};

const studentSlice = createSlice({
  name: "studentSlice",
  initialState: studentInitialState,
  reducers: {
    loginUserSucceed: (state, action) => {
      state.isLogin = true;
      state.role = action.payload.roleId;
      state.fullName = action.payload.fullName;
      state.email = action.payload.email;
      localStorage.setItem(
        "auth-bookingCare-UET_student",
        JSON.stringify(state)
      );
    },
    loginUserFailed: (state, action) => {
      state.isLogin = false;
      state.role = null;
      state.fullName = null;
      state.email = null;
      localStorage.removeItem("auth-bookingCare-UET_student");
    },
    logOutUser: (state, action) => {
      state.isLogin = false;
      state.role = null;
      state.fullName = null;
      state.email = null;
      localStorage.removeItem("auth-bookingCare-UET_student");
    },
  },
});

const { actions, reducer } = studentSlice;
export const { logOutUser, loginUserFailed, loginUserSucceed } = actions;
export default reducer;
