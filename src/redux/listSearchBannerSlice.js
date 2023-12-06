import { createSlice } from "@reduxjs/toolkit";
import { current } from "@reduxjs/toolkit";

const listSearchBannerInitial = {
    department: [],
    faculty: [],
    teacher: [],
    healthStudent: [],
};

const listSearchBannerSlice = createSlice({
    name: "listSearchBannerSlice",
    initialState: listSearchBannerInitial,
    reducers: {
        setListSearchDepartment: (state,action) => {
            return {
                ...current(state),
                department: action.payload
            };
        },
        setListSearchFaculty: (state,action) => {
            return {
                ...current(state),
                faculty: action.payload
            };
        },
        setListSearchTeacher: (state,action) => {
            return {
                ...current(state),
                teacher: action.payload
            };
        },
        setListSearchHealthStudent: (state,action) => {
            return {
                ...current(state),
                healthStudent: action.payload
            };
        },
    },
});

const { actions,reducer } = listSearchBannerSlice;
export const { setListSearchDepartment,setListSearchFaculty,setListSearchTeacher,setListSearchHealthStudent } = actions;
export default reducer;
