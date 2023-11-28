const { Op } = require("sequelize");
const { sql } = require("@sequelize/core");
const db = require("../models");
const Sequelize = require("sequelize");
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

const similarityThreshold = 0.45;

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
          include: [
            {
              model: db.AllCode,
              as: "timeDataBooking",
              attributes: ["valueEn", "valueVn"],
            },
          ],
          raw: true,
          nest: true,
        });
        await db.Notification.create({
          managerId,
          roleManager,
          type_notification: "new_book",
          bookingId: bookingData?.id,
        });

        //send email for student to notify about new appointment.
        const student = await db.Student.findOne({
          where: { id: studentId },
          attributes: {
            exclude: [
              "id",
              "password",
              "address",
              "gender",
              "faculty",
              "classroom",
              "phoneNumber",
              "image",
              "verified",
              "createdAt",
              "updatedAt",
            ],
          },
        });
        let manager;
        if (roleManager === "R5") {
          manager = await db.Teacher.findOne({
            where: {
              id: managerId,
            },
            attributes: {
              exclude: [
                "id",
                "password",
                "gender",
                "positionId",
                "phoneNumber",
                "facultyId",
                "code_url",
                "note",
                "image",
                "createdAt",
                "updatedAt",
              ],
            },
          });
        } else {
          manager = await db.OtherUser.findOne({
            where: {
              id: managerId,
            },
            attributes: {
              exclude: [
                "id",
                "password",
                "phoneNumber",
                "code_url",
                "note",
                "createdAt",
                "updatedAt",
              ],
            },
          });
        }
        await sendEmail({
          email: student?.email,
          studentData: student,
          subject: "Bạn đã đặt một lịch hẹn mới.",
          type: "new-appointment",
          managerData: manager,
          bookingData: {
            date: moment(dateFormat).format("dddd - DD/MM/YYYY"),
            timeType: bookingData?.timeDataBooking.valueVn,
            role: roleManager,
            reason,
            address: manager?.address ? manager.address : "",
          },
        });
        resolve({
          codeNumber: 0,
          type: "create",
          message_en:
            "Take appointment successfully! Please check email and process management into website to know process of your schedule",
          message_vn:
            "Đặt lịch hẹn thành công! Vui lòng kiểm tra email và phần quản lý tiến trình trên website để theo dõi tiến trình đặt lịch của bạn.",
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
  action,
  option,
  avatar
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
          image: avatar,
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
        await db.Notification.create({
          managerId,
          roleManager,
          type_notification: "new_ques",
          bookingId: bookingData?.id,
        });
        //send email to student about new question
        const student = await db.Student.findOne({
          where: { id: studentId },
          attributes: {
            exclude: [
              "id",
              "password",
              "address",
              "gender",
              "faculty",
              "classroom",
              "phoneNumber",
              "image",
              "verified",
              "createdAt",
              "updatedAt",
            ],
          },
        });
        let manager;
        if (roleManager === "R5") {
          manager = await db.Teacher.findOne({
            where: {
              id: managerId,
            },
            attributes: {
              exclude: [
                "id",
                "password",
                "gender",
                "positionId",
                "phoneNumber",
                "facultyId",
                "code_url",
                "note",
                "image",
                "createdAt",
                "updatedAt",
              ],
            },
          });
        } else {
          manager = await db.OtherUser.findOne({
            where: {
              id: managerId,
            },
            attributes: {
              exclude: [
                "id",
                "password",
                "phoneNumber",
                "code_url",
                "note",
                "createdAt",
                "updatedAt",
              ],
            },
          });
        }
        await sendEmail({
          email: student?.email,
          studentData: student,
          subject: "Đặt câu hỏi thành công.",
          type: "new-question",
          managerData: manager,
          bookingData: {
            role: roleManager,
            subjectQuestion: subject,
          },
        });

        resolve({
          codeNumber: 0,
          type: "create",
          message_en:
            "Make question successfully! Please follow email or process management into website to receive answer.",
          message_vn:
            "Đặt câu hỏi thành công! Vui lòng kiểm tra email hoặc phần quản lý tiến trình để nhận được câu trả lời.",
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
        if (option === "directly") {
          await handleSaveQuestion();
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
                    //save question into database
                    await db.Booking.create({
                      statusId: "S5",
                      managerId,
                      roleManager,
                      studentId,
                      subject,
                      question,
                      others,
                      actionId: action,
                      image: avatar,
                      questionSimilarityId: questionData[i]?.id,
                    });
                    //send email
                    const student = await db.Student.findOne({
                      where: { id: studentId },
                      attributes: {
                        exclude: [
                          "id",
                          "password",
                          "address",
                          "gender",
                          "faculty",
                          "classroom",
                          "phoneNumber",
                          "image",
                          "verified",
                          "createdAt",
                          "updatedAt",
                        ],
                      },
                    });
                    let manager;
                    if (roleManager === "R5") {
                      manager = await db.Teacher.findOne({
                        where: {
                          id: managerId,
                        },
                        attributes: {
                          exclude: [
                            "id",
                            "password",
                            "gender",
                            "positionId",
                            "phoneNumber",
                            "facultyId",
                            "code_url",
                            "note",
                            "image",
                            "createdAt",
                            "updatedAt",
                          ],
                        },
                      });
                    } else {
                      manager = await db.OtherUser.findOne({
                        where: {
                          id: managerId,
                        },
                        attributes: {
                          exclude: [
                            "id",
                            "password",
                            "phoneNumber",
                            "code_url",
                            "note",
                            "createdAt",
                            "updatedAt",
                          ],
                        },
                      });
                    }
                    console.log("sent");
                    await sendEmail({
                      email: student?.email,
                      studentData: student,
                      subject:
                        "Cập nhật trạng thái câu hỏi của bạn: Đã được trả lời tự động.",
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
                        "Make question successfully! Answer is sent to your email and process management into website.",
                      message_vn:
                        "Đặt câu hỏi thành công! Câu trả lời đã được gửi qua email và phần quản lý tiến trình trên website của bạn.",
                    });
                  }
                } else {
                  resolve({
                    codeNumber: 0,
                    type: "no-similarity",
                    message_en:
                      "Ohh! This question is not similar with any questions in system. Please switch to send directly.",
                    message_vn:
                      "Ohh! Câu hỏi này không trùng với bất cứ câu hỏi nào của hệ thống. Vui lòng chuyển sang phần gửi trực tiếp.",
                  });
                }
              } else {
                resolve({
                  codeNumber: 0,
                  type: "no-similarity",
                  message_en:
                    "Ohh! This question is not similar with any questions in system. Please switch to send directly.",
                  message_vn:
                    "Ohh! Câu hỏi này không trùng với bất cứ câu hỏi nào của hệ thống. Vui lòng chuyển sang phần gửi trực tiếp.",
                });
              }
            }
          } else {
            resolve({
              codeNumber: 0,
              type: "no-similarity",
              message_en:
                "Ohh! This question is not similar with any questions in system. Please switch to send directly.",
              message_vn:
                "Ohh! Câu hỏi này không trùng với bất cứ câu hỏi nào của hệ thống. Vui lòng chuyển sang phần gửi trực tiếp.",
            });
          }
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
        if (type === "cancel" && actionId === "A1") {
          data.reasonCancelSchedule = reasonCancel;
        }
        await data.save();
        if (actionId === "A2") {
          await db.Answer.create({ answer, questionId: data.id });
        }

        //send email notification to students and create notification
        const student = await db.Student.findOne({
          where: { id: studentId },
          attributes: {
            exclude: [
              "id",
              "password",
              "address",
              "gender",
              "faculty",
              "classroom",
              "phoneNumber",
              "image",
              "verified",
              "createdAt",
              "updatedAt",
            ],
          },
        });
        let manager;
        if (roleManager === "R5") {
          manager = await db.Teacher.findOne({
            where: {
              id: managerId,
            },
            attributes: {
              exclude: [
                "id",
                "password",
                "gender",
                "positionId",
                "phoneNumber",
                "facultyId",
                "code_url",
                "note",
                "image",
                "createdAt",
                "updatedAt",
              ],
            },
          });
        } else {
          manager = await db.OtherUser.findOne({
            where: {
              id: managerId,
            },
            attributes: {
              exclude: [
                "id",
                "password",
                "phoneNumber",
                "code_url",
                "note",
                "createdAt",
                "updatedAt",
              ],
            },
          });
        }
        if (type === "process") {
          //email success
          await db.Notification.create({
            studentId,
            type_notification: "appointment_approved",
            bookingId: data?.id,
          });
          await sendEmail({
            email: student?.email,
            studentData: student,
            subject: "Cập nhật trạng thái lịch hẹn: Đã được chấp nhận",
            type: "booking-schedule-success",
            managerData: manager,
            bookingData: {
              date: moment(date).format("dddd - DD/MM/YYYY"),
              time,
              role: roleManager,
            },
          });
        } else if (type === "cancel") {
          await db.Notification.create({
            studentId,
            type_notification: "appointment_canceled",
            bookingId: data?.id,
          });
          await sendEmail({
            email: student?.email,
            studentData: student,
            subject: "Cập nhật trạng thái lịch hẹn: Đã bị huỷ bỏ",
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
            await db.Notification.create({
              studentId,
              type_notification: "appointment_finished",
              bookingId: data?.id,
            });
            await sendEmail({
              email: student?.email,
              studentData: student,
              subject: "Cập nhật trạng thái lịch hẹn: Đã hoàn thành",
              type: "booking-schedule-done",
              managerData: manager,
              bookingData: {
                date: moment(date).format("dddd - DD/MM/YYYY"),
                time,
                role: roleManager,
              },
            });
          } else {
            await db.Notification.create({
              studentId,
              type_notification: "question_answered",
              bookingId: data?.id,
            });
            await sendEmail({
              email: student?.email,
              studentData: student,
              subject: "Cập nhật trạng thái câu hỏi: Đã được trả lời",
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
        resolve({
          codeNumber: 1,
          message_en: "Error. Please contact with admin.",
          message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllBookingStudentService = ({ studentId, actionId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Booking.findAll({
        where: {
          studentId: +studentId,
          actionId,
        },

        include: [
          {
            model: db.Teacher,
            as: "teacherData",
            attributes: [
              "email",
              "fullName",
              "positionId",
              "phoneNumber",
              "address",
            ],
          },
          {
            model: db.OtherUser,
            as: "otherUserData",
            attributes: ["email", "fullName", "phoneNumber", "address"],
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
        studentBooking: data,
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
  updateStatusBookingByManagerService,
  getAllBookingStudentService,
};

// include: [
// Sequelize.literal('"Booking"."roleManager" === "R5"')
//   ? {
//       model: db.Teacher,
//       as: "teacherData",
//       // where: {
//       //   "$Booking.roleManager$": "R5",
//       // },
//       attributes: [
//         "email",
//         "fullName",
//         "positionId",
//         // "faculty",
//         "phoneNumber",
//         "address",
//       ],
//       // required: Sequelize.literal('"Booking"."roleManager" = "R5"'),
//     }
//   : {
//       model: db.OtherUser,
//       as: "otherUserData",
//       // where: {
//       //   $or: [
//       //     // { "$Booking.roleManager$": "R2" },
//       //     { "$Booking.roleManager$": "R4" },
//       //     { "$Booking.roleManager$": "R6" },
//       //   ],
//       // },
//       attributes: ["email", "fullName", "phoneNumber", "address"],
//       // required: Sequelize.literal(
//       //   '"Booking"."roleManager" IN ("R2", R4", "R6")'
//       // ),
//     }
// include: [
//   sql`(SELECT (*) FROM Teacher AS teacherData WHERE teacherData."id" = Booking.managerId and Booking.roleManager === "R5")`,
// ],
// Sequelize.literal(
//   `(SELECT (*) FROM OtherUser AS otherUserData WHERE otherUserData."id" = Booking.managerId and Booking.roleManager IN ("R2", "R4", "R5")`
// ),

//   include: [
//   {
//     model: db.AllCode,
//     as: "timeDataBooking",
//     attributes: ["valueEn", "valueVn"],
//   },
// ],
