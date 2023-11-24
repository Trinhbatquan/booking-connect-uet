const {
  getNotificationService,
  getAllNotifyByTypeService,
  createNotifySystemService,
  updateNotifySystemService,
  deleteNotifySystemService,
  getNotifyHomePageLimitedService,
  getOneNotifyHomePageService,
  getCountNewNotifyService,
  updateToOldNotifyService,
  deleteNotifyService,
} = require("../services/notificationService");

//manager + student
const getCountNewNotifyController = async (req, res) => {
  try {
    const { type, studentId, managerId, roleManager } = req.query;
    const data = await getCountNewNotifyService({
      type,
      studentId,
      managerId,
      roleManager,
    });
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      codeNumber: -1,
      message: "Not get notify type homepage limited",
    });
  }
};

//system
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

//system
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

//homepage + manager get notify by id (both system + booking)
const getNotificationHomePageLimited = async (req, res) => {
  try {
    const { page, studentId, typeNotification, managerId, roleManager } =
      req.query;
    const data = await getNotifyHomePageLimitedService({
      page,
      studentId,
      typeNotification,
      managerId,
      roleManager,
    });
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

const updateToOldNotifyController = async (req, res) => {
  try {
    const { type, studentId, managerId, roleManager } = req.query;
    const data = await updateToOldNotifyService({
      type,
      studentId,
      managerId,
      roleManager,
    });
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      codeNumber: -1,
      message: "Not get notify type homepage limited",
    });
  }
};

const deleteNotifyController = async (req, res) => {
  try {
    const { type, studentId, managerId, roleManager, action, notifyId } =
      req.body;
    const data = await deleteNotifyService({
      type,
      studentId,
      managerId,
      roleManager,
      action,
      notifyId,
    });
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      codeNumber: -1,
      message: "Not get notify type homepage limited",
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
  getCountNewNotifyController,
  updateToOldNotifyController,
  deleteNotifyController,
};
