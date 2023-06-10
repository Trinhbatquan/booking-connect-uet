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
    position,
  } = data;
  const userExist = await db.User.findOne({
    where: {
      email,
    },
  });
  if (userExist) {
    return {
      codeNumber: 1,
      message: "Email is existed. Please try other email.",
    };
  }
  const hashPs = await hashPassword(password);
  return new Promise(async (resolve, reject) => {
    try {
      await db.User.create({
        email,
        password: hashPs,
        fullName,
        address,
        gender: gender || null,
        roleId,
        phoneNumber: phoneNumber || null,
        image: image || null,
        positionId: position || null,
      });
      resolve({
        codeNumber: 0,
        message: "Create New User Succeed",
      });
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
const checkExists = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const exist = await db.User.findOne({
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
    } catch (e) {
      reject(e);
    }
  });
};

const loginSystemService = async (email, password) => {
  //check exist
  const exist = await checkExists(email);
  console.log(exist);
  if (!exist?.status) {
    return {
      codeNumber: 1,
      message: "Email isn't exist. Please try a other email.",
    };
  } else {
    return new Promise(async (resolve, reject) => {
      //check Password
      try {
        const user = await db.User.findOne({
          where: {
            email: email,
          },
          raw: true,
        });
        console.log(user);
        if (!user) {
          resolve({
            codeNumber: 1,
            message:
              "Email isn't exist in the system. Please try a other email.",
          });
        } else if (user?.roleId === "R3") {
          resolve({
            codeNumber: 1,
            message: "You don't have permission to access this system",
          });
        } else {
          const checkPassword = await bcrypt.compare(password, user?.password);
          console.log(checkPassword);
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
                email: user?.email,
                roleId: user?.roleId,
              },
            });
          }
        }
      } catch (e) {
        reject(e);
      }
    });
  }
};

const loginHomePageService = async (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const exist = await checkExists(email);
      const hashPs = await hashPassword(password);

      if (!exist?.status) {
        //send email to user
        let token = crypto.AES.encrypt(
          email,
          process.env.SECRET_KEY_STUDENT
        ).toString();
        console.log(token);
        await db.User.create({
          email,
          password: hashPs,
          roleId: "R3",
          verified: false,
        });
        const user = await db.User.findOne({
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
          message: "An Email sent to your account. Please verify",
        });
      } else if (exist?.status && !exist?.user?.verified) {
        if (exist?.user?.roleId !== "R3") {
          resolve({
            codeNumber: 3,
            message: "You are not the student",
          });
        }
        const checkPassword = await bcrypt.compare(
          password,
          exist.user.password
        );
        console.log(checkPassword);
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
          console.log(token);
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
        if (exist?.user?.roleId !== "R3") {
          resolve({
            codeNumber: 3,
            message: "You are not the student",
          });
        } else {
          const checkPassword = await bcrypt.compare(
            password,
            exist?.user?.password
          );
          console.log(checkPassword);
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
                email: exist?.user?.email,
                roleId: exist?.user?.roleId,
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

const verificationEmailService = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = decodeURIComponent(req.query.token);
      const user = await db.User.findOne({
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

      await db.User.update(
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
          email: user?.email,
          roleId: user?.roleId,
        },
      });
    } catch (e) {
      reject(e);
    }
  });
};

//getUser
const getUserService = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (userId === "All") {
        const allUser = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
          where: {
            roleId: {
              [Op.ne]: "R1",
            },
          },
        });
        resolve({
          codeNumber: 0,
          message: "get user succeed",
          user: allUser,
        });
      } else if (userId && userId !== "All") {
        const user = await db.User.findOne({
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
      }
    } catch (e) {
      reject(e);
    }
  });
};

//get User By Role
const getUserByRoleService = (role) => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUserByRole = await db.User.findAll({
        where: {
          roleId: role,
        },
        attributes: {
          exclude: ["password"],
        },
        order: [
          ["createdAt", "DESC"],
          ["updatedAt", "DESC"],
        ],
      });
      resolve(allUserByRole);
    } catch (e) {
      reject(e);
    }
  });
};

//editUser
const editUserService = async (data) => {
  const { id, fullName, address, gender, phoneNumber, image, position } = data;
  if (!id) {
    return {
      codeNumber: 1,
      message: "Missing parameter id",
    };
  }
  const user = await db.User.findOne({
    where: {
      id,
    },
  });
  if (!user) {
    return {
      codeNumber: 1,
      message: "User not exist in system",
    };
  }
  return new Promise(async (resolve, reject) => {
    try {
      await db.User.update(
        {
          fullName: fullName || user?.fullName,
          address: address || user?.address,
          gender: gender || user?.gender,
          phoneNumber: phoneNumber || user?.phoneNumber,
          image: image || user?.image,
          positionId: position || user?.position,
        },
        {
          where: {
            id,
          },
        }
      );
      resolve({
        codeNumber: 0,
        message: "Edit User Succeed",
      });
    } catch (e) {
      reject(e);
    }
  });
};

//deleteUser
const deleteUserService = async (data) => {
  const { id } = data;
  if (!id) {
    return {
      codeNumber: 1,
      message: "Missing parameter id",
    };
  }
  const user = await db.User.findOne({
    where: {
      id,
    },
  });
  if (!user) {
    return {
      codeNumber: 1,
      message: "User not exist in system",
    };
  }
  return new Promise(async (resolve, reject) => {
    try {
      await db.User.destroy({
        where: {
          id,
        },
      });
      resolve({
        codeNumber: 0,
        message: "Delete User Succeed",
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  loginSystemService,
  loginHomePageService,
  verificationEmailService,
  getUserService,
  createNewUserService,
  editUserService,
  deleteUserService,
  getUserByRoleService,
};
