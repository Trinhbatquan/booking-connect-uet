import axiosClient from "../axios";

//create schedule
const createSchedule = {
  create: (params, data) => {
    const url = "/api/create-schedule";
    return axiosClient.post(url, data, { params });
  },
};

//get schedule
const getScheduleByIdAndDate = {
  get: (params) => {
    const url = "/api/get-schedule";
    return axiosClient.get(url, { params });
  },
};

export { createSchedule, getScheduleByIdAndDate };
