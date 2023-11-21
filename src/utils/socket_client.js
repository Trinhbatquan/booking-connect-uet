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

const emit_new_notification_update_booking_for_student = (data) => {
  socket.emit("new_notify_update_booking_for_student", {
    data,
  });
};

export {
  emit_create_booking,
  emit_new_notification_from_system,
  emit_new_notification_update_booking_for_student,
};
