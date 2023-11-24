const db = require("../models");
const { convertTimeStamp } = require("../utils/convertTimeStamp");

//manager + student
const getCountNewNotifyService = ({
  type,
  studentId,
  managerId,
  roleManager,
}) => {
  return new Promise(async (resolve, reject) => {
    let data = [];
    try {
      if (type === "student") {
        //get count new notify of a student
        data = await db.Notification.findAll({
          where: {
            isNew: 0,
            studentId,
          },
        });
      } else if (type === "manager") {
        //get count new notify of a manager
        data = await db.Notification.findAll({
          where: {
            isNew: 0,
            managerId,
            roleManager,
          },
        });
      }
      resolve({
        codeNumber: 0,
        countNewNotify: data?.length,
      });
    } catch (e) {
      reject(e);
    }
  });
};

//system
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
        countsNotify: totalDocument,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

//system count for roleId
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
const getNotifyHomePageLimitedService = ({
  page,
  studentId,
  typeNotification,
  managerId,
  roleManager,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pageSize = 2;
      const pageCurrent = page || 1;
      const totalDocument = await db.Notification.count({
        where: !managerId
          ? typeNotification === "system"
            ? {
                type_notification: "system",
                roleManager: "R3", //student notification
              }
            : {
                studentId,
              }
          : typeNotification === "system"
          ? {
              type_notification: "system",
              roleManager, //manager notification
            }
          : {
              managerId,
              roleManager,
            },
      });
      const notify = await db.Notification.findAll({
        where: !managerId
          ? typeNotification === "system"
            ? {
                type_notification: "system",
                roleManager: "R3", //student notification
              }
            : {
                studentId,
              }
          : typeNotification === "system"
          ? {
              type_notification: "system",
              roleManager, //manager notification
            }
          : {
              managerId,
              roleManager,
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
        limit: pageSize,
        offset: (pageCurrent - 1) * pageSize,
        nest: true,
        raw: true,
        order: [
          // ["updatedAt", "DESC"],
          ["createdAt", "DESC"],
        ],
      });
      resolve({
        codeNumber: 0,
        notify,
        pageCurrent,
        countsNotify: totalDocument,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getOneNotifyHomePageService = ({ code_url }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const notify = await db.Notification.findOne({
        where: {
          type_notification: "system",
          roleManager: "R3", //student notification
          code_url,
        },
        nest: true,
        raw: true,
      });
      resolve({
        codeNumber: 0,
        notify,
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

const updateToOldNotifyService = ({
  type,
  studentId,
  managerId,
  roleManager,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (type === "student") {
        //get count new notify of a student
        await db.Notification.update(
          {
            isNew: 1,
          },
          {
            where: {
              isNew: 0,
              studentId,
            },
          }
        );
      } else if (type === "manager") {
        //get count new notify of a manager
        data = await db.Notification.update(
          {
            isNew: 1,
          },
          {
            where: {
              isNew: 0,
              managerId,
              roleManager,
            },
          }
        );
      }
      resolve({
        codeNumber: 0,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteNotifyService = ({
  type,
  studentId,
  managerId,
  roleManager,
  action,
  notifyId,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (type === "student") {
        //delete notify of student
        if (action === "all") {
          await db.Notification.destroy({
            where: {
              studentId,
            },
          });
        } else {
          //delete one notify
          await db.Notification.destroy({
            where: {
              studentId,
              id: notifyId,
            },
          });
        }
      } else if (type === "manager") {
        if (action === "all") {
          await db.Notification.destroy({
            where: {
              managerId,
              roleManager,
            },
          });
        } else {
          await db.Notification.destroy({
            where: {
              id: notifyId,
              managerId,
              roleManager,
            },
          });
        }
      }
      resolve({
        codeNumber: 0,
        message_en: "Delete notification successfully",
        message_vn: "Xoá thông báo thành công",
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
  getOneNotifyHomePageService,
  getCountNewNotifyService,
  updateToOldNotifyService,
  deleteNotifyService,
};
