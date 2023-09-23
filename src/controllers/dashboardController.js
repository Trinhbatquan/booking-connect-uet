const {
  getDashboardBookingDataService,
  getDashboardBookingDataByMonthsService,
} = require("../services/dashboardService");

const getDashboardBookingDataController = async (req, res) => {
  try {
    const { managerId, roleManager, time } = req.query;
    const data = await getDashboardBookingDataService(
      managerId,
      roleManager,
      time
    );
    return res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(200).send({
      codeNumber: -1,
      message: "Not get dashboard",
    });
  }
};

const getDashboardBookingDataByMonthsController = async (req, res) => {
  try {
    const { managerId, roleManager } = req.query;
    const data = await getDashboardBookingDataByMonthsService(
      managerId,
      roleManager
    );
    return res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(200).send({
      codeNumber: -1,
      message: "Not get dashboard by months",
    });
  }
};

module.exports = {
  getDashboardBookingDataController,
  getDashboardBookingDataByMonthsController,
};
