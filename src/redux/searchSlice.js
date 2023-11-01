import { createSlice } from "@reduxjs/toolkit";
import { current } from "@reduxjs/toolkit";

const searchInitial = {
  search: "",
};

const searchSlice = createSlice({
  name: "searchSlice",
  initialState: searchInitial,
  reducers: {
    setSearchText: (state, action) => {
      return {
        search: action.payload,
      };
    },
  },
});

const { actions, reducer } = searchSlice;
export const { setSearchText } = actions;
export default reducer;
