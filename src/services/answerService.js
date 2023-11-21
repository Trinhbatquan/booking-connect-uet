import axiosClient from "../axios";

const getAnswerById = (params) => {
  const url = "/api/get-answer-by-id";
  return axiosClient.get(url, { params });
};

export { getAnswerById };
