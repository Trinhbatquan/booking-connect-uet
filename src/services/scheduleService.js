const db = require("../models");
const { convertTimeStamp } = require("../utils/convertTimeStamp");
const { getDifference } = require("../utils/checkDifferentArray");

//system
const createScheduleService = async (scheduleData, action) => {
  return new Promise(async (resolve, reject) => {
    const managerId = scheduleData[0]?.managerId;
    const date = scheduleData[0]?.date;
    const roleManager = scheduleData[0]?.roleManager;
    const dateFormat = convertTimeStamp(date);
    scheduleData.forEach((data) => {
      data.date = convertTimeStamp(data.date);
    });
    try {
      if (action === "create") {
        const status = await db.Schedule.findOne({
          where: {
            managerId,
            date: dateFormat,
            roleManager,
          },
        });
        if (status) {
          await db.Schedule.destroy({
            where: {
              managerId,
              date: dateFormat,
              roleManager,
            },
          });
          await db.Schedule.bulkCreate(scheduleData);
          resolve({
            codeNumber: 0,
            message: "create",
          });
        } else {
          await db.Schedule.bulkCreate(scheduleData);
          resolve({
            codeNumber: 0,
            message: "create",
          });
        }
      } else {
        await db.Schedule.destroy({
          where: {
            managerId,
            date: dateFormat,
            roleManager,
          },
        });
        await db.Schedule.bulkCreate(scheduleData);
        resolve({
          codeNumber: 0,
          message: "update",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getScheduleSystemService = (managerId, roleManager) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Schedule.findAll({
        where: {
          managerId,
          roleManager,
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
      data.forEach((item, index) => {
        item.date = new Date(item.date).toString();
      });
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
};

const deleteScheduleService = (managerId, date, roleManager) => {
  const dateFormat = convertTimeStamp(date);
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Schedule.destroy({
        where: {
          managerId,
          roleManager,
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
const getScheduleByIdAndDateService = async (managerId, date, roleManager) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dateFormat = convertTimeStamp(date);
      const data = await db.Schedule.findAll({
        where: {
          managerId,
          date: dateFormat,
          roleManager,
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
