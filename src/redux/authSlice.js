import { createSlice } from "@reduxjs/toolkit";

const authLocalStorage = JSON.parse(
  localStorage.getItem("auth-bookingCare-UET_system")
);

const authInitialState = authLocalStorage || {
  isLogin: false,
  role: null,
  email: null,
  fullName: null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState: authInitialState,
  reducers: {
    loginUserSucceed: (state, action) => {
      state.isLogin = true;
      state.role = action.payload.roleId;
      state.email = action.payload.email;
      state.fullName = action.payload.fullName;
      localStorage.setItem(
        "auth-bookingCare-UET_system",
        JSON.stringify(state)
      );
    },
    loginUserFailed: (state, action) => {
      state.isLogin = false;
      state.role = null;
      state.email = null;
      state.fullName = null;
      localStorage.removeItem("auth-bookingCare-UET_system");
    },
    logOutUser: (state, action) => {
      state.isLogin = false;
      state.role = null;
      state.email = null;
      state.fullName = null;
      localStorage.removeItem("auth-bookingCare-UET_system");
    },
  },
});

const { actions, reducer } = authSlice;
export const { logOutUser, loginUserFailed, loginUserSucceed } = actions;
export default reducer;
