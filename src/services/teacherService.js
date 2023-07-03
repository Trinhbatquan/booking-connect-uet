const db = require("../models");

const getTeacherService = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Teacher.findAll({
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.AllCode,
            as: "positionData",
            attributes: ["valueEn", "valueVn"],
          },
          {
            model: db.AllCode,
            as: "genderData",
            attributes: ["valueEn", "valueVn"],
          },
          {
            model: db.OtherUser,
            as: "facultyData",
            attributes: ["fullName"],
          },
        ],
        order: [
          ["createdAt", "DESC"],
          ["updatedAt", "DESC"],
        ],
        limit: limit ? +limit : null,
        raw: true,
        nest: true, //fix result.get is not a function
      });
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
};

const getOneTeacherService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Teacher.findOne({
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.AllCode,
            as: "positionData",
            attributes: ["valueEn", "valueVn"],
          },
          {
            model: db.AllCode,
            as: "genderData",
            attributes: ["valueEn", "valueVn"],
          },
          {
            model: db.MarkDown,
            as: "markdownData_teacher",
            attributes: ["markdownHtml", "markdownText", "description"],
            where: {
              type: "teacher",
            },
          },
        ],
        where: {
          id,
        },
        raw: true,
        nest: true, //fix result.get is not a function
      });
      if (!data) {
        resolve({
          codeNumber: 1,
          message: "Teacher doesn't exist in the database",
        });
      }
      resolve({
        codeNumber: 0,
        message: "Get Teacher By Id Succeed",
        data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const createTeacherInfoService = async (teacherId, facultyId, note, action) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (action === "create") {
        await db.Teacher_Info.create({
          teacher_id: teacherId,
          faculty_id: facultyId,
          note,
        });
        resolve({
          codeNumber: 0,
          message: "Create a new teacher info succeed",
        });
      } else {
        await db.Teacher_Info.update(
          {
            faculty_id: facultyId,
            note,
          },
          {
            where: {
              teacher_id: teacherId,
            },
          }
        );
        resolve({
          codeNumber: 0,
          message: "Update teacher info succeed",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getTeacherInfoByIdService = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Teacher_Info.findOne({
        where: {
          teacher_id: id,
        },
      });
      if (data?.faculty_id) {
        resolve({
          codeNumber: 0,
          message: "Get Teacher Info Succeed",
          teacher_info: data,
        });
      } else {
        resolve({
          codeNumber: 1,
          message: "Not Teacher Info",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getTeacherService,
  getOneTeacherService,
  createTeacherInfoService,
  getTeacherInfoByIdService,
};
