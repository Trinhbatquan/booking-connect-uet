const jwt = require("jsonwebtoken");
const db = require("../models");

const checkExpiredToken = async (req, res, next, action) => {
  console.log("test");
  try {
    let token;
    if (action === "system") {
      token = await req.cookies.access_token_booking_UET_system;
    } else {
      token = await req.cookies.access_token_booking_UET_student;
    }
    if (!token) {
      return res.status(401).json({
        codeNumber: -2,
        message: "No token found or cookie session expired.",
      });
    }
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    console.log(decode);

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
    const email = req.decodeToken;
    if (action === "student") {
      const student = await db.Student.findOne({
        where: {
          email,
        },
        attributes: {
          exclude: ["password"],
        },
      });
      if (!student) {
        return res.status(401).json({
          codeNumber: -2,
          message: "Current User is not student",
        });
      } else {
        req.user = student;
        next();
      }
    } else if (action === "otherUser") {
      const user = await db.Teacher.findOne({
        where: {
          email,
        },
        attributes: {
          exclude: ["password"],
        },
      });
      if (user) {
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
        if (!data) {
          return res.status(501).json({
            message: -2,
            message: "Current User is student",
          });
        } else {
          req.user = data;
          next();
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
