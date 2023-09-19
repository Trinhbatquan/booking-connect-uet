import axiosClient from "../axios";

//system
//create schedule
const createSchedule = {
  create: (params, data) => {
    const url = "/api/create-schedule";
    return axiosClient.post(url, data, { params });
  },
};
const getScheduleSystem = {
  get: (params) => {
    const url = "/api/get-schedule-system";
    return axiosClient.get(url, { params });
  },
};

const deleteScheduleByIdAndDate = {
  delete: (params, data) => {
    const url = "/api/delete-schedule";
    return axiosClient.post(url, data, { params });
  },
};

//homepage
//get schedule
const getScheduleByIdAndDate = {
  get: (params) => {
    const url = "/api/get-schedule";
    return axiosClient.get(url, { params });
  },
};

export {
  createSchedule,
  getScheduleByIdAndDate,
  getScheduleSystem,
  deleteScheduleByIdAndDate,
};
