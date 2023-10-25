const bcrypt = require("bcryptjs");
const moment = require("moment");
const { Op } = require("sequelize");
require("dotenv/config");

const db = require("../models");

const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto-js");
// const { convertTimeStamp } = require("../utils/convertTimeStamp");
// const { formatDate } = require("../utils/contants");
// const addHours = require("../utils/addHoursDate");

//createNewUser
const createNewUserService = async (data) => {
  const {
    email,
    password,
    fullName,
    address,
    gender,
    roleId,
    phoneNumber,
    image,
    positionId,
    facultyId,
    note,
    type,
  } = data;
  const hashPs = await hashPassword(password);

  return new Promise(async (resolve, reject) => {
    try {
      if (type === "teacher") {
        const teacherExist = await db.Teacher.findOne({
          where: {
            email,
          },
        });
        if (teacherExist) {
          resolve({
            codeNumber: 1,
            message_en: "Email is existed. Please try other email.",
            message_vn: "Email đã sử dụng. Vui lòng dùng một email khác.",
          });
        } else {
          await db.Teacher.create({
            email,
            password: hashPs,
            fullName,
            address,
            gender,
            positionId,
            phoneNumber,
            facultyId,
            note,
            image: image || null,
          });
          resolve({
            codeNumber: 0,
            message_en: "Create Teacher Succeed.",
            message_vn: "Tạo mới giảng viên thành công.",
          });
        }
      } else if (type === "otherUser") {
        const otherUserExist = await db.OtherUser.findOne({
          where: {
            email,
          },
        });
        if (otherUserExist) {
          resolve({
            codeNumber: 1,
            message_en: "Email is existed. Please try other email.",
            message_vn: "Email đã sử dụng. Vui lòng dùng một email khác.",
          });
        } else {
          await db.OtherUser.create({
            email,
            password: hashPs,
            fullName,
            address,
            roleId,
            phoneNumber,
          });
          resolve({
            codeNumber: 0,
            message_en: "Create User Succeed.",
            message_vn: "Tạo mới người dùng thành công.",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const hashPassword = async (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashPs = await bcrypt.hashSync(password, 10);
      resolve(hashPs);
    } catch (e) {
      reject(e);
    }
  });
};

//login
const checkExists = (email, type) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (type === "student") {
        const exist = await db.Student.findOne({
          where: {
            email: email,
          },
          raw: true,
        });
        if (exist) {
          resolve({
            status: true,
            user: exist,
          });
        } else {
          resolve({
            status: false,
          });
        }
      } else {
        const exist = await db.OtherUser.findOne({
          where: {
            email: email,
          },
          raw: true,
        });
        if (exist) {
          resolve({
            status: true,
            user: exist,
          });
        } else {
          resolve({
            status: false,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginSystemService = async (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.Admin.findOne({
        where: {
          email: email,
        },
        raw: true,
      });
      if (user) {
        const checkPassword = await bcrypt.compare(password, user?.password);
        if (!checkPassword) {
          resolve({
            codeNumber: 1,
            message_en: "Password is wrong. Please try again.",
            message_vn: "Mật khẩu sai. Vui lòng thử lại.",
          });
        } else {
          resolve({
            codeNumber: 0,
            message_en: "Login succeed.",
            message_vn: "Đăng nhập thành công.",
            user: {
              id: user?.id,
              fullName: user?.fullName,
              email: user?.email,
              roleId: "R1",
            },
          });
        }
      } else if (!user) {
        const otherUser = await db.OtherUser.findOne({
          where: {
            email: email,
          },
          raw: true,
        });
        if (!otherUser) {
          const teacher = await db.Teacher.findOne({
            where: {
              email: email,
            },
            raw: true,
          });
          if (!teacher) {
            resolve({
              codeNumber: 1,
              message_en: "Email is existed. Please try other email.",
              message_vn: "Email đã sử dụng. Vui lòng dùng một email khác.",
            });
          } else {
            const checkPassword = await bcrypt.compare(
              password,
              teacher?.password
            );
            if (!checkPassword) {
              resolve({
                codeNumber: 1,
                message_en: "Password is wrong. Please try again.",
                message_vn: "Mật khẩu sai. Vui lòng thử lại.",
              });
            } else {
              resolve({
                codeNumber: 0,
                message_en: "Login succeed.",
                message_vn: "Đăng nhập thành công.",
                user: {
                  id: teacher?.id,
                  fullName: teacher?.fullName,
                  email: teacher?.email,
                  roleId: "R5",
                },
              });
            }
          }
        } else {
          const checkPassword = await bcrypt.compare(
            password,
            otherUser?.password
          );
          if (!checkPassword) {
            resolve({
              codeNumber: 1,
              message_en: "Password is wrong. Please try again.",
              message_vn: "Mật khẩu sai. Vui lòng thử lại.",
            });
          } else {
            resolve({
              codeNumber: 0,
              message_en: "Login succeed.",
              message_vn: "Đăng nhập thành công.",
              user: {
                id: otherUser?.id,
                fullName: otherUser?.fullName,
                email: otherUser?.email,
                roleId: otherUser?.roleId,
              },
            });
          }
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const registerHomePageService = (
  email,
  password,
  fullName,
  faculty,
  classroom,
  phoneNumber
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const exist = await checkExists(email, "student");
      const hashPs = await hashPassword(password);

      if (!exist?.status) {
        //send email to user
        let token = crypto.AES.encrypt(
          email,
          process.env.SECRET_KEY_STUDENT
        ).toString();
        await db.Student.create({
          email,
          password: hashPs,
          fullName,
          faculty,
          classroom,
          phoneNumber,
          verified: false,
        });
        const user = await db.Student.findOne({
          where: {
            email,
          },
        });
        await db.TokenEmail.create({
          userId: user?.id,
          token: token,
          action: "verifyEmail",
        });
        //decode token
        token = encodeURIComponent(token);
        const url = `${process.env.BASE_URL_FRONTEND}/users/${user.id}/verify/${token}`;
        await sendEmail({
          email,
          studentData: user,
          subject: "Xác thực đăng ký tài khoản.",
          link: url,
          type: "verifyEmail",
        });
        resolve({
          codeNumber: 2,
          message_en: "An Email sent to your account. Please verify.",
          message_vn:
            "Một email đã gửi đến tài khoản của bạn. Vui lòng xác minh.",
        });
      } else if (exist?.status && !exist?.user?.verified) {
        const checkPassword = await bcrypt.compare(
          password,
          exist.user.password
        );
        if (!checkPassword) {
          resolve({
            codeNumber: 3,
            message_en: "Password is wrong. Please try again.",
            message_vn: "Mật khẩu sai. Vui lòng thử lại.",
          });
        } else {
          let token = crypto.AES.encrypt(
            email,
            process.env.SECRET_KEY_STUDENT
          ).toString();
          await db.TokenEmail.update(
            {
              token: token,
            },
            {
              where: {
                userId: exist.user.id,
                action: "verifyEmail",
              },
            }
          );
          token = encodeURIComponent(token);
          const url = `${process.env.BASE_URL_FRONTEND}/users/${exist.user.id}/verify/${token}`;
          await sendEmail({
            email,
            studentData: exist.user,
            subject: "Xác thực đăng ký tài khoản",
            link: url,
            type: "verifyEmail",
          });
          resolve({
            codeNumber: 2,
            message_en: "An Email sent to your account. Please verify.",
            message_vn:
              "Một email đã gửi đến tài khoản của bạn. Vui lòng xác minh.",
          });
        }
      } else if (exist?.status && exist?.user?.verified) {
        const checkPassword = await bcrypt.compare(
          password,
          exist?.user?.password
        );
        if (!checkPassword) {
          resolve({
            codeNumber: 3,
            message_en: "Password is wrong. Please try again.",
            message_vn: "Mật khẩu sai. Vui lòng thử lại.",
          });
        } else {
          resolve({
            codeNumber: 0,
            message_en: "Sign up succeed.",
            message_vn: "Đăng ký thành công.",
            user: {
              id: exist?.user?.id,
              fullName: exist?.user?.fullName,
              email: exist?.user?.email,
              roleId: "R3",
            },
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginHomePageService = async (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const student = await db.Student.findOne({
        where: {
          email,
        },
      });
      if (!student || !student?.verified) {
        resolve({
          codeNumber: 3,
          message_en: "Please register to use system.",
          message_vn: "Vui lòng đăng ký để sử dụng hệ thống.",
        });
      } else {
        const checkPassword = await bcrypt.compare(password, student?.password);
        if (!checkPassword) {
          resolve({
            codeNumber: 3,
            message_en: "Password is wrong. Please try again.",
            message_vn: "Mật khẩu sai. Vui lòng thử lại.",
          });
        } else {
          resolve({
            codeNumber: 0,
            message_en: "Sign in succeed.",
            message_vn: "Đăng nhập thành công.",
            user: {
              id: student?.id,
              fullName: student?.fullName,
              email: student?.email,
              roleId: "R3",
            },
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const verificationEmailService = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = decodeURIComponent(req.query.token);
      const user = await db.Student.findOne({
        where: { id: req.query.id },
      });
      if (!user)
        resolve({
          codeNumber: 1,
          message: "Invalid Link",
        });

      const checkToken = await db.TokenEmail.findOne({
        where: {
          userId: user.id,
          token,
          action: "verifyEmail",
        },
      });
      if (!checkToken)
        resolve({
          codeNumber: 1,
          message: "Invalid Link",
        });
      //check expires of token email (crypto aes encrypt)
      // allow exist into 1 hour
      // console.log(checkToken.updatedAt + 7 * 60 * 60);
      // console.log(addHours(checkToken.updatedAt, 7));
      const updateTime = new Date(checkToken.updatedAt).getTime();
      // console.log(new Date(Date.now()));
      // console.log(new Date());
      const date_now = new Date(Date.now()).getTime();
      if (Math.abs(Math.floor((date_now - updateTime) / 1000)) > 1 * 60 * 60) {
        resolve({
          codeNumber: 1,
          message: "Invalid Link",
        });
      }

      await db.Student.update(
        {
          verified: true,
        },
        {
          where: {
            id: user.id,
          },
        }
      );
      await db.TokenEmail.destroy({
        where: {
          userId: user.id,
          action: "verifyEmail",
        },
      });
      resolve({
        codeNumber: 0,
        message_en: "Email is verified successfully",
        message_vn: "Xác thực email thành công",
        user: {
          id: user?.id,
          fullName: user?.fullName,
          email: user?.email,
          roleId: "R3",
        },
      });
    } catch (e) {
      reject(e);
    }
  });
};

const sendEmailToUpdatePassHomePageService = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let token = crypto.AES.encrypt(
        email,
        process.env.SECRET_KEY_STUDENT
      ).toString();
      const user = await db.Student.findOne({
        where: { email },
      });
      if (!user) {
        resolve({
          codeNumber: 1,
          message_en: "This Account is not exist. Please sign up.",
          message_vn: "Tài khoản không tồn tại. Vui lòng đăng ký.",
        });
      } else if (user && !user.verified) {
        resolve({
          codeNumber: 1,
          message_en: "This Account is verified yet. Please sign up to verify.",
          message_vn:
            "Tài khoản này chưa được xác minh. Vui lòng đăng ký để xác minh.",
        });
      }
      const checkToken = await db.TokenEmail.findOne({
        where: {
          userId: user.id,
          action: "forgotPass",
        },
      });
      console.log(checkToken);
      if (checkToken) {
        await db.TokenEmail.update(
          {
            token,
          },
          {
            where: {
              userId: user.id,
              action: "forgotPass",
            },
          }
        );
        //decode token
        token = encodeURIComponent(token);
        const url = `${process.env.BASE_URL_FRONTEND}/updatePass/${email}/verify/${token}`;
        await sendEmail({
          email,
          studentData: user,
          subject: "Cập nhật mật khẩu tài khoản của bạn.",
          link: url,
          type: "forgotPass",
        });
        resolve({
          codeNumber: 2,
          message_en:
            "An Email sent to your account. Please check to continue.",
          message_vn:
            "Một email được gửi đến tài khoản của bạn. Vui lòng kiểm tra để tiếp tục",
        });
      } else {
        await db.TokenEmail.create({
          userId: user?.id,
          token: token,
          action: "forgotPass",
        });
        //decode token
        token = encodeURIComponent(token);
        const url = `${process.env.BASE_URL_FRONTEND}/updatePass/${email}/verify/${token}`;
        await sendEmail({
          email,
          studentData: user,
          subject: "Cập nhật mật khẩu tài khoản của bạn.",
          link: url,
          type: "forgotPass",
        });
        resolve({
          codeNumber: 2,
          message_en:
            "An Email sent to your account. Please check to continue.",
          message_vn:
            "Một email được gửi đến tài khoản của bạn. Vui lòng kiểm tra để tiếp tục",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const verifyAndUpdatePassHomePageService = (email, token, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const tokenEnCode = decodeURIComponent(token);

      const user = await db.Student.findOne({
        where: { email },
      });
      if (!user) {
        resolve({
          code: 1,
          message: "Invalid Link 1",
        });
      }

      console.log("tokenUser " + tokenEnCode);
      const checkToken = await db.TokenEmail.findOne({
        where: {
          userId: user.id,
          token: tokenEnCode,
          action: "forgotPass",
        },
      });
      console.log(checkToken?.token);
      // console.log(checkToken?.token + "\n" + token);
      if (!checkToken)
        resolve({
          codeNumber: 1,
          message: "Invalid Link 2",
        });
      //check expires of token email (crypto aes encrypt)
      // allow exist into 5 minutes
      // console.log(checkToken.updatedAt + 7 * 60 * 60);
      // console.log(addHours(checkToken.updatedAt, 7));
      const updateTime = new Date(checkToken.updatedAt).getTime();
      console.log("update " + updateTime);
      // console.log(new Date(Date.now()));
      // console.log(new Date());
      const date_now = new Date(Date.now()).getTime();
      console.log("now " + date_now);

      console.log(
        "time " + Math.abs(Math.floor((date_now - updateTime) / 1000))
      );
      if (Math.abs(Math.floor((date_now - updateTime) / 1000)) > 5 * 60) {
        resolve({
          codeNumber: 3,
          message_en: "Token is expired. Please click into Send new link.",
          message_vn: "Token đã hết hạn. Vui lòng nhấn vào Gửi link mới.",
        });
      }

      //  const filter = { email };
      const updatePass = bcrypt.hashSync(password, 10);
      await db.Student.update(
        {
          password: updatePass,
        },
        {
          where: {
            id: user.id,
          },
        }
      );
      await db.TokenEmail.destroy({
        where: {
          userId: user.id,
          action: "forgotPass",
        },
      });
      resolve({
        codeNumber: 2,
        message_en: "Update password successfully. Please log in again.",
        message_vn: "Cập nhật mật khẩu thành công. Vui lòng đăng nhập lại",
      });
    } catch (e) {
      reject(e);
    }
  });
};

//getOtherUserById
const getUserService = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.OtherUser.findOne({
        where: {
          id: userId,
        },
        attributes: {
          exclude: ["password"],
        },
        // include: [
        //   {
        //     model: db.MarkDown,
        //     as: "markdownData_other",
        //     attributes: ["markdownHtml", "markdownText", "description"],
        //     where: {
        //       type: "other",
        //     },
        //   },
        // ],
        // raw: true,
        // nest: true,
      });
      if (user) {
        const markdownData = await db.MarkDown.findOne({
          where: {
            userId: user.id,
            type: "other",
          },
          attributes: {
            exclude: ["id", "userId", "type", "createdAt", "updatedAt"],
          },
        });
        resolve({
          codeNumber: 0,
          message: "get user succeed",
          data: {
            ...user,
            markdownData_other: {
              ...markdownData,
            },
          },
        });
      } else {
        resolve({
          codeNumber: 1,
          message_en: "Error. Please contact with admin.",
          message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//get User By Role - other user
const getUserByRoleService = (role) => {
  return new Promise(async (resolve, reject) => {
    try {
      // if (role === "R5") {
      //   const allTeacherByRole = await db.User.findAll({
      //     attributes: {
      //       exclude: ["password"],
      //     },
      //     order: [
      //       ["createdAt", "DESC"],
      //       ["updatedAt", "DESC"],
      //     ],
      //   });
      //   resolve(allTeacherByRole);
      // } else {
      const allOtherUserByRole = await db.OtherUser.findAll({
        where: {
          roleId: role,
        },
        attributes: {
          exclude: ["password"],
        },
        order: [
          ["createdAt", "ASC"],
          ["updatedAt", "ASC"],
        ],
      });
      resolve(allOtherUserByRole);
      // }
    } catch (e) {
      reject(e);
    }
  });
};

//editUser
const editUserService = async (data) => {
  const {
    id,
    fullName,
    address,
    gender,
    // roleId,
    phoneNumber,
    image,
    positionId,
    facultyId,
    note,
    type,
  } = data;
  if (!id) {
    return {
      codeNumber: 1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên.",
    };
  }
  return new Promise(async (resolve, reject) => {
    try {
      if (type === "teacher") {
        const teacher = await db.Teacher.findOne({
          where: {
            id,
          },
        });
        if (!teacher) {
          return {
            codeNumber: 1,
            message_en: "Teacher is not exist in system.",
            message_vn: "Giảng viên không tồn tại trong hệ thống.",
          };
        } else {
          await db.Teacher.update(
            {
              fullName: fullName || teacher?.fullName,
              address: address || teacher?.address,
              gender: gender || teacher?.gender,
              phoneNumber: phoneNumber || teacher?.phoneNumber,
              facultyId: facultyId || teacher?.facultyId,
              image: image || teacher?.image,
              positionId: positionId || teacher?.position,
              note: note || teacher?.note,
            },
            {
              where: {
                id,
              },
            }
          );
          resolve({
            codeNumber: 0,
            message_en: "Edit Teacher Succeed.",
            message_vn: "Cập nhật giảng viên thành công.",
          });
        }
      } else if (type === "otherUser") {
        const OtherUser = await db.OtherUser.findOne({
          where: {
            id,
          },
        });
        if (!OtherUser) {
          return {
            codeNumber: 1,
            message_en: "User is not exist in system.",
            message_vn: "Người dùng không tồn tại trong hệ thống.",
          };
        } else {
          await db.OtherUser.update(
            {
              fullName: fullName || OtherUser?.fullName,
              address: address || OtherUser?.address,
              phoneNumber: phoneNumber || OtherUser?.phoneNumber,
              // roleId: roleId || OtherUser?.roleId,
            },
            {
              where: {
                id,
              },
            }
          );
          resolve({
            codeNumber: 0,
            message_en: "Edit User Succeed.",
            message_vn: "Cập nhật người dùng thành công.",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

//deleteUser
const deleteUserService = async (data) => {
  const { id, type } = data;
  if (!id) {
    return {
      codeNumber: 1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên.",
    };
  }
  return new Promise(async (resolve, reject) => {
    try {
      if (type === "teacher") {
        const teacher = await db.Teacher.findOne({
          where: {
            id,
          },
        });
        if (!teacher) {
          return {
            codeNumber: 1,
            message_en: "Teacher is not exist in system.",
            message_vn: "Giảng viên không tồn tại trong hệ thống.",
          };
        }
        await db.Teacher.destroy({
          where: {
            id,
          },
        });
        resolve({
          codeNumber: 0,
          message_en: "Delete Teacher Succeed.",
          message_vn: "Xoá giảng viên thành công.",
        });
      } else if (type === "otherUser") {
        const OtherUser = await db.OtherUser.findOne({
          where: {
            id,
          },
        });
        if (!OtherUser) {
          return {
            codeNumber: 1,
            message_en: "User is not exist in system.",
            message_vn: "Người dùng không tồn tại trong hệ thống.",
          };
        }
        await db.OtherUser.destroy({
          where: {
            id,
          },
        });
        resolve({
          codeNumber: 0,
          message_en: "Delete User Succeed.",
          message_vn: "Xoá người dùng thành công.",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  loginSystemService,
  registerHomePageService,
  loginHomePageService,
  verificationEmailService,
  getUserService,
  createNewUserService,
  editUserService,
  deleteUserService,
  getUserByRoleService,
  sendEmailToUpdatePassHomePageService,
  verifyAndUpdatePassHomePageService,
};
