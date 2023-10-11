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
  sendEmailToUpdatePassHomePageController,
  verifyAndUpdatePasswordHomePageController,
} = require("../controllers/userController");
const { getAllCodeByType } = require("../controllers/allCodeController");
const {
  getTeacherController,
  getOneTeacherController,
  createTeacherInfoController,
  getTeacherInfoController,
  getOneTeacherByFacultyController,
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
  createBookingScheduleController,
  getBookingScheduleController,
  getAllBookingByManagerAndAction,
  createQuestionController,
  updateStatusBookingScheduleByManagerController,
} = require("../controllers/bookingController");
const { updateStudentController } = require("../controllers/studentController");
const {
  checkExpiredToken,
  protectAdminToken,
  protectUserToken,
} = require("../middleware/protectToken");

const { getNotificationController } = require("../controllers/notification");

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
  router.get("/api/teacher/by-faculty", getOneTeacherByFacultyController); //teacher

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
    (req, res, next) => protectUserToken(req, res, next, "otherUser"),
    createScheduleController
  );
  router.get("/api/get-schedule-system", getScheduleSystemController);
  router.post(
    "/api/delete-schedule",
    (req, res, next) => checkExpiredToken(req, res, next, "system"),
    (req, res, next) => protectUserToken(req, res, next, "otherUser"),
    deleteScheduleController
  );

  router.get("/api/get-all-booking-system", getAllBookingByManagerAndAction);
  router.put(
    "/api/update-status-booking-schedule",
    (req, res, next) => checkExpiredToken(req, res, next, "system"),
    (req, res, next) => protectUserToken(req, res, next, "otherUser"),
    updateStatusBookingScheduleByManagerController
  );

  //manager api
  router.get("/api/notification", getNotificationController);

  //home page api
  router.post("/api/homepage/register", registerHomePage);
  router.post("/api/homepage/login", loginHomePage);
  router.get("/api/homepage/logout", logoutHomePageController);
  router.get("/api/users/verify/emailUrl", verificationEmailController);
  router.get("/api/get-schedule", getScheduleByIdAndDateController);
  router.post(
    "/api/create-booking-schedule",
    (req, res, next) => checkExpiredToken(req, res, next, "student"),
    (req, res, next) => protectUserToken(req, res, next, "student"),
    createBookingScheduleController
  );
  router.put(
    "/api/update-student",
    (req, res, next) => checkExpiredToken(req, res, next, "student"),
    (req, res, next) => protectUserToken(req, res, next, "student"),
    updateStudentController
  );
  router.get("/api/get-booking-schedule", getBookingScheduleController);
  router.post(
    "/api/create-question",
    (req, res, next) => checkExpiredToken(req, res, next, "student"),
    (req, res, next) => protectUserToken(req, res, next, "student"),
    createQuestionController
  );

  //forgotEmail
  router.get(
    "/api/homepage/forgot-pass",
    sendEmailToUpdatePassHomePageController
  );
  router.post(
    "/api/homepage/update-pass-forgot",
    verifyAndUpdatePasswordHomePageController
  );

  return app.use("/", router);
};

module.exports = {
  initWebRoutes,
};
