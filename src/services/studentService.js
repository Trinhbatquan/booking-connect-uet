import axiosClient from "../axios";

//getTenTeacher
const updateStudent = {
  update: (params, data) => {
    const url = "/api/update-student";
    return axiosClient.put(url, data, { params });
  },
  updateProfile: (params, data) => {
    const url = "/api/update-profile-student";
    return axiosClient.put(url, data, { params });
  },
  updatePassword: (params, data) => {
    const url = "/api/update-password-student";
    return axiosClient.put(url, data, { params });
  },
};

const getStudent = (params, data) => {
  const url = "/api/get-student";
  return axiosClient.post(url, data, { params });
};
const getManager = (params, data) => {
  const url = "/api/get-manager";
  return axiosClient.post(url, data, { params });
};
const updateProfileManager = (params, data) => {
  const url = "/api/update-profile-manager";
  return axiosClient.put(url, data, { params });
};

export { updateStudent, getStudent, getManager, updateProfileManager };
