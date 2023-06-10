const jwt = require("jsonwebtoken");
const db = require("../models");

const checkExpiredToken = async (req, res, next, action) => {
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
  const { exp } = decode;
  if (Date.now() >= exp * 1000) {
    return res.status(401).json({
      codeNumber: -2,
      message: "Token has expired, please login again",
    });
  }
  req.decodeToken = decode;
  next();
};

const protectAdminToken = async (req, res, next) => {
  const { email } = req.decodeToken;
  const data = await db.User.findOne({
    where: {
      email,
    },
    attributes: {
      exclude: ["password"],
    },
  });
  if (data && data.roleId === "R1") {
    req.admin = data;
    next();
  } else {
    return res.status(401).json({
      message: -3,
      message: "Current User isn't admin",
    });
  }
};

const protectUserToken = async (req, res, next, action) => {
  const { email } = req.decodeToken;
  const data = await db.User.findOne({
    where: {
      email,
    },
    attributes: {
      exclude: ["password"],
    },
  });
  // if (data && data.roleId === "R3") {
  //   return res.status(401).json({
  //     message: 4,
  //     message: "Current User is student",
  //   });
  // } else {
  //   req.user = data;
  //   next();
  // }
  if (action === "student") {
    if (data && data.roleId !== "R3") {
      return res.status(401).json({
        message: -3,
        message: "Current User is not student",
      });
    } else {
      req.user = data;
      next();
    }
  } else {
    if (data && data.roleId === "R3") {
      return res.status(501).json({
        message: -3,
        message: "Current User is student",
      });
    } else {
      req.user = data;
      next();
    }
  }
};

module.exports = {
  checkExpiredToken,
  protectAdminToken,
  protectUserToken,
};
