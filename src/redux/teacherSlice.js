import { createSlice } from "@reduxjs/toolkit";

const teacherInitialState = {
  searchTeacher: "",
  teacherData: [],
  descriptionTeacher: [],
};

const teacherSlice = createSlice({
  name: "teacher",
  initialState: teacherInitialState,
  reducers: {},
});

const { actions, reducer } = teacherSlice;
export const {} = actions;
export default reducer;
