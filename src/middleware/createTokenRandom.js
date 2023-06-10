const jwt = require("jsonwebtoken");
require("dotenv/config");

const createTokenRandom = async (email, roleId, action) => {
  return jwt.sign(
    {
      email,
    },
    action === "system"
      ? process.env.SECRET_KEY
      : process.env.SECRET_KEY_STUDENT,
    {
      expiresIn: "30d",
    }
  );
};

module.exports = createTokenRandom;
