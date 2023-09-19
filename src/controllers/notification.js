const { getNotificationService } = require("../services/notificationService");

const getNotificationController = async (req, res) => {
  try {
    const { managerId, roleManager } = req.query;
    const data = await getNotificationService(managerId, roleManager);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      codeNumber: -1,
      message: "Not get notify",
    });
  }
};

module.exports = {
  getNotificationController,
};
