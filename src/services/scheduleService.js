const db = require("../models");
const { convertTimeStamp } = require("../utils/convertTimeStamp");
const { getDifference } = require("../utils/checkDifferentArray");

const createScheduleService = async (dataArr) => {
  const userId = dataArr[0]?.userId;
  const date = dataArr[0]?.date;
  const dateFormat = convertTimeStamp(date);
  return new Promise(async (resolve, reject) => {
    try {
      //check exist
      const queryArrayInDb = await db.Schedule.findAll({
        where: {
          userId,
          date: dateFormat,
        },
        attributes: ["userId", "date", "timeType", "actionId"],
      });

      //convert timeStamp
      dataArr.forEach((data) => {
        data.date = convertTimeStamp(data.date);
      });

      //check different
      let differentArr = [];
      differentArr = getDifference(dataArr, queryArrayInDb);

      console.log(differentArr);
      if (differentArr) {
        await db.Schedule.bulkCreate(differentArr);
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  });
};

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
};
