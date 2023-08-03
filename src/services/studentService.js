import axiosClient from "../axios";

//getTenTeacher
const updateStudent = {
  update: (params, data) => {
    const url = "/api/update-student";
    return axiosClient.put(url, data, { params });
  },
  //   getTeacherById: (params) => {
  //     const url = "/api/one-teacher";
  //     return axiosClient.get(url, { params });
  //   },
};

export { updateStudent };
