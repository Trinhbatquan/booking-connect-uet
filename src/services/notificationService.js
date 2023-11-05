import axiosClient from "../axios";

//getNotiFY
const getNotiFy = {
  get: (params) => {
    const url = "/api/notification";
    return axiosClient.get(url, { params });
  },
  getAllCount: (params) => {
    const url = "/api/all_notify_by_type";
    return axiosClient.get(url, { params });
  },
  getHomePageLimited: (params) => {
    const url = "/api/get-notification-homePage-limited";
    return axiosClient.get(url, { params });
  },
  getOneNotifyHomePage: (params) => {
    const url = "/api/get-one-notify";
    return axiosClient.get(url, { params });
  },
};

const createNotifySystem = (params, data) => {
  const url = "/api/create_notify_system";
  return axiosClient.post(url, data, { params });
};

const updateNotifySystem = (params, data) => {
  const url = "/api/update_notify_system";
  return axiosClient.put(url, data, { params });
};

const deleteNotifySystem = (params) => {
  const url = "/api/delete_notify_system";
  return axiosClient.delete(url, { params });
};

export {
  getNotiFy,
  createNotifySystem,
  updateNotifySystem,
  deleteNotifySystem,
};
