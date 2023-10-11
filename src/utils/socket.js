const { io } = require("../index");

const connectSocket = (io) => {
  io.on("connect", (socket) => {
    //check_connect_client
    socket.emit("connected", null);

    //listen for creating booking
    socket.on("create_booking", (data) => {
      //notify the booking for user
      console.log("noti");
      socket.broadcast.emit("new_booking", {
        ...data,
      });
      console.log("noti2");
    });
  });
};

module.exports = {
  connectSocket,
};
