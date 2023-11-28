import axiosClient from "../axios";

//login system
const loginApi = {
  loginUser: (params, data) => {
    const url = "/api/system/login";
    return axiosClient.post(url, data, { params });
  },
  forgot: (params) => {
    const url = "/api/system/forgot-pass";
    return axiosClient.get(url, { params });
  },
  updatePass_forgot: (params, data) => {
    const url = "/api/system/update-pass-forgot";
    return axiosClient.post(url, data, { params });
  },
};

const updatePasswordSystem = (params, data) => {
  const url = "/api/update-password-system";
  return axiosClient.put(url, data, { params });
};

const logOutApi = {
  logoutUser: (params) => {
    const url = "/api/system/logout";
    return axiosClient.get(url, { params });
  },
};

//login homepage
const loginHomePageApi = {
  loginUser: (params, data) => {
    const url = "/api/homepage/login";
    return axiosClient.post(url, data, { params });
  },
  registerUser: (params, data) => {
    const url = "/api/homepage/register";
    return axiosClient.post(url, data, { params });
  },
  verifyEmailUrl: (params) => {
    const url = "/api/users/verify/emailUrl";
    return axiosClient.get(url, { params });
  },
  forgot: (params) => {
    const url = "/api/homepage/forgot-pass";
    return axiosClient.get(url, { params });
  },
  updatePass_forgot: (params, data) => {
    const url = "/api/homepage/update-pass-forgot";
    return axiosClient.post(url, data, { params });
  },
};

const logOutHomePageApi = {
  logoutUser: (params) => {
    const url = "/api/homepage/logout";
    return axiosClient.get(url, { params });
  },
};

//getAllUsers
const getUserApi = {
  getUser: (params) => {
    const url = "/api/user";
    return axiosClient.get(url, { params });
  },
  getUserByRole: (params) => {
    const url = "/api/user_by_role";
    return axiosClient.get(url, { params });
  },
};

//createNewUser
const createUserApi = {
  create: (params, data) => {
    const url = "/api/create-new-user";
    return axiosClient.post(url, data, { params });
  },
};

const deleteUserApi = {
  delete: (params) => {
    const url = "/api/delete-user";
    return axiosClient.delete(url, { params });
  },
};

const updateUserApi = {
  update: (params, data) => {
    const url = "/api/edit-user";
    return axiosClient.put(url, data, { params });
  },
};

//getAllCode By Type
const getAllCodeApi = {
  getByType: (params) => {
    const url = "/api/allCode_type";
    return axiosClient.get(url, { params });
  },
};

export {
  loginApi,
  loginHomePageApi,
  logOutApi,
  logOutHomePageApi,
  getUserApi,
  createUserApi,
  deleteUserApi,
  updateUserApi,
  getAllCodeApi,
  updatePasswordSystem,
};
