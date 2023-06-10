import { createSlice } from "@reduxjs/toolkit";


const teacherInitialState = {
    topTenTeachers: []
  };


const teacherSlice = createSlice({
  name: "teacher",
  initialState: teacherInitialState,
  reducers: {
    getTopTenTeacherSucceed: (state, action) => {
      state.topTenTeachers = action.payload;
    },
    getTopTenTeacherFailed: (state, action) => {
      state.topTenTeachers = [];
    },
  },
});

const { actions, reducer } = teacherSlice;
export const {getTopTenTeacherFailed, getTopTenTeacherSucceed } = actions;
export default reducer;
