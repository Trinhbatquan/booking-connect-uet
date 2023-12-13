const { set } = require("lodash");
const { io } = require("../index");
const moment = require("moment");
const sendEmail = require("./sendEmail");
const db = require("../models");
const { convertTimeStamp } = require("./convertTimeStamp");



let isIntervalRunning = false;




const connectSocket = (io) => {
  io.on("connect",(socket) => {
    console.log("connect")
    //check_connect_client
    socket.emit("connected",null);

    //listen for creating booking
    socket.on("create_booking",(data) => {
      //notify the booking for user
      console.log("--------------------")
      console.log("--------------------")
      console.log("--------------------")
      socket.broadcast.emit("new_booking",{
        ...data,
      });
    });

    //new notification from system
    socket.on("new_notify_from_system",({ data }) => {
      //notify the booking for user
      socket.broadcast.emit("new_notification_system",{
        ...data,
      });
    });

    //new notification update booking for student
    socket.on("new_notify_update_booking_for_student",({ data }) => {
      //notify the booking for user
      console.log(data);
      socket.broadcast.emit(
        "new_notification_for_student_about_update_booking",
        {
          ...data,
        }
      );
    });

    if (!isIntervalRunning) {
      checkingBooking();
      setInterval(checkingBooking,24 * 60 * 60 * 1000);
      isIntervalRunning = true;
    }

    async function checkingBooking() {
      const compareDay = moment(new Date()).add(1,"days").format("DD-MM-YYYY");

      const data = await db.Booking.findAll({
        where: {
          actionId: "A1",
          statusId: "S2",
          date: convertTimeStamp(compareDay),
        },
        include: [
          {
            model: db.AllCode,
            as: "timeDataBooking",
            attributes: ["valueEn","valueVn"],
          },
        ],
        raw: true,
        nest: true,
      });
      console.log(data);

      if (data?.length > 0) {
        //send email and add notification + socket realtime
        data.forEach(async (item) => {
          //add
          await db.Notification.bulkCreate([
            {
              studentId: item.studentId,
              type_notification: "check_event",
              bookingId: item.id,
            },
            {
              managerId: item.managerId,
              roleManager: item.roleManager,
              type_notification: "check_event",
              bookingId: item.id,
            },
          ]);

          //get data
          let managerData = [];
          if (item.roleManager === "R5") {
            managerData = await db.Teacher.findOne({
              where: {
                id: item.managerId,
              },
              attributes: {
                exclude: [
                  "password",
                  "gender",
                  "positionId",
                  "phoneNumber",
                  "facultyId",
                  "note",
                  "image",
                ],
              },
            });
          } else {
            managerData = await db.OtherUser.findOne({
              where: {
                id: item.managerId,
                roleId: item.roleManager,
              },
              attributes: {
                exclude: ["password","roleId","phoneNumber"],
              },
            });
          }

          const studentData = await db.Student.findOne({
            where: {
              id: item?.studentId,
            },
            attributes: {
              exclude: [
                "password",
                "roleId",
                "password",
                "phoneNumber",
                "image",
                "verified",
                "classroom",
                "faculty",
                "gender",
              ],
            },
          });

          //send email to manager
          await sendEmail({
            email: managerData.email,
            studentData,
            subject: "Thông báo về lịch hẹn của bạn.",
            type: "notify-checking-manager",
            managerData,
            bookingData: {
              role: item.roleManager,
              reason: item?.reason,
              date: moment(item?.date).format("dddd - DD/MM/YYYY"),
              timeType: item?.timeDataBooking.valueVn,
            },
            address: managerData.address,
          });

          //send email to student
          await sendEmail({
            email: studentData.email,
            studentData,
            subject: "Thông báo về lịch hẹn của bạn.",
            type: "notify-checking-student",
            managerData,
            bookingData: {
              role: item.roleManager,
              reason: item?.reason,
              date: moment(item?.date).format("dddd - DD/MM/YYYY"),
              timeType: item?.timeDataBooking.valueVn,
              address: managerData.address,
            },
          });

          //emit socket realtime
          // await io.on("connection",(socket) => {
          //   console.log("event")
          socket.broadcast.emit("check_event_booking_schedule_coming",{
            managerId: item.managerId,
            roleManager: item.roleManager,
            studentId: item?.studentId,
          });
        });
        // });
      }
    };

  });
};

module.exports = {
  connectSocket,
};
