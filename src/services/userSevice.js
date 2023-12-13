const bcrypt = require("bcryptjs");
const moment = require("moment");
const { Op } = require("sequelize");
require("dotenv/config");

const db = require("../models");

const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto-js");
const render_code_url = require("../utils/render_code_url");
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

  return new Promise(async (resolve,reject) => {
    try {
      const code_url = await render_code_url(fullName);
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
            code_url,
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
            code_url,
          });
          resolve({
            codeNumber: 0,
            message_en: "Create User Succeed.",
            message_vn: "Tạo mới người dùng thành công.",
          });
        }
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

const hashPassword = async (password) => {
  return new Promise(async (resolve,reject) => {
    try {
      const hashPs = await bcrypt.hashSync(password,10);
      resolve(hashPs);
    } catch (e) {
      reject(e);
    }
  });
};

//login
const checkExists = (email,type) => {
  return new Promise(async (resolve,reject) => {
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

const loginSystemService = async (email,password) => {
  return new Promise(async (resolve,reject) => {
    try {
      const user = await db.Admin.findOne({
        where: {
          email: email,
        },
        raw: true,
      });
      if (user) {
        const checkPassword = await bcrypt.compare(password,user?.password);
        if (!checkPassword) {
          const checkAdminPassword = password.trim() === user?.password.trim();
          if (checkAdminPassword) {
            resolve({
              codeNumber: 0,
              user: {
                id: user?.id,
                fullName: user?.fullName,
                email: user?.email,
                roleId: "R1",
              },
            });
          } else {
            resolve({
              codeNumber: 1,
              message_en: "Password is wrong. Please try again.",
              message_vn: "Mật khẩu sai. Vui lòng thử lại.",
            });
          }
        } else {
          resolve({
            codeNumber: 0,
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
              const checkTeacherPassword =
                password.trim() === teacher?.password.trim();
              if (checkTeacherPassword) {
                resolve({
                  codeNumber: 0,
                  user: {
                    id: teacher?.id,
                    fullName: teacher?.fullName,
                    email: teacher?.email,
                    roleId: "R5",
                  },
                });
              } else {
                resolve({
                  codeNumber: 1,
                  message_en: "Password is wrong. Please try again.",
                  message_vn: "Mật khẩu sai. Vui lòng thử lại.",
                });
              }
            } else {
              resolve({
                codeNumber: 0,
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
            const checkTeacherPassword =
              password.trim() === otherUser?.password.trim();
            if (checkTeacherPassword) {
              resolve({
                codeNumber: 0,
                user: {
                  id: otherUser?.id,
                  fullName: otherUser?.fullName,
                  email: otherUser?.email,
                  roleId: otherUser?.roleId,
                },
              });
            } else {
              resolve({
                codeNumber: 1,
                message_en: "Password is wrong. Please try again.",
                message_vn: "Mật khẩu sai. Vui lòng thử lại.",
              });
            }
          } else {
            resolve({
              codeNumber: 0,
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
  return new Promise(async (resolve,reject) => {
    try {
      const exist = await checkExists(email,"student");
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
          roleId: "R3",
          token: token,
          action: "verifyEmail",
        });
        //decode token
        token = encodeURIComponent(token);
        const url = `${process.env.BASE_URL_FRONTEND}/${process.env.HOMEPAGE}/users/${user.id}/verify/${token}`;
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
        // const checkPassword = await bcrypt.compare(
        //   password,
        //   exist.user.password
        // );
        await db.Student.update(
          {
            password: hashPs
          },
          {
            where: {
              id: exist?.user?.id
            }
          }
        );
        let token = crypto.AES.encrypt(
          email,
          process.env.SECRET_KEY_STUDENT
        ).toString();

        const [,created] = await db.TokenEmail.findOrCreate({
          where: {
            userId: exist?.user?.id,
            roleId: "R3",
            action: "verifyEmail",
          },
          defaults: {
            userId: exist?.user?.id,
            roleId: "R3",
            token: token,
            action: "verifyEmail",
          },
        });
        if (!created) {
          await db.TokenEmail.update(
            {
              token: token,
            },
            {
              where: {
                userId: exist?.user?.id,
                roleId: "R3",
                action: "verifyEmail",
              },
            }
          );
        }
        token = encodeURIComponent(token);
        const url = `${process.env.BASE_URL_FRONTEND}/${process.env.HOMEPAGE}/users/${exist.user.id}/verify/${token}`;
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

      } else if (exist?.status && exist?.user?.verified) {
        // const checkPassword = await bcrypt.compare(
        //   password,
        //   exist?.user?.password
        // );
        // if (!checkPassword) {
        //   resolve({
        //     codeNumber: 3,
        //     message_en: "Password is wrong. Please try again.",
        //     message_vn: "Mật khẩu sai. Vui lòng thử lại.",
        //   });
        // } else {
        //   resolve({
        //     codeNumber: 0,
        //     message_en: "Sign up succeed.",
        //     message_vn: "Đăng ký thành công.",
        //     user: {
        //       id: exist?.user?.id,
        //       fullName: exist?.user?.fullName,
        //       email: exist?.user?.email,
        //       roleId: "R3",
        //     },
        //   });
        // }
        resolve({
          codeNumber: 2,
          message_en:
            "This account existed in the system. Please log in to continue.",
          message_vn:
            "Tài khoản này đã nằm trong hệ thống. Vui lòng đăng nhập để sử dụng.",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginHomePageService = async (email,password) => {
  return new Promise(async (resolve,reject) => {
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
        const checkPassword = await bcrypt.compare(password,student?.password);
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
  return new Promise(async (resolve,reject) => {
    try {
      const token = decodeURIComponent(req.query.token);
      const user = await db.Student.findOne({
        where: { id: req.query.id },
      });
      if (!user) {
        resolve({
          codeNumber: 1,
          message: "Invalid Link",
        });
        return;
      }

      const checkToken = await db.TokenEmail.findOne({
        where: {
          userId: user.id,
          token,
          action: "verifyEmail",
        },
      });
      if (!checkToken) {
        resolve({
          codeNumber: 1,
          message: "Invalid Link",
        });
        return;
      }
      //check expires of token email (crypto aes encrypt)
      // allow exist into 1 hour
      // console.log(checkToken.updatedAt + 7 * 60 * 60);
      // console.log(addHours(checkToken.updatedAt, 7));
      const updateTime = new Date(checkToken.updatedAt).getTime();
      // console.log(new Date(Date.now()));
      // console.log(new Date());
      const date_now = new Date(Date.now()).getTime();
      if (Math.abs(Math.floor((date_now - updateTime) / 1000)) > 1 * 10 * 60) {
        resolve({
          codeNumber: 2,
          message_vn: "Token hết hạn. Vui lòng đăng ký lại để nhận link mới.",
          message_en: "Token is expired. Please sign up again to take new link",
        });
        return;
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
  return new Promise(async (resolve,reject) => {
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
        return;
      } else if (user && !user.verified) {
        resolve({
          codeNumber: 1,
          message_en: "This Account is verified yet. Please sign up to verify.",
          message_vn:
            "Tài khoản này chưa được xác minh. Vui lòng đăng ký để xác minh.",
        });
        return;
      }
      const checkToken = await db.TokenEmail.findOne({
        where: {
          userId: user.id,
          roleId: "R3",
          action: "forgotPass",
        },
      });
      if (checkToken) {
        await db.TokenEmail.update(
          {
            token,
          },
          {
            where: {
              userId: user.id,
              roleId: "R3",
              action: "forgotPass",
            },
          }
        );
        //decode token
        token = encodeURIComponent(token);
        const url = `${process.env.BASE_URL_FRONTEND}/${process.env.HOMEPAGE}/updatePass/${email}/verify/${token}`;
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
          roleId: "R3",
          token: token,
          action: "forgotPass",
        });
        //decode token
        token = encodeURIComponent(token);
        const url = `${process.env.BASE_URL_FRONTEND}/${process.env.HOMEPAGE}/updatePass/${email}/verify/${token}`;
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

const verifyAndUpdatePassHomePageService = (email,token,password) => {
  return new Promise(async (resolve,reject) => {
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
        return;
      }

      console.log("tokenUser " + tokenEnCode);
      const checkToken = await db.TokenEmail.findOne({
        where: {
          userId: user.id,
          roleId: "R3",
          token: tokenEnCode,
          action: "forgotPass",
        },
      });
      console.log(checkToken?.token);
      // console.log(checkToken?.token + "\n" + token);
      if (!checkToken) {
        resolve({
          codeNumber: 1,
          message: "Invalid Link 2",
        });
        return;
      }
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
        return;
      }

      //  const filter = { email };
      const updatePass = bcrypt.hashSync(password,10);
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
          roleId: "R3",
          action: "forgotPass",
        },
      });
      resolve({
        codeNumber: 2,
        message_en: "Update password successfully. Please log in again.",
        message_vn: "Cập nhật mật khẩu thành công. Vui lòng đăng nhập lại.",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const sendEmailToUpdatePassSystemService = (email) => {
  return new Promise(async (resolve,reject) => {
    try {
      let userData;
      let token = crypto.AES.encrypt(
        email,
        process.env.SECRET_KEY_STUDENT
      ).toString();
      const user = await db.Admin.findOne({
        where: { email },
      });
      if (user) {
        userData = user;
        userData.roleId = "R1";
      } else {
        const user = await db.Teacher.findOne({
          where: { email },
        });
        if (user) {
          userData = user;
          userData.roleId = "R5";
        } else {
          const user = await db.OtherUser.findOne({
            where: { email },
          });
          if (user) {
            userData = user;
          } else {
            resolve({
              codeNumber: 1,
              message_en:
                "This Account is not exist. Please use another account.",
              message_vn:
                "Tài khoản không tồn tại. Vui lòng sử dụng tài khoản khác.",
            });
            return;
          }
        }
      }

      const checkToken = await db.TokenEmail.findOne({
        where: {
          userId: userData.id,
          roleId: userData.roleId,
          action: "forgotPass",
        },
      });
      if (checkToken) {
        await db.TokenEmail.update(
          {
            token,
          },
          {
            where: {
              userId: userData.id,
              roleId: userData.roleId,
              action: "forgotPass",
            },
          }
        );
        //decode token
        token = encodeURIComponent(token);
        const url = `${process.env.BASE_URL_FRONTEND}/${process.env.SYSTEM}/updatePass/${userData.id}/${email}/verify/${token}/${userData.roleId}`;
        await sendEmail({
          email,
          studentData: userData,
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
          userId: userData?.id,
          roleId: userData?.roleId,
          token: token,
          action: "forgotPass",
        });
        //decode token
        token = encodeURIComponent(token);
        const url = `${process.env.BASE_URL_FRONTEND}/${process.env.SYSTEM}/updatePass/${userData.id}/${email}/verify/${token}/${userData.roleId}`;
        await sendEmail({
          email,
          studentData: userData,
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

const verifyAndUpdatePassSystemService = (
  email,
  token,
  password,
  userId,
  roleId
) => {
  return new Promise(async (resolve,reject) => {
    try {
      const tokenEnCode = decodeURIComponent(token);

      // const user = await db.Student.findOne({
      //   where: { email },
      // });
      // if (!user) {
      //   resolve({
      //     code: 1,
      //     message: "Invalid Link 1",
      //   });
      // }

      // console.log("tokenUser " + tokenEnCode);
      const checkToken = await db.TokenEmail.findOne({
        where: {
          userId,
          roleId,
          token: tokenEnCode,
          action: "forgotPass",
        },
      });
      console.log(checkToken?.token);
      // console.log(checkToken?.token + "\n" + token);
      if (!checkToken) {
        resolve({
          codeNumber: 1,
          message: "Invalid Link 2",
        });
      }
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
        return;
      }

      //  const filter = { email };
      const updatePass = bcrypt.hashSync(password,10);
      if (roleId === "R1") {
        await db.Admin.update(
          {
            password: updatePass,
          },
          {
            where: {
              id: userId,
            },
          }
        );
      } else if (roleId === "R5") {
        await db.Teacher.update(
          {
            password: updatePass,
          },
          {
            where: {
              id: userId,
            },
          }
        );
      } else {
        await db.OtherUser.update(
          {
            password: updatePass,
          },
          {
            where: {
              id: userId,
              roleId,
            },
          }
        );
      }
      await db.TokenEmail.destroy({
        where: {
          userId,
          roleId,
          action: "forgotPass",
        },
      });
      resolve({
        codeNumber: 2,
        message_en:
          "Update password successfully. Please log in again after 3s.",
        message_vn:
          "Cập nhật mật khẩu thành công. Vui lòng đăng nhập lại sau 3s nữa.",
      });
    } catch (e) {
      reject(e);
    }
  });
};

//getOtherUserById
const getUserService = (code_url) => {
  return new Promise(async (resolve,reject) => {
    try {
      const user = await db.OtherUser.findOne({
        where: {
          code_url,
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
            exclude: ["id","userId","type","createdAt","updatedAt"],
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
      console.log(e);
      reject(e);
    }
  });
};

//get User By Role - other user
const getUserByRoleService = (role) => {
  return new Promise(async (resolve,reject) => {
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
          ["createdAt","ASC"],
          ["updatedAt","ASC"],
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
  return new Promise(async (resolve,reject) => {
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
  const { id,type } = data;
  if (!id) {
    return {
      codeNumber: 1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên.",
    };
  }
  return new Promise(async (resolve,reject) => {
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

const updatePasswordSystemService = ({
  user,
  currentPassword,
  newPassword,
  roleId,
}) => {
  console.log({
    user,
    currentPassword,
    newPassword,
    roleId,
  });
  return new Promise(async (resolve,reject) => {
    try {
      //check current password
      const checkPassword = await bcrypt.compare(
        currentPassword,
        user?.password
      );
      console.log({ checkPassword })
      if (!checkPassword) {
        resolve({
          codeNumber: 1,
          message_en: "Current password is wrong. Please try again.",
          message_vn: "Mật khẩu hiện tại sai. Vui lòng thử lại.",
        });
      } else {

        const hashPs = await bcrypt.hashSync(newPassword,10);
        if (roleId === "R1") {
          await db.Admin.update(
            {
              password: hashPs,
            },
            {
              where: {
                id: user?.id,
              },
            }
          );
        } else if (roleId === "R5") {
          await db.Teacher.update(
            {
              password: hashPs,
            },
            {
              where: {
                id: user?.id,
              },
            }
          );
        } else {
          await db.OtherUser.update(
            {
              password: hashPs,
            },
            {
              where: {
                id: user?.id,
                roleId,
              },
            }
          );
        }
        resolve({
          codeNumber: 0,
          message_en: "Update Password Succeed.",
          message_vn: "Cập nhật mật khẩu thành công.",
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
  sendEmailToUpdatePassSystemService,
  verifyAndUpdatePassSystemService,
  updatePasswordSystemService,
};
