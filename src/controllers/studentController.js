const {
  // updateStudentService,
  updateProfileStudentService,
  updatePasswordStudentService,
} = require("../services/studentService");

// const updateStudentController = async (req, res) => {
//   try {
//     const { email, phoneNumber } = req.body;
//     if (!email || !phoneNumber) {
//       return res.status(501).json({
//         codeNumber: 1,
//         message: "Missing parameters",
//       });
//     } else {
//       const data = await updateStudentService(email, phoneNumber);
//       return res.status(200).json({
//         codeNumber: 0,
//         message: "Success",
//       });
//     }
//   } catch (e) {
//     console.log("update student " + e);
//     res.status(501).json({
//       codeNumber: -1,
//       message: "Not update student",
//     });
//   }
// };

const updateProfileStudentController = async (req, res) => {
  try {
    const { user } = req;
    const {
      fullName,
      phoneNumber,
      address,
      faculty,
      classroom,
      gender,
      image,
    } = req.body;
    const data = await updateProfileStudentService({
      id: user?.id,
      fullName,
      phoneNumber,
      address,
      faculty,
      classroom,
      gender,
      image,
    });
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    res.status(501).json({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

const updatePasswordStudentController = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { user } = req;
  try {
    const data = await updatePasswordStudentService({
      student: user,
      currentPassword,
      newPassword,
    });
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    res.status(501).json({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

const getStudentController = async (req, res) => {
  try {
    const { user } = req;
    return res.status(200).json({
      codeNumber: 0,
      student: user,
    });
  } catch (e) {
    console.log("get student " + e);
    res.status(200).send({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

module.exports = {
  // updateStudentController,
  getStudentController,
  updateProfileStudentController,
  updatePasswordStudentController,
};
