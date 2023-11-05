import axiosClient from "../axios";

//getTenTeacher
const getTeacherHomePageAPI = {
  getTeacher: (params) => {
    const url = "/api/teacher";
    return axiosClient.get(url, { params });
  },
  getTeacherHomePage: (params) => {
    const url = "/api/teacher_homepage";
    return axiosClient.get(url, { params });
  },
  getTeacherBySearch: (params) => {
    const url = "/api/teacher_by_search";
    return axiosClient.get(url, { params });
  },
  getTeacherById: (params) => {
    const url = "/api/one-teacher";
    return axiosClient.get(url, { params });
  },
};

//system
//create teacher info
const createTeacherInfo = {
  create: (params, data) => {
    const url = "/api/create-teacher_info";
    return axiosClient.post(url, data, { params });
  },
};

//get teacher info by id
const getTeacherInfo = {
  getById: (params) => {
    const url = "/api/get-teacher_info";
    return axiosClient.get(url, { params });
  },
};

const getTeacherFaculty = {
  get: (params) => {
    const url = "/api/teacher/by-faculty";
    return axiosClient.get(url, { params });
  },
};

export {
  getTeacherHomePageAPI,
  createTeacherInfo,
  getTeacherInfo,
  getTeacherFaculty,
};
