import { socket } from "../index";

const emit_create_booking = (managerId, roleManager, action) => {
  socket.emit("create_booking", {
    managerId,
    roleManager,
    action,
  });
};

export { emit_create_booking };
