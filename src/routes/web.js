const express = require("express");
const {
  loginSystem,
  logoutSystemController,
  getUserController,
  createUserController,
  editUserController,
  deleteUserController,
  getUserByRoleController,
  registerHomePage,
  loginHomePage,
  logoutHomePageController,
  verificationEmailController,
} = require("../controllers/userController");
const { getAllCodeByType } = require("../controllers/allCodeController");
const {
  getTeacherController,
  getOneTeacherController,
  createTeacherInfoController,
  getTeacherInfoController,
} = require("../controllers/teacherController");
const {
  createMarkDownController,
  getMarkDownController,
} = require("../controllers/markdownController");
const {
  createScheduleController,
  getScheduleByIdAndDateController,
  getScheduleSystemController,
  deleteScheduleController,
} = require("../controllers/scheduleController");

const {
  checkExpiredToken,
  protectAdminToken,
  protectUserToken,
} = require("../middleware/protectToken");

let router = express.Router();

const initWebRoutes = (app) => {
  //login api
  router.post("/api/system/login", loginSystem);
  router.get("/api/system/logout", logoutSystemController);

  //system administration api
  router.get("/api/user", getUserController); //other user
  router.post(
    "/api/create-new-user",
    (req, res, next) => checkExpiredToken(req, res, next, "system"),
    protectAdminToken,
    createUserController
  ); //type
  router.put(
    "/api/edit-user",
    (req, res, next) => checkExpiredToken(req, res, next, "system"),
    protectAdminToken,
    editUserController
  ); //type
  router.delete(
    "/api/delete-user",
    (req, res, next) => checkExpiredToken(req, res, next, "system"),
    protectAdminToken,
    deleteUserController
  ); //type
  router.get("/api/user_by_role", getUserByRoleController); //other user

  router.get("/api/allCode_type", getAllCodeByType);

  router.get("/api/teacher", getTeacherController); //teacher
  router.get("/api/one-teacher", getOneTeacherController); //teacher

  router.post(
    "/api/create-markdown",
    (req, res, next) => checkExpiredToken(req, res, next, "system"),
    protectAdminToken,
    createMarkDownController
  );
  router.get("/api/get-markdown", getMarkDownController);

  router.post(
    "/api/create-schedule",
    (req, res, next) => checkExpiredToken(req, res, next, "system"),
    protectAdminToken,
    createScheduleController
  );
  router.get("/api/get-schedule-system", getScheduleSystemController);
  router.delete(
    "/api/delete-schedule",
    (req, res, next) => checkExpiredToken(req, res, next, "system"),
    protectAdminToken,
    deleteScheduleController
  );

  // router.post("/api/create-teacher_info", createTeacherInfoController);
  // router.get("/api/get-teacher_info", getTeacherInfoController);

  //home page api
  router.post("/api/homepage/register", registerHomePage);
  router.post("/api/homepage/login", loginHomePage);
  router.get("/api/homepage/logout", logoutHomePageController);
  router.get("/api/users/verify/emailUrl", verificationEmailController);
  router.get("/api/get-schedule", getScheduleByIdAndDateController);

  return app.use("/", router);
};

module.exports = {
  initWebRoutes,
};
