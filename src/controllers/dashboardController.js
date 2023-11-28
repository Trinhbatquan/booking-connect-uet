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
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
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
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

module.exports = {
  getDashboardBookingDataController,
  getDashboardBookingDataByMonthsController,
};
