import axiosClient from "../axios";

//getNotiFY
const getNotiFy = {
  get: (params) => {
    const url = "/api/notification";
    return axiosClient.get(url, { params });
  },
};

export { getNotiFy };
