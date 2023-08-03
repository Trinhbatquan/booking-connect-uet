const db = require("../models");
const { convertTimeStamp } = require("../utils/convertTimeStamp");

const createBookingScheduleService = (
  studentId,
  managerId,
  roleManager,
  date,
  timeType,
  reason,
  action
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dateFormat = convertTimeStamp(date);

      // One Student just allow to book one schedule or answer with one department
      //at the same time
      const [user, created] = await db.Booking.findOrCreate({
        where: {
          managerId,
          roleManager,
          studentId,
          actionId: action,
        },
        defaults: {
          statusId: "S1",
          managerId,
          roleManager,
          studentId,
          date: dateFormat,
          timeType,
          actionId: action,
          reason,
        },
      });
      console.log(created);
      if (created) {
        resolve({
          codeNumber: 0,
          type: "create",
          message: "Take appointment successfully!",
        });
      } else if (!created) {
        resolve({
          codeNumber: 0,
          type: "other",
          message: "You just take appointment one time!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getBookingScheduleService = (
  managerId,
  roleManager,
  studentId,
  date,
  actionId
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dateFormat = convertTimeStamp(date);
      const data = await db.Booking.findAll({
        where: {
          managerId,
          roleManager,
          studentId,
          date: dateFormat,
          actionId,
        },
        include: [
          {
            model: db.AllCode,
            as: "timeDataBooking",
            attributes: ["valueEn", "valueVn"],
          },
        ],
        nest: true,
        raw: true,
      });
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createBookingScheduleService,
  getBookingScheduleService,
};
