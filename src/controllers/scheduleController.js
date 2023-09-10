const {
  createScheduleService,
  getScheduleByIdAndDateService,
  getScheduleSystemService,
  deleteScheduleService,
} = require("../services/scheduleService");

//system
const createScheduleController = async (req, res) => {
  const { scheduleData, action } = req.body;
  let check = true;

  if (scheduleData?.length > 0) {
    for (let i = 0; i < scheduleData.length; i++) {
      if (
        !scheduleData[i]?.managerId ||
        !scheduleData[i]?.date ||
        !scheduleData[i]?.timeType ||
        !scheduleData[i]?.roleManager
      ) {
        check = false;
        break;
      } else {
        scheduleData[i].actionId = "A1";
      }
    }
    if (!check || !action) {
      return res.status(404).json({
        codeNumber: 1,
        message: "Missing parameters",
      });
    } else {
      try {
        const data = await createScheduleService(scheduleData, action);
        return res.status(200).json(data);
      } catch (e) {
        console.log(e);
        return res.status(200).json({
          codeNumber: -1,
          message: "Not Create Schedule",
        });
      }
    }
  }
};
const getScheduleSystemController = async (req, res) => {
  const { managerId, roleManager } = req.query;
  if (!managerId || !roleManager) {
    return res.status(404).json({
      codeNumber: 1,
      message: "Missing parameters",
    });
  } else {
    try {
      const data = await getScheduleSystemService(managerId, roleManager);
      return res.status(200).json({
        codeNumber: 0,
        message: "Get Schedule Succeed",
        schedule_user: data,
      });
    } catch (e) {
      console.log("error \n" + e);
      return res.status(200).json({
        codeNumber: -1,
        message: "Not Get Schedule",
      });
    }
  }
};

const deleteScheduleController = async (req, res) => {
  const { managerId, date, roleManager } = req.query;
  if (!managerId || !date || !roleManager) {
    return res.status(404).json({
      codeNumber: 1,
      message: "Missing parameters",
    });
  } else {
    try {
      await deleteScheduleService(managerId, date, roleManager);
      return res.status(200).json({
        codeNumber: 0,
        message: "Delete Successfully",
      });
    } catch (e) {
      return res.status(200).json({
        codeNumber: -1,
        message: "Not Get Schedule",
      });
    }
  }
};

//homepage
const getScheduleByIdAndDateController = async (req, res) => {
  const { managerId, date, roleManager } = req.query;
  if (!managerId || !date || !roleManager) {
    return res.status(404).json({
      codeNumber: 1,
      message: "Missing parameters",
    });
  } else {
    try {
      const data = await getScheduleByIdAndDateService(
        managerId,
        date,
        roleManager
      );
      return res.status(200).json({
        codeNumber: 0,
        message: "Get Schedule Succeed",
        schedule: data,
      });
    } catch (e) {
      console.log("error \n" + e);
      return res.status(200).json({
        codeNumber: -1,
        message: "Not Get Schedule",
      });
    }
  }
};

module.exports = {
  createScheduleController,
  getScheduleByIdAndDateController,
  getScheduleSystemController,
  deleteScheduleController,
};
