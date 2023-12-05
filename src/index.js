const express = require("express");
const sequelize = require("./config/connectDB");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv/config");
const cors = require("cors");
const configViewEngine = require("./config/viewEngine");
const { initWebRoutes } = require("./routes/web");
const { dashboardApi } = require("./routes/dashboard");
const db = require("./models");
const moment = require("moment");
const { convertTimeStamp } = require("./utils/convertTimeStamp");
const sendEmail = require("./utils/sendEmail");
const app = express();

//socket
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { connectSocket } = require("./utils/socket");
//use

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
    //fix cross blocked
    //response header return access-control-allow-credential: true ==> Oke
  },
});
// io.on("connection", (socket) => {
//   console.log("new client " + socket.id);
//   console.log("new client " + socket.data);

//   socket.emit("connected", null);
// });

// middleware
/* dữ liệu client gửi lên thường là JSON (vd: axios tự động convert từ oj sang json) 
   hay urlencoded khi người dùng nhập form html, vì vậy cần 2 packages để nodejs hiểu các
   dữ liệu trên và chuyển nó vào trong req.body
*/
app.use(bodyParser.json({ limit: "50mb" })); // cho phép phân tích req.body từ JSON
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); //cho phép phân tích dạng form html-unlencoded

//cookie body config
app.use(cookieParser()); //set vào req.cookie một object với key là cookie's name

//config view and file status
configViewEngine(app);

//config client request
app.use(
  cors({
    origin: true,
    credentials: true,
    //fix cross blocked
    //response header return access-control-allow-credential: true ==> Oke
  })
);

//test connect database xampp
const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
connectDatabase();

//check booking once a day

const checkingBooking = async () => {
  const compareDay = moment(new Date()).add(1, "days").format("DD-MM-YYYY");

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
        attributes: ["valueEn", "valueVn"],
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
            exclude: ["password", "roleId", "phoneNumber"],
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
      io.on("connection", (socket) => {
        socket.broadcast.emit("check_event_booking_schedule_coming", {
          managerId: item.managerId,
          roleManager: item.roleManager,
          studentId: item?.studentId,
        });
      });
    });
  }
};

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("App running on port" + " " + PORT);
});

//api
initWebRoutes(app);
dashboardApi(app);
connectSocket(io);
// checkingBooking();
// setInterval(checkingBooking, 24 * 60 * 60 * 1000);
