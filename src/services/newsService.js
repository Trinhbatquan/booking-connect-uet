import axiosClient from "../axios";

const news = {
  create: (params, data) => {
    const url = "/api/create-news";
    return axiosClient.post(url, data, { params });
  },
  update: (params, data) => {
    const url = "/api/update-news";
    return axiosClient.put(url, data, { params });
  },
  delete: (params) => {
    const url = "/api/delete-news";
    return axiosClient.delete(url, { params });
  },
  get: (params) => {
    const url = "/api/get-news";
    return axiosClient.get(url, { params });
  },
  get_limited: (params) => {
    const url = "/api/get-news-limited";
    return axiosClient.get(url, { params });
  },
  getOneNews: (params) => {
    const url = "/api/one-news";
    return axiosClient.get(url, { params });
  },
};

export { news };
