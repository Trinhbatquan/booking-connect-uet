import axiosClient from "../axios";

const getPreviousFeedback = (params) => {
  const url = "/api/previous-feedback";
  return axiosClient.get(url, { params });
};

const saveFeedback = (params, data) => {
  const url = "/api/save-feedback";
  return axiosClient.post(url, data, { params });
};

const getFeedback = (params) => {
  const url = "/api/get-feedback";
  return axiosClient.get(url, { params });
};

export { getPreviousFeedback, saveFeedback, getFeedback };
