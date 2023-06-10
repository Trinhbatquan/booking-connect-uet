import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_URL_API,
  withCredentials: true,
  headers: {
    "content-type": "application/json",
    // "Access-Control-Allow-Origin": "*",
  },
  // paramsSerializer: (params) => queryString.stringify(params),
  paramsSerializer: {
    indexes: false, // empty brackets like `arrayOfUserIds[]`
  },
  // paramsSerializer: {
  //   serialize: stringify
  // }
});
// nhận phương thức (get, post, delete,... + baseUrl + param dạng obj )
// xử lý requests => tạo https request lên server bằng axios
//có dữ liệu, qua responses => return về data

axiosClient.interceptors.request.use(async (config) => {
  return config;
});
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle errors
    const { response } = error;
    if (response == null) {
      return null;
    }
    const { data } = response;
    return data;
  }
);
export default axiosClient;
