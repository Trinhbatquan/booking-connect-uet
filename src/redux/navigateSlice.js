import { createSlice } from "@reduxjs/toolkit";
// import { T_i18n } from "../containers/HomePage/HomeHeader";

const navigateInitialState = {
  navigate: [],
};

const navigateSlice = createSlice({
  name: "navigate",
  initialState: navigateInitialState,
  reducers: {
    setNavigate: (state, action) => {
      const arr = [action.payload];
      state.navigate = arr;
    },
  },
});

const { actions, reducer } = navigateSlice;
export const { setNavigate } = actions;
export default reducer;
