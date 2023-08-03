const db = require("../models");
const { convertTimeStamp } = require("../utils/convertTimeStamp");

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

module.exports = {
  updateStudentService,
};
