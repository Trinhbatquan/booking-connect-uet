import { socket } from "../index";

const emit_create_booking = (managerId, roleManager, action) => {
  socket.emit("create_booking", {
    managerId,
    roleManager,
    action,
  });
};

const emit_new_notification_from_system = (data) => {
  console.log(data);
  socket.emit("new_notify_from_system", {
    data,
  });
};

export { emit_create_booking, emit_new_notification_from_system };
