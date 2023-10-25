const db = require("../models");
const { convertTimeStamp } = require("../utils/convertTimeStamp");
const bcrypt = require("bcryptjs");

const updateStudentService = (email, phoneNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Student.update(
        {
          phoneNumber,
        },
        {
          where: {
            email,
          },
        }
      );
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

const updateProfileStudentService = ({
  id,
  fullName,
  phoneNumber,
  address,
  faculty,
  classroom,
  gender,
  image,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Student.update(
        image
          ? {
              fullName,
              phoneNumber,
              address,
              faculty,
              classroom,
              gender,
              image,
            }
          : {
              fullName,
              phoneNumber,
              address,
              faculty,
              classroom,
              gender,
            },
        {
          where: {
            id,
          },
        }
      );
      resolve({
        codeNumber: 0,
        message_vn: "Cập nhật thông tin sinh viên thành công.",
        message_en: "Update student's profile succeed.",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updatePasswordStudentService = ({
  student,
  currentPassword,
  newPassword,
}) => {
  console.log({
    student,
    currentPassword,
    newPassword,
  });
  return new Promise(async (resolve, reject) => {
    try {
      //check current password
      const checkPassword = await bcrypt.compare(
        currentPassword,
        student?.password
      );
      if (!checkPassword) {
        resolve({
          codeNumber: 1,
          message_en: "Current password is wrong. Please try again.",
          message_vn: "Mật khẩu hiện tại sai. Vui lòng thử lại.",
        });
      }
      const hashPs = await bcrypt.hashSync(newPassword, 10);
      await db.Student.update(
        {
          password: hashPs,
        },
        {
          where: {
            id: student?.id,
          },
        }
      );
      resolve({
        codeNumber: 0,
        message_en: "Update Password Succeed.",
        message_vn: "Cập nhật mật khẩu thành công.",
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  updateStudentService,
  updateProfileStudentService,
  updatePasswordStudentService,
};
