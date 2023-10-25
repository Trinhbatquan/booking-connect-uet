const db = require("../models");
const { convertTimeStamp } = require("../utils/convertTimeStamp");

//manager + system
const getNotificationService = ({ managerId, roleManager, page, type }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pageSize = 8;
      const pageCurrent = page || 1;
      console.log(managerId);
      const totalDocument = await db.Notification.count({
        where:
          managerId || managerId?.length > 0
            ? {
                managerId,
                roleManager: roleManager
                  ? roleManager
                  : ["R2", "R3", "R4", "R5", "R6"],
                type_notification: type
                  ? type
                  : ["new_book", "new_ques", "check_event", "system"],
              }
            : {
                roleManager: roleManager
                  ? roleManager
                  : ["R2", "R3", "R4", "R5", "R6"],
                type_notification: type
                  ? type
                  : ["new_book", "new_ques", "check_event", "system"],
              },
      });
      const data = await db.Notification.findAll({
        where:
          managerId || managerId?.length > 0
            ? {
                managerId,
                roleManager: roleManager
                  ? roleManager
                  : ["R2", "R3", "R4", "R5", "R6"],
                type_notification: type
                  ? type
                  : ["new_book", "new_ques", "check_event", "system"],
              }
            : {
                roleManager: roleManager
                  ? roleManager
                  : ["R2", "R3", "R4", "R5", "R6"],
                type_notification: type
                  ? type
                  : ["new_book", "new_ques", "check_event", "system"],
              },
        include: [
          {
            model: db.Booking,
            as: "bookingData",
          },
          {
            model: db.AllCode,
            as: "notificationType",
            attributes: ["valueEn", "valueVn"],
          },
        ],
        offset: (pageCurrent - 1) * pageSize,
        limit: 8,
        nest: true,
        raw: true,
        order: [
          ["updatedAt", "DESC"],
          ["createdAt", "DESC"],
        ],
      });
      resolve({
        codeNumber: 0,
        notify: data,
        pageCurrent,
        pageTotal: Math.ceil(totalDocument / pageSize),
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

//system + homepage
const getAllNotifyByTypeService = (type_select) => {
  return new Promise(async (resolve, reject) => {
    try {
      const notify = await db.Notification.findAll({
        where: {
          type_notification: type_select,
        },
      });

      // const data = {
      //   student: 0,
      //   department: 0,
      //   faculty: 0,
      //   teacher: 0,
      //   studentHealthSupport: 0
      // }

      let data = [0, 0, 0, 0, 0]; //department, student, faculty, teacher, studentHealthSupport

      const type = ["R2", "R3", "R4", "R5", "R6"];

      if (notify?.length > 0) {
        for (let i = 0; i < notify.length; i++) {
          const index = type.indexOf(notify[i].roleManager);
          console.log(index);
          data[index]++;
        }
      }
      resolve({
        codeNumber: 0,
        allNotifyCount: data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

//homepage
const getNotifyHomePageLimitedService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const notify = await db.Notification.findAll({
        where: {
          type_notification: "system",
          roleManager: "R3", //student notification
        },
        limit: 6,
        nest: true,
        raw: true,
        order: [
          ["updatedAt", "DESC"],
          ["createdAt", "DESC"],
        ],
      });
      resolve({
        codeNumber: 0,
        notifyHomePageLimited: notify,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const createNotifySystemService = (notifyData) => {
  console.log(notifyData);
  return new Promise(async (resolve, reject) => {
    try {
      await db.Notification.bulkCreate([...notifyData]);
      resolve({
        codeNumber: 0,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateNotifySystemService = (notifyData, notifyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.Notification.update(
        {
          ...notifyData,
        },
        {
          where: {
            type_notification: "system",
            id: notifyId,
          },
        }
      );
      resolve({
        codeNumber: 0,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteNotifySystemService = (notifyId, roleManager) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.Notification.destroy({
        where: {
          roleManager,
          type_notification: "system",
          id: notifyId,
        },
      });
      resolve({
        codeNumber: 0,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getNotificationService,
  getAllNotifyByTypeService,
  createNotifySystemService,
  updateNotifySystemService,
  deleteNotifySystemService,
  getNotifyHomePageLimitedService,
};
