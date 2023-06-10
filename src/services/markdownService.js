import axiosClient from "../axios";

//getTenTeacher
const createMarkDown = {
  create: (params, data) => {
    const url = "/api/create-markdown";
    return axiosClient.post(url, data, { params });
  },
};

const getMarkDown = {
  getById: (params) => {
    const url = "/api/get-markdown";
    return axiosClient.get(url,{ params });
  }
}

export {
  createMarkDown,
  getMarkDown
}