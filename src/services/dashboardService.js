const { Op } = require("sequelize");
const db = require("../models");
const moment = require("moment");

const getDashboardBookingDataService = (roleManager, time) => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const currentDate = new Date().getDate();
      const currentTime = new Date(
        `${currentYear}-${currentMonth + 1}-${currentDate} 00:00:00`
      );
      //   console.log(currentTime);

      let startDate, endDate;
      let dataSchedule, dataQuestion;

      if (time) {
        if (time === "month") {
          startDate = new Date(
            `${currentYear}-${currentMonth + 1}-01 00:00:00`
          );
          endDate =
            currentMonth === 1
              ? new Date(`${currentYear}-${currentMonth + 1}-28 00:00:00`)
              : new Date(`${currentYear}-${currentMonth + 1}-30 00:00:00`);
        } else if (time === "week") {
          const day = currentTime.getDay() - 1;
          console.log(day);

          startDate = new Date(
            currentTime.getTime() - 60 * 60 * 24 * day * 1000
          ); //will return firstday (ie sunday) of the week
          endDate = new Date(startDate.getTime() + 60 * 60 * 24 * 6 * 1000);
        } else if (time === "3month") {
          if (currentMonth + 1 - 3 < 0) {
            startDate = new Date(
              `${currentYear - 1}-${currentMonth + 1 - 2 + 12}-01 00:00:00`
            );
            endDate =
              currentMonth === 1
                ? new Date(`${currentYear}-${currentMonth + 1}-28 00:00:00`)
                : new Date(`${currentYear}-${currentMonth + 1}-30 00:00:00`);
          } else {
            startDate = new Date(
              `${currentYear}-${currentMonth + 1 - 2}-01 00:00:00`
            );
            endDate =
              currentMonth === 1
                ? new Date(`${currentYear}-${currentMonth + 1}-28 00:00:00`)
                : new Date(`${currentYear}-${currentMonth + 1}-30 00:00:00`);
          }
        } else if (time === "3week") {
          const day = currentTime.getDay() - 1;
          startDate = new Date(
            currentTime.getTime() -
              60 * 60 * 24 * day * 1000 -
              60 * 60 * 24 * 14 * 1000
          );
          endDate = new Date(
            startDate.getTime() + 60 * 60 * 24 * (7 * 3 - 1) * 1000
          );
        }
        //get data
        dataSchedule = await db.Booking.findAll({
          where: {
            roleManager: !roleManager ? ["R2", "R4", "R5", "R6"] : roleManager,
            actionId: "A1",
            createdAt: {
              [Op.between]: [startDate, endDate],
            },
          },
          attributes: {
            exclude: [
              "managerId",
              "date",
              "timeType",
              "reason",
              "subject",
              "question",
              "others",
              "studentId",
            ],
          },
        });
        dataQuestion = await db.Booking.findAll({
          where: {
            roleManager: !roleManager ? ["R2", "R4", "R5", "R6"] : roleManager,
            actionId: "A2",
            createdAt: {
              [Op.between]: [startDate, endDate],
            },
          },
          attributes: {
            exclude: [
              "managerId",
              "date",
              "timeType",
              "reason",
              "subject",
              "question",
              "others",
              "studentId",
            ],
          },
        });
      } else {
        //get data
        dataSchedule = await db.Booking.findAll({
          where: {
            roleManager: !roleManager ? ["R2", "R4", "R5", "R6"] : roleManager,
            actionId: "A1",
          },
          attributes: {
            exclude: [
              "managerId",
              "date",
              "timeType",
              "reason",
              "subject",
              "question",
              "others",
              "studentId",
            ],
          },
        });
        dataQuestion = await db.Booking.findAll({
          where: {
            roleManager: !roleManager ? ["R2", "R4", "R5", "R6"] : roleManager,
            actionId: "A2",
          },
          attributes: {
            exclude: [
              "managerId",
              "date",
              "timeType",
              "reason",
              "subject",
              "question",
              "others",
              "studentId",
            ],
          },
        });
      }

      //custom data
      const customDataSchedule = {
        new: [],
        process: [],
        done: [],
        cancel: [],
      };
      const customDataQuestion = {
        new: [],
        done: [],
      };
      dataSchedule.forEach((item) => {
        if (item?.statusId === "S2") {
          customDataSchedule.process.push(item);
        } else if (item?.statusId === "S3") {
          customDataSchedule.done.push(item);
        } else if (item?.statusId === "S4") {
          customDataSchedule.cancel.push(item);
        }
        customDataSchedule.new.push(item);
      });

      dataQuestion.forEach((item) => {
        if (item?.statusId === "S3") {
          customDataQuestion.done.push(item);
        }
        customDataQuestion.new.push(item);
      });

      resolve({
        codeNumber: 0,
        dashboard: {
          customDataQuestion,
          customDataSchedule,
        },
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDashboardBookingDataByMonthsService = (roleManager) => {
  return new Promise(async (resolve, reject) => {
    try {
      let currentMonth = new Date().getMonth();
      let currentYear = new Date().getFullYear();
      //get 8 months since the current month
      const months = [`${currentYear}-${currentMonth + 1}`];
      for (let i = 0; i < 7; i++) {
        if (currentMonth - 1 >= 0) {
          months.push(`${currentYear}-${currentMonth + 1 - 1}`);
          currentMonth -= 1;
        } else {
          months.push(`${currentYear - 1}-12`);
          currentMonth = 11;
          currentYear -= 1;
        }
      }

      //get Data
      let dataSchedule = await db.Booking.findAll({
        where: {
          roleManager: !roleManager ? ["R2", "R4", "R5", "R6"] : roleManager,
          actionId: "A1",
          createdAt: {
            [Op.between]: [
              new Date(`${months[7]}-01`),
              new Date(
                `${currentMonth === 1 ? `${months[0]}-28` : `${months[0]}-30`}`
              ),
            ],
          },
        },
        attributes: {
          exclude: [
            "managerId",
            "date",
            "timeType",
            "reason",
            "subject",
            "question",
            "others",
            "studentId",
          ],
        },
      });

      let dataQuestions = await db.Booking.findAll({
        where: {
          roleManager: !roleManager ? ["R2", "R4", "R5", "R6"] : roleManager,
          actionId: "A2",
          createdAt: {
            [Op.between]: [
              new Date(`${months[7]}-01`),
              new Date(
                `${currentMonth === 1 ? `${months[0]}-28` : `${months[0]}-30`}`
              ),
            ],
          },
        },
        attributes: {
          exclude: [
            "managerId",
            "date",
            "timeType",
            "reason",
            "subject",
            "question",
            "others",
            "studentId",
          ],
        },
      });

      //customData
      const customScheduleMonths = {
        [months[7]]: [],
        [months[6]]: [],
        [months[5]]: [],
        [months[4]]: [],
        [months[3]]: [],
        [months[2]]: [],
        [months[1]]: [],
        [months[0]]: [],
      };
      const customQuestionMonths = {
        [months[7]]: [],
        [months[6]]: [],
        [months[5]]: [],
        [months[4]]: [],
        [months[3]]: [],
        [months[2]]: [],
        [months[1]]: [],
        [months[0]]: [],
      };

      dataSchedule.forEach((item) => {
        const time = new Date(item?.createdAt);
        for (let i = 0; i < months.length; i++) {
          if (`${time.getFullYear()}-${time.getMonth() + 1}` === months[i]) {
            console.log(1);
            customScheduleMonths[months[i]].push(item);
            break;
          }
        }
      });

      dataQuestions.forEach((item) => {
        const time = new Date(item?.createdAt);
        for (let i = 0; i < months.length; i++) {
          if (`${time.getFullYear()}-${time.getMonth() + 1}` === months[i]) {
            console.log(1);
            customQuestionMonths[months[i]].push(item);
            break;
          }
        }
      });

      console.log(customQuestionMonths);
      console.log("--------------------------------------");
      console.log(customScheduleMonths);
      resolve({
        codeNumber: 0,
        dashboardMonths: {
          customScheduleMonths,
          customQuestionMonths,
        },
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getDashboardBookingDataService,
  getDashboardBookingDataByMonthsService,
};
