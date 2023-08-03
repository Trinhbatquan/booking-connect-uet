import axiosClient from "../axios";

const createBookingScheduleService = {
  create: (params, data) => {
    const url = "/api/create-booking-schedule";
    return axiosClient.post(url, data, { params });
  },
};

const getBookingSchedule = {
  get: (params) => {
    const url = "/api/get-booking-schedule";
    return axiosClient.get(url, { params });
  },
};

export { createBookingScheduleService, getBookingSchedule };
