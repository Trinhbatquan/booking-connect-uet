const { Op } = require("sequelize");
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
          statusId: "S2",
        },
        defaults: {
          statusId: "S2",
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
          message:
            "You can take appointment after your previous appointment is done!",
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

const createQuestionService = (
  studentId,
  managerId,
  roleManager,
  subject,
  question,
  others,
  action
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // One Student just allow to book one answer with one department
      //at the same time
      const [user, created] = await db.Booking.findOrCreate({
        where: {
          managerId,
          roleManager,
          studentId,
          statusId: "S2",
          actionId: action,
        },
        defaults: {
          statusId: "S2",
          managerId,
          roleManager,
          studentId,
          subject,
          question,
          others,
          actionId: action,
        },
      });
      console.log(created);
      if (created) {
        resolve({
          codeNumber: 0,
          type: "create",
          message: "Make question successfully!",
        });
      } else if (!created) {
        resolve({
          codeNumber: 0,
          type: "other",
          message:
            "You can make question after your previous question is answered!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllBookingByManagerAndActionService = (
  managerId,
  roleManager,
  actionId,
  statusId
) => {
  console.log(statusId);
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Booking.findAll({
        where: {
          managerId,
          roleManager,
          actionId,
          statusId,
        },
        include: [
          {
            model: db.Student,
            as: "studentData",
            attributes: ["id", "email", "fullName", "faculty", "phoneNumber"],
          },
          {
            model: db.AllCode,
            as: "timeDataBooking",
            attributes: ["valueEn", "valueVn"],
          },
        ],
        order: [
          ["createdAt", "DESC"],
          ["updatedAt", "DESC"],
        ],
        raw: true,
        nest: true,
      });
      resolve({
        codeNumber: 0,
        allBooking: data,
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createBookingScheduleService,
  getBookingScheduleService,
  getAllBookingByManagerAndActionService,
  createQuestionService,
};
