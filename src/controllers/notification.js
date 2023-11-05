const {
  getNotificationService,
  getAllNotifyByTypeService,
  createNotifySystemService,
  updateNotifySystemService,
  deleteNotifySystemService,
  getNotifyHomePageLimitedService,
  getOneNotifyHomePageService,
} = require("../services/notificationService");

//manager
const getNotificationController = async (req, res) => {
  try {
    const { managerId, roleManager, page, type } = req.query;
    const data = await getNotificationService({
      managerId,
      roleManager,
      page,
      type,
    });
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      codeNumber: -1,
      message: "Not get notify",
    });
  }
};

//system + homepage
const getAllNotifyByTypeController = async (req, res) => {
  try {
    const { type } = req.query;
    const data = await getAllNotifyByTypeService(type);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      codeNumber: -1,
      message: "Not get notify type system",
    });
  }
};

//homepage
const getNotificationHomePageLimited = async (req, res) => {
  try {
    const { page } = req.query;
    const data = await getNotifyHomePageLimitedService({ page });
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      codeNumber: -1,
      message: "Not get notify type homepage limited",
    });
  }
};

const getOneNotifyHomePageController = async (req, res) => {
  try {
    const { code_url } = req.query;
    const data = await getOneNotifyHomePageService({ code_url });
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      codeNumber: -1,
      message: "Not get one notify",
    });
  }
};

const createNotifySystemController = async (req, res) => {
  try {
    const { notifyData } = req.body;
    const data = await createNotifySystemService(notifyData);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      codeNumber: -1,
      message: "not create notify ",
    });
  }
};

const updateNotifySystemController = async (req, res) => {
  try {
    const { notifyData, notifyId } = req.body;
    const data = await updateNotifySystemService(notifyData, notifyId);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      codeNumber: -1,
      message: "not update notify ",
    });
  }
};

const deleteNotifySystemController = async (req, res) => {
  try {
    const { notifyId, roleManager } = req.query;
    const data = await deleteNotifySystemService(notifyId, roleManager);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      codeNumber: -1,
      message: "not delete notify ",
    });
  }
};

module.exports = {
  getNotificationController,
  getAllNotifyByTypeController,
  createNotifySystemController,
  updateNotifySystemController,
  deleteNotifySystemController,
  getNotificationHomePageLimited,
  getOneNotifyHomePageController,
};
