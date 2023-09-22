const { Op } = require("sequelize");
const db = require("../models");
const { convertTimeStamp } = require("../utils/convertTimeStamp");
const sendEmail = require("../utils/sendEmail");
const moment = require("moment");
require("moment/locale/vi");

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
          statusId: ["S1", "S2"],
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
        //save notification
        const bookingData = await db.Booking.findOne({
          where: {
            managerId,
            roleManager,
            actionId: "A1",
            statusId: ["S1"],
            studentId,
            date: dateFormat,
            timeType,
          },
        });
        await db.Notification.create({
          managerId,
          roleManager,
          type_notification: "N",
          bookingId: bookingData?.id,
          title: "new_schedule",
          status: "NR",
        });
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

const getBookingScheduleService = (managerId, roleManager, date, actionId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dateFormat = convertTimeStamp(date);
      const data = await db.Booking.findAll({
        where: {
          managerId,
          roleManager,
          date: dateFormat,
          actionId,
          // statusId: ["S1", "S2", "S3", "S4"],
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
          statusId: ["S1"],
          actionId: action,
        },
        defaults: {
          statusId: "S1",
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
        const bookingData = await db.Booking.findOne({
          where: {
            managerId,
            roleManager,
            studentId,
            actionId: "A2",
            statusId: ["S1"],
          },
        });
        await db.Notification.create({
          managerId,
          roleManager,
          type_notification: "N",
          bookingId: bookingData?.id,
          title: "new_question",
          status: "NR",
        });
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

const updateStatusBookingByManagerService = ({
  managerId,
  roleManager,
  studentId,
  actionId,
  date,
  timeType,
  time,
  type,
  reasonCancel,
  answer,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Booking.findOne({
        where: {
          managerId,
          roleManager,
          studentId,
          actionId,
          statusId: actionId === "A2" ? "S1" : type === "done" ? "S2" : "S1",
          date: actionId === "A1" ? date : null,
          timeType: actionId === "A1" ? timeType : null,
        },

        raw: false,
      });
      console.log(data);
      if (data) {
        data.statusId =
          type === "done" ? "S3" : type === "process" ? "S2" : "S4";
        await data.save();
        if (actionId === "A2") {
          await db.Answer.create({ answer, questionId: data.id });
        }

        //send email notification to students
        const student = await db.Student.findOne({
          where: { id: studentId },
        });
        let manager;
        if (roleManager === "R5") {
          manager = await db.Teacher.findOne({
            where: {
              id: managerId,
            },
          });
        } else {
          manager = await db.OtherUser.findOne({
            where: {
              id: managerId,
            },
          });
        }
        if (type === "process") {
          //email success
          await sendEmail({
            email: student?.email,
            studentData: student,
            subject: "Thông báo về lịch hẹn của bạn.",
            type: "booking-schedule-success",
            managerData: manager,
            bookingData: {
              date: moment(date).format("dddd - DD/MM/YYYY"),
              time,
              role: roleManager,
            },
          });
        } else if (type === "cancel") {
          await sendEmail({
            email: student?.email,
            studentData: student,
            subject: "Thông báo về lịch hẹn của bạn.",
            type: "booking-schedule-cancel",
            managerData: manager,
            bookingData: {
              date: moment(date).format("dddd - DD/MM/YYYY"),
              time,
              role: roleManager,
              reasonCancel,
            },
          });
        } else if (type === "done") {
          if (actionId === "A1") {
            await sendEmail({
              email: student?.email,
              studentData: student,
              subject: "Thông báo về lịch hẹn của bạn.",
              type: "booking-schedule-done",
              managerData: manager,
              bookingData: {
                date: moment(date).format("dddd - DD/MM/YYYY"),
                time,
                role: roleManager,
              },
            });
          } else {
            await sendEmail({
              email: student?.email,
              studentData: student,
              subject: "Thông báo về câu hỏi của bạn.",
              type: "question-done",
              managerData: manager,
              bookingData: {
                role: roleManager,
                subjectQuestion: data?.subject,
                answer,
              },
            });
          }
        }
        resolve({
          codeNumber: 0,
        });
      } else {
        resolve({ codeNumber: 1, message: "Error" });
      }
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
  updateStatusBookingByManagerService,
};
