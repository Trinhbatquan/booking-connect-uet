const { io } = require("../index");

const connectSocket = (io) => {
  io.on("connect", (socket) => {
    //check_connect_client
    socket.emit("connected", null);

    //listen for creating booking
    socket.on("create_booking", (data) => {
      //notify the booking for user
      socket.broadcast.emit("new_booking", {
        ...data,
      });
    });

    //new notification from system
    socket.on("new_notify_from_system", ({ data }) => {
      //notify the booking for user
      socket.broadcast.emit("new_notification_system", {
        ...data,
      });
    });

    //new notification update booking for student
    socket.on("new_notify_update_booking_for_student", ({ data }) => {
      //notify the booking for user
      console.log(data);
      socket.broadcast.emit(
        "new_notification_for_student_about_update_booking",
        {
          ...data,
        }
      );
    });
  });
};

module.exports = {
  connectSocket,
};
