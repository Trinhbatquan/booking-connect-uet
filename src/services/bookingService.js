import axiosClient from "../axios";

//homepage
const createBookingScheduleService = {
  create: (params, data) => {
    const url = "/api/create-booking-schedule";
    return axiosClient.post(url, data, { params });
  },
};

const createQuestionService = {
  create: (params, data) => {
    const url = "/api/create-question";
    return axiosClient.post(url, data, { params });
  },
};

const getBookingSchedule = {
  get: (params) => {
    const url = "/api/get-booking-schedule";
    return axiosClient.get(url, { params });
  },
};

const getAllBookingStudentByIdAndAction = {
  get: (params) => {
    const url = "/api/get-all-booking-student";
    return axiosClient.get(url, { params });
  },
};

//system
const getAllBooking = {
  getByManagerAndAction: (params) => {
    const url = "/api/get-all-booking-system";
    return axiosClient.get(url, { params });
  },
};
const updateStatusBookingSchedule = {
  update: (params, data) => {
    const url = "/api/update-status-booking-schedule";
    return axiosClient.put(url, data, { params });
  },
};

export {
  createBookingScheduleService,
  getBookingSchedule,
  createQuestionService,
  getAllBooking,
  updateStatusBookingSchedule,
  getAllBookingStudentByIdAndAction,
};
