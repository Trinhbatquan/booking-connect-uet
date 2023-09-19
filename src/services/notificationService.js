const db = require("../models");
const { convertTimeStamp } = require("../utils/convertTimeStamp");

const getNotificationService = (managerId, roleManager) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Notification.findAll({
        where: {
          managerId,
          roleManager,
        },
        include: [
          {
            model: db.Booking,
            as: "bookingData",
          },
        ],
        nest: true,
        raw: true,
      });
      resolve({
        codeNUmber: 0,
        notify: data,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

module.exports = {
  getNotificationService,
};
