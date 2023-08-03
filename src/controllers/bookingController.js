const {
  createBookingScheduleService,
  getBookingScheduleService,
} = require("../services/bookingService");

const createBookingScheduleController = async (req, res) => {
  try {
    const { studentId, managerId, roleManager, date, timeType, reason } =
      req.body;
    if (!studentId || !departmentId || !date || !timeType || !reason) {
      return res.status(501).json({
        codeNumber: 1,
        message: "Missing parameters",
      });
    } else {
      const action = "A1";
      const data = await createBookingScheduleService(
        studentId,
        managerId,
        roleManager,
        date,
        timeType,
        reason,
        action
      );
      return res.status(200).json(data);
    }
  } catch (e) {
    console.log("booking " + e);
    res.status(501).json({
      codeNumber: -1,
      message: "Not create booking schedule",
    });
  }
};

const getBookingScheduleController = async (req, res) => {
  try {
    const { managerId, roleManager, studentId, date, actionId } = req.query;
    if (!managerId || !roleManager || !studentId || !date || !actionId) {
      return res.status(501).json({
        codeNumber: 1,
        message: "Missing parameters",
      });
    } else {
      const data = await getBookingScheduleService(
        managerId,
        roleManager,
        studentId,
        date,
        actionId
      );
      return res.status(200).json({
        codeNumber: 0,
        message: "Success",
        bookingSchedule: data,
      });
    }
  } catch (e) {
    console.log("get schedule booking " + e);
    res.status(501).json({
      codeNumber: -1,
      message: "Not create booking schedule",
    });
  }
};

module.exports = {
  createBookingScheduleController,
  getBookingScheduleController,
};
