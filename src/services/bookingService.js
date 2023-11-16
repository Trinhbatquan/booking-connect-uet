const { Op } = require("sequelize");
const db = require("../models");
const { convertTimeStamp } = require("../utils/convertTimeStamp");
const sendEmail = require("../utils/sendEmail");
const moment = require("moment");
require("moment/locale/vi");
const natural = require("natural");

// Hàm tách câu thành tập hợp các từ
function tokenize(text) {
  return new Set(text.toLowerCase().split(" "));
}
// Hàm tính chỉ số Jaccard giữa hai tập hợp
function calculateJaccardIndex(set1, set2) {
  const intersectionSize = new Set([...set1].filter((x) => set2.has(x))).size;
  const unionSize = set1.size + set2.size - intersectionSize;
  return intersectionSize / unionSize;
}

const similarityThreshold = 0.8;

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
          type_notification: "new_book",
          bookingId: bookingData?.id,
        });
        resolve({
          codeNumber: 0,
          type: "create",
          message_en:
            "Take appointment successfully! Please check email regularly to know process of your schedule",
          message_vn:
            "Đặt lịch hẹn thành công! Vui lòng kiểm tra email để theo dõi tiến trình đặt lịch của bạn.",
        });
      } else if (!created) {
        resolve({
          codeNumber: 0,
          type: "other",
          message_en:
            "You can take appointment after your previous appointment is done!",
          message_vn:
            "Bạn có thể đặt lịch sau khi lịch hẹn trước đó của bạn hoàn thành!",
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
      const handleSaveQuestion = async () => {
        const bookingData = await db.Booking.create({
          statusId: "S1",
          managerId,
          roleManager,
          studentId,
          subject,
          question,
          others,
          actionId: action,
        });
        // const data = await db.Booking.findOne({
        //   where: {
        //     managerId,
        //     roleManager,
        //     studentId,
        //     actionId: "A2",
        //     statusId: ["S1"],
        //   },
        // });
        console.log(1);
        console.log(bookingData);
        await db.Notification.create({
          managerId,
          roleManager,
          type_notification: "new_ques",
          bookingId: bookingData?.id,
        });
        resolve({
          codeNumber: 0,
          type: "create",
          message_en:
            "Make question successfully! Answer will be sent to your email.",
          message_vn:
            "Đặt câu hỏi thành công! Câu trả lời sẽ được gửi qua email của bạn.",
        });
      };
      // One Student just allow to book one answer with one department
      //at the same time
      const existPreviousQuestion = await db.Booking.findAll({
        where: {
          managerId,
          roleManager,
          studentId,
          statusId: ["S1"],
          actionId: action,
        },
      });
      if (existPreviousQuestion?.length > 0) {
        console.log(2);
        resolve({
          codeNumber: 0,
          type: "other",
          message_en:
            "You can make question after your previous question is answered!",
          message_vn:
            "Bạn có thể đặt câu hỏi mới sau khi câu hỏi trước đó được trả lời!",
        });
      } else {
        const questionData = await db.Booking.findAll({
          where: {
            managerId,
            roleManager,
            statusId: ["S3"],
            actionId: action,
          },
        });
        console.log("question");
        console.log(questionData);
        if (questionData?.length > 0) {
          console.log(3);
          const newSubjectSet = tokenize(subject);
          const newQuestionSet = tokenize(question);
          for (let i = 0; i < questionData?.length; i++) {
            const subjectSet = tokenize(questionData[i]?.subject);
            const similaritySubject = calculateJaccardIndex(
              newSubjectSet,
              subjectSet
            );
            console.log(similaritySubject);
            if (similaritySubject >= similarityThreshold) {
              const questionSet = tokenize(questionData[i]?.question);
              const similarityQuestion = calculateJaccardIndex(
                newQuestionSet,
                questionSet
              );
              console.log(similarityQuestion);
              if (similarityQuestion >= similarityThreshold) {
                //find Answer and send email
                const answer = await db.Answer.findOne({
                  where: {
                    questionId: questionData[i]?.id,
                  },
                });
                console.log(answer);
                if (answer) {
                  //send email
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
                  console.log("sent");
                  await sendEmail({
                    email: student?.email,
                    studentData: student,
                    subject: "Thông báo về câu hỏi của bạn.",
                    type: "question-done",
                    managerData: manager,
                    bookingData: {
                      role: roleManager,
                      subjectQuestion: subject,
                      answer: answer?.answer,
                    },
                  });
                  resolve({
                    codeNumber: 0,
                    type: "sent",
                    message_en:
                      "Make question successfully! Answer is sent to your email.",
                    message_vn:
                      "Đặt câu hỏi thành công! Câu trả lời đã được gửi qua email của bạn.",
                  });
                }
              } else {
                await handleSaveQuestion();
              }
            } else {
              await handleSaveQuestion();
            }
          }
        } else {
          await handleSaveQuestion();
        }
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
