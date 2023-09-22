const express = require("express");
let router = express.Router();

const {
  checkExpiredToken,
  protectAdminToken,
  protectUserToken,
} = require("../middleware/protectToken");

const {
  getDashboardBookingDataController,
  getDashboardBookingDataByMonthsController,
} = require("../controllers/dashboardController");

const dashboardApi = (app) => {
  router.get(
    "/getDashboard-booking-data-by-user-time",
    // (req, res, next) => checkExpiredToken(req, res, next, "system"),
    // protectAdminToken,
    getDashboardBookingDataController
  );

  router.get(
    "/getDashboard-booking-by-months",
    // (req, res, next) => checkExpiredToken(req, res, next, "system"),
    // protectAdminToken,
    getDashboardBookingDataByMonthsController
  );

  return app.use("/api/dashboard", router);
};

module.exports = {
  dashboardApi,
};
