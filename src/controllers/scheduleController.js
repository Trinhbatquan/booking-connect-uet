const {
  createScheduleService,
  getScheduleByIdAndDateService,
} = require("../services/scheduleService");

const createScheduleController = async (req, res) => {
  const dataArr = req.body;
  let check = true;

  if (dataArr?.length > 0) {
    for (let i = 0; i < dataArr.length; i++) {
      if (!dataArr[i]?.userId || !dataArr[i]?.date || !dataArr[i]?.timeType) {
        check = false;
        break;
      } else {
        dataArr[i].actionId = "A1";
      }
    }
    if (!check) {
      return res.status(404).json({
        codeNumber: 1,
        message: "Missing parameters",
      });
    } else {
      try {
        const data = await createScheduleService(dataArr);
        return res.status(200).json({
          codeNumber: 0,
          message: "Create Schedule Succeed",
        });
      } catch (e) {
        return res.status(200).json({
          codeNumber: -1,
          message: "Not Create Schedule",
        });
      }
    }
  }
};

const getScheduleByIdAndDateController = async (req, res) => {
  const { userId, date } = req.query;
  if (!userId || !date) {
    return res.status(404).json({
      codeNumber: 1,
      message: "Missing parameters",
    });
  } else {
    try {
      const data = await getScheduleByIdAndDateService(userId, date);
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
};
