const db = require("../models");
const { convertTimeStamp } = require("../utils/convertTimeStamp");
const { getDifference } = require("../utils/checkDifferentArray");

//system
const createScheduleService = async (scheduleData, action) => {
  return new Promise(async (resolve, reject) => {
    const userId = scheduleData[0]?.userId;
    const date = scheduleData[0]?.date;
    const dateFormat = convertTimeStamp(date);
    scheduleData.forEach((data) => {
      data.date = convertTimeStamp(data.date);
    });
    try {
      if (action === "create") {
        await db.Schedule.bulkCreate(scheduleData);
        resolve({
          codeNumber: 0,
          message: "create",
        });
      } else {
        await db.Schedule.destroy({
          where: {
            userId,
            date: dateFormat,
          },
        });
        await db.Schedule.bulkCreate(scheduleData);
        resolve({
          codeNumber: 0,
          message: "update",
        });
      }
      //check exist
      // const queryArrayInDb = await db.Schedule.findAll({
      //   where: {
      //     userId,
      //     date: dateFormat,
      //   },
      //   attributes: ["userId", "date", "timeType", "actionId"],
      // });
      //convert timeStamp
      // dataArr.forEach((data) => {
      //   data.date = convertTimeStamp(data.date);
      // });
      //check different
      // let differentArr = [];
      // differentArr = getDifference(dataArr, queryArrayInDb);
      // console.log(differentArr);
      // if (differentArr) {
      //   await db.Schedule.bulkCreate(differentArr);
      //   resolve();
      // }
    } catch (e) {
      reject(e);
    }
  });
};

const getScheduleSystemService = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Schedule.findAll({
        where: {
          userId,
        },
        include: [
          {
            model: db.AllCode,
            as: "timeData",
            attributes: ["valueEn", "valueVn"],
          },
        ],
        // attributes: {
        //   exclude: [""],
        // },
        nest: true,
        raw: true,
      });
      data.forEach((item, index) => {
        item.date = new Date(item.date).toString();
      });
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
};

const deleteScheduleService = (userId, date) => {
  const dateFormat = convertTimeStamp(date);
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Schedule.destroy({
        where: {
          userId,
          date: dateFormat,
        },
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

//homepage
const getScheduleByIdAndDateService = async (userId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dateFormat = convertTimeStamp(date);
      const data = await db.Schedule.findAll({
        where: {
          userId,
          date: dateFormat,
        },
        include: [
          {
            model: db.AllCode,
            as: "timeData",
            attributes: ["valueEn", "valueVn"],
          },
        ],
        nest: true,
        raw: true,
      });
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createScheduleService,
  getScheduleByIdAndDateService,
  getScheduleSystemService,
  deleteScheduleService,
};
