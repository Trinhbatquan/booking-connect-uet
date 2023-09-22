import axiosClient from "../axios";

//getNotiFY
const getDashboardByUserAndTime = {
  get: (params) => {
    const url = "/api/dashboard/getDashboard-booking-data-by-user-time";
    return axiosClient.get(url, { params });
  },
};

const getDashboardByMonths = {
  get: (params) => {
    const url = "/api/dashboard/getDashboard-booking-by-months";
    return axiosClient.get(url, { params });
  },
};

export { getDashboardByUserAndTime, getDashboardByMonths };
