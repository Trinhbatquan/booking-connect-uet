const {
  createBookingScheduleService,
  getBookingScheduleService,
  getAllBookingByManagerAndActionService,
  createQuestionService,
} = require("../services/bookingService");

//homepage
const createBookingScheduleController = async (req, res) => {
  try {
    const { studentId, managerId, roleManager, date, timeType, reason } =
      req.body;
    if (
      !studentId ||
      !managerId ||
      !roleManager ||
      !date ||
      !timeType ||
      !reason
    ) {
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

const createQuestionController = async (req, res) => {
  try {
    const { studentId, managerId, roleManager, subject, question, others } =
      req.body;
    if (!studentId || !managerId || !roleManager || !subject || !question) {
      return res.status(501).json({
        codeNumber: 1,
        message: "Missing parameters",
      });
    } else {
      const action = "A2";
      const data = await createQuestionService(
        studentId,
        managerId,
        roleManager,
        subject,
        question,
        others,
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

//system
const getAllBookingByManagerAndAction = async (req, res) => {
  try {
    const { managerId, roleManager, actionId, statusId } = req.query;
    if (!managerId || !roleManager || !actionId || !statusId) {
      return res.status(501).json({
        codeNumber: 1,
        message: "Missing parameters",
      });
    }
    const data = await getAllBookingByManagerAndActionService(
      managerId,
      roleManager,
      actionId,
      statusId
    );
    return res.status(200).json(data);
  } catch (e) {
    console.log("get all booking schedule " + e);
    res.status(501).json({
      codeNumber: -1,
      message:
        "Not get all booking schedule by managerId, roleManager and actionId",
    });
  }
};

module.exports = {
  createBookingScheduleController,
  getBookingScheduleController,
  getAllBookingByManagerAndAction,
  createQuestionController,
};
