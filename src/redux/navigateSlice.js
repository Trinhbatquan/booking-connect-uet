import { createSlice } from "@reduxjs/toolkit";
// import { T_i18n } from "../containers/HomePage/HomeHeader";

const navigateLocal = JSON.parse(localStorage.getItem("navigate-booking-care"));
const navigateInitialState = {
  navigate: navigateLocal || [],
};

const navigateSlice = createSlice({
  name: "navigate",
  initialState: navigateInitialState,
  reducers: {
    setNavigate: (state, action) => {
      const arr = [action.payload];
      state.navigate = arr;
      localStorage.setItem("navigate-booking-care", JSON.stringify(arr));
    },
  },
});

const { actions, reducer } = navigateSlice;
export const { setNavigate } = actions;
export default reducer;
