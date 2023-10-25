const jwt = require("jsonwebtoken");
const db = require("../models");
require("dotenv/config");

const checkExpiredToken = async (req, res, next, action) => {
  console.log("test");
  try {
    let token;
    let decode;
    if (action === "system") {
      token = await req.cookies.access_token_booking_UET_system;
      if (token) {
        decode = await jwt.verify(token, process.env.SECRET_KEY);
      }
    } else if (action === "student") {
      token = await req.cookies.access_token_booking_UET_homepage;
      if (token) {
        decode = await jwt.verify(token, process.env.SECRET_KEY_STUDENT);
      }
    }
    if (!token) {
      return res.status(401).json({
        codeNumber: -2,
        message: "No token found or cookie session expired.",
      });
    }
    // console.log(decode);

    const { exp } = decode;
    if (Date.now() >= exp * 1000) {
      return res.status(401).json({
        codeNumber: -2,
        message: "Token has expired, please login again",
      });
    }
    req.decodeToken = decode;
    next();
  } catch (e) {
    console.log("error check expire token \n" + e);
  }
};

const protectAdminToken = async (req, res, next) => {
  try {
    // console.log(req);
    // next();
    const { email } = req.decodeToken;
    console.log(email);
    const data = await db.Admin.findOne({
      where: {
        email,
      },
      attributes: {
        exclude: ["password"],
      },
    });
    if (data) {
      req.admin = data;
      next();
    } else {
      return res.status(401).json({
        codeNumber: -2,
        message: "Current User isn't admin",
      });
    }
  } catch (e) {
    console.log("error protect admin token \n" + e);
  }
};

const protectUserToken = async (req, res, next, action) => {
  try {
    const { email } = req.decodeToken;
    console.log(email);
    if (action === "student") {
      if (!req.body.email) {
        return res.status(401).json({
          codeNumber: -1,
          message: "Missing parameter email",
        });
      }
      const student = await db.Student.findOne({
        where: {
          email,
        },
        // attributes: {
        //   exclude: ["password"],
        // },
      });
      if (!student || email !== req.body.email) {
        return res.status(401).json({
          codeNumber: -2,
          message: "Current User is not student",
        });
      }
      {
        req.user = student;
        next();
      }
    } else if (action === "otherUser") {
      const data = await db.Admin.findOne({
        where: {
          email,
        },
        attributes: {
          exclude: ["password"],
        },
      });
      if (data) {
        req.admin = data;
        next();
      } else {
        if (!req.body.email) {
          return res.status(401).json({
            codeNumber: -1,
            message: "Missing parameter email",
          });
        }
        const user = await db.Teacher.findOne({
          where: {
            email,
          },
          attributes: {
            exclude: ["password"],
          },
        });
        if (user && email === req.body.email) {
          req.user = user;
          next();
        } else {
          const data = await db.OtherUser.findOne({
            where: {
              email,
            },
            attributes: {
              exclude: ["password"],
            },
          });
          if (!data || email !== req.body.email) {
            return res.status(501).json({
              codeNumber: -2,
              message: "Current User is student",
            });
          } else {
            req.user = data;
            next();
          }
        }
      }
    }
  } catch (e) {
    console.log("error protect user token \n" + e);
  }
};

module.exports = {
  checkExpiredToken,
  protectAdminToken,
  protectUserToken,
};
