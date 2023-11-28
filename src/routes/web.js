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
  sendEmailToUpdatePassSystemController,
  verifyAndUpdatePasswordSystemController,
  updatePasswordSystemController,
} = require("../controllers/userController");
const { getAllCodeByType } = require("../controllers/allCodeController");
const {
  getTeacherSystemController,
  getTeacherHomePageController,
  getOneTeacherController,
  createTeacherInfoController,
  getTeacherInfoController,
  getOneTeacherByFacultyController,
  getTeacherBySearchController,
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
  getAllBookingStudentController,
} = require("../controllers/bookingController");
const {
  // updateStudentController,
  getStudentController,
  updateProfileStudentController,
  updatePasswordStudentController,
} = require("../controllers/studentController");
const {
  checkExpiredToken,
  protectAdminToken,
  protectUserToken,
} = require("../middleware/protectToken");

const {
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
} = require("../controllers/notification");

const {
  getPreviousFeedback,
  saveFeedbackController,
  getFeedbackController,
} = require("../controllers/student_feedback");

const {
  createNewsController,
  updateNewsController,
  deleteNewsController,
  getNewsController,
  getNewsLimitedController,
  getOneNewsController,
} = require("../controllers/newsController");

const { getAnswerController } = require("../controllers/answerController");

let router = express.Router();

const initWebRoutes = (app) => {
  //login api
  router.post("/api/system/login", loginSystem);
  router.get("/api/system/logout", logoutSystemController);
  router.get("/api/system/forgot-pass", sendEmailToUpdatePassSystemController);
  router.post(
    "/api/system/update-pass-forgot",
    verifyAndUpdatePasswordSystemController
  );
  router.put(
    "/api/update-password-system",
    (req, res, next) => checkExpiredToken(req, res, next, "system"),
    (req, res, next) => protectUserToken(req, res, next, "otherUser"),
    updatePasswordSystemController
  );

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

  router.get("/api/teacher", getTeacherSystemController); //teacher
  router.get("/api/teacher_by_search", getTeacherBySearchController); //teacher
  router.get("/api/teacher_homepage", getTeacherHomePageController); //teacher
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
  router.get("/api/all_notify_by_type", getAllNotifyByTypeController);
  router.post(
    "/api/create_notify_system",
    (req, res, next) => checkExpiredToken(req, res, next, "system"),
    protectAdminToken,
    createNotifySystemController
  );
  router.put(
    "/api/update_notify_system",
    (req, res, next) => checkExpiredToken(req, res, next, "system"),
    protectAdminToken,
    updateNotifySystemController
  );
  router.delete(
    "/api/delete_notify_system",
    (req, res, next) => checkExpiredToken(req, res, next, "system"),
    protectAdminToken,
    deleteNotifySystemController
  );

  //news
  router.post(
    "/api/create-news",
    (req, res, next) => checkExpiredToken(req, res, next, "system"),
    protectAdminToken,
    createNewsController
  );
  router.put(
    "/api/update-news",
    (req, res, next) => checkExpiredToken(req, res, next, "system"),
    protectAdminToken,
    updateNewsController
  );
  router.delete(
    "/api/delete-news",
    (req, res, next) => checkExpiredToken(req, res, next, "system"),
    protectAdminToken,
    deleteNewsController
  );
  router.get("/api/get-news", getNewsController);
  router.get("/api/get-news-limited", getNewsLimitedController);
  router.get("/api/one-news", getOneNewsController);

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
  router.post(
    "/api/get-student",
    (req, res, next) => checkExpiredToken(req, res, next, "student"),
    (req, res, next) => protectUserToken(req, res, next, "student"),
    getStudentController
  );
  // router.put(
  //   "/api/update-student",
  //   (req, res, next) => checkExpiredToken(req, res, next, "student"),
  //   (req, res, next) => protectUserToken(req, res, next, "student"),
  //   updateStudentController
  // );
  router.put(
    "/api/update-profile-student",
    (req, res, next) => checkExpiredToken(req, res, next, "student"),
    (req, res, next) => protectUserToken(req, res, next, "student"),
    updateProfileStudentController
  );
  router.put(
    "/api/update-password-student",
    (req, res, next) => checkExpiredToken(req, res, next, "student"),
    (req, res, next) => protectUserToken(req, res, next, "student"),
    updatePasswordStudentController
  );
  router.get("/api/get-booking-schedule", getBookingScheduleController);

  router.post(
    "/api/create-question",
    (req, res, next) => checkExpiredToken(req, res, next, "student"),
    (req, res, next) => protectUserToken(req, res, next, "student"),
    createQuestionController
  );

  router.get("/api/get-feedback", getFeedbackController);
  router.get("/api/previous-feedback", getPreviousFeedback);
  router.post(
    "/api/save-feedback",
    (req, res, next) => checkExpiredToken(req, res, next, "student"),
    (req, res, next) => protectUserToken(req, res, next, "student"),
    saveFeedbackController
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

  router.get(
    "/api/get-notification-homePage-limited",
    getNotificationHomePageLimited
  );

  router.get("/api/get-count-new-notify", getCountNewNotifyController);
  router.get("/api/update-to-old-notify", updateToOldNotifyController);
  router.post(
    "/api/delete-notify",
    (req, res, next) =>
      req?.type === "student"
        ? checkExpiredToken(req, res, next, "student")
        : checkExpiredToken(req, res, next, "system"),
    (req, res, next) =>
      req?.type === "student"
        ? protectUserToken(req, res, next, "student")
        : protectUserToken(req, res, next, "otherUser"),
    deleteNotifyController
  );

  router.get("/api/get-one-notify", getOneNotifyHomePageController);

  router.get("/api/get-all-booking-student", getAllBookingStudentController);

  router.get("/api/get-answer-by-id", getAnswerController);

  return app.use("/", router);
};

module.exports = {
  initWebRoutes,
};
