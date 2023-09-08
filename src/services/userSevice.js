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
            message: "Email is existed. Please try other email.",
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
            message: "Create Teacher Succeed",
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
            message: "Email is existed. Please try other email.",
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
            message: "Create OtherUser Succeed",
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
            message: "Password is wrong. Please try again.",
          });
        } else {
          resolve({
            codeNumber: 0,
            message: "Login OK",
            user: {
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
              message: "Email isn't exist. Please try a other email.",
            });
          } else {
            const checkPassword = await bcrypt.compare(
              password,
              teacher?.password
            );
            if (!checkPassword) {
              resolve({
                codeNumber: 1,
                message: "Password is wrong. Please try again.",
              });
            } else {
              resolve({
                codeNumber: 0,
                message: "Login OK",
                user: {
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
              message: "Password is wrong. Please try again.",
            });
          } else {
            resolve({
              codeNumber: 0,
              message: "Login OK",
              user: {
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

const registerHomePageService = (email, password, fullName, faculty) => {
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
        });
        //decode token
        token = encodeURIComponent(token);
        const url = `${process.env.BASE_URL_FRONTEND}/users/${user.id}/verify/${token}`;
        await sendEmail(email, "Verify Email", url);
        resolve({
          codeNumber: 2,
          message: "An Email sent to your account. Please verify.",
        });
      } else if (exist?.status && !exist?.user?.verified) {
        const checkPassword = await bcrypt.compare(
          password,
          exist.user.password
        );
        if (!checkPassword) {
          resolve({
            codeNumber: 3,
            message: "Password is wrong. Please try again.",
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
              },
            }
          );
          token = encodeURIComponent(token);
          const url = `${process.env.BASE_URL_FRONTEND}/users/${exist.user.id}/verify/${token}`;
          await sendEmail(email, "Verify Email", url);
          resolve({
            codeNumber: 2,
            message: "An Email sent to your account. Please verify",
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
            message: "Password is wrong. Please try again.",
          });
        } else {
          resolve({
            codeNumber: 0,
            message: "Login OK",
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
      // const exist = await checkExists(email);
      // const hashPs = await hashPassword(password);

      // if (!exist?.status) {
      // }
      //   else if (exist?.status && !exist?.user?.verified) {
      //   if (exist?.user?.roleId !== "R3") {
      //     resolve({
      //       codeNumber: 3,
      //       message: "You are not the student",
      //     });
      //   }
      //   const checkPassword = await bcrypt.compare(
      //     password,
      //     exist.user.password
      //   );
      //   if (!checkPassword) {
      //     resolve({
      //       codeNumber: 3,
      //     });
      //   } else {
      //     let token = crypto.AES.encrypt(
      //       email,
      //       process.env.SECRET_KEY_STUDENT
      //     ).toString();
      //     await db.TokenEmail.update(
      //       {
      //         token: token,
      //       },
      //       {
      //         where: {
      //           userId: exist.user.id,
      //         },
      //       }
      //     );
      //     token = encodeURIComponent(token);
      //     const url = `${process.env.BASE_URL_FRONTEND}/users/${exist.user.id}/verify/${token}`;
      //     await sendEmail(email, "Verify Email", url);
      //     resolve({
      //       codeNumber: 2,
      //       message: "An Email sent to your account. Please verify",
      //     });
      //   }
      // }
      const student = await db.Student.findOne({
        where: {
          email,
        },
      });
      if (!student || !student?.verified) {
        resolve({
          codeNumber: 3,
          message: "Please register to use system.",
        });
      } else {
        const checkPassword = await bcrypt.compare(password, student?.password);
        if (!checkPassword) {
          resolve({
            codeNumber: 3,
            message: "Password is wrong. Please try again.",
          });
        } else {
          resolve({
            codeNumber: 0,
            message: "Login OK",
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
        },
      });
      resolve({
        codeNumber: 0,
        message: "Email verified successfully",
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
      });
      if (user) {
        resolve({
          codeNumber: 0,
          message: "get user succeed",
          user,
        });
      } else {
        resolve({
          codeNumber: 1,
          message: "no find user",
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
      message: "Missing parameter id",
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
            message: "Teacher not exist in system",
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
            message: "Edit Teacher Succeed",
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
            message: "OtherUser not exist in system",
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
            message: "Edit OtherUser Succeed",
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
      message: "Missing parameter id",
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
            message: "Teacher not exist in system",
          };
        }
        await db.Teacher.destroy({
          where: {
            id,
          },
        });
        resolve({
          codeNumber: 0,
          message: "Delete Teacher Succeed",
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
            message: "OtherUser not exist in system",
          };
        }
        await db.OtherUser.destroy({
          where: {
            id,
          },
        });
        resolve({
          codeNumber: 0,
          message: "Delete OtherUser Succeed",
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
};
