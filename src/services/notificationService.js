const db = require("../models");
const { convertTimeStamp } = require("../utils/convertTimeStamp");

const getNotificationService = (managerId, roleManager, page) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pageSize = 8;
      const pageCurrent = page || 1;
      const totalDocument = await db.Notification.count({
        where: {
          managerId,
          roleManager,
        },
      });
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
          {
            model: db.AllCode,
            as: "notificationType",
            attributes: ["valueEn", "valueVn"],
          },
        ],
        offset: (pageCurrent - 1) * pageSize,
        limit: 8,
        nest: true,
        raw: true,
        order: [
          ["updatedAt", "DESC"],
          ["createdAt", "DESC"],
        ],
      });
      resolve({
        codeNumber: 0,
        notify: data,
        pageCurrent,
        pageTotal: Math.ceil(totalDocument / pageSize),
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
