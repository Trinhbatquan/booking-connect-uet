const db = require("../models");

const createMarkDownService = async (
  markdownHtml,
  markdownText,
  description,
  userId,
  action,
  type
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (action === "create") {
        await db.MarkDown.create({
          markdownHtml,
          markdownText,
          description,
          userId,
          type,
        });
        resolve({
          codeNumber: 0,
          message: "create",
        });
      } else {
        await db.MarkDown.update(
          {
            markdownHtml,
            markdownText,
            description,
          },
          {
            where: {
              userId,
              type,
            },
          }
        );
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

const getMarkDownByIdService = async (id, type) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.MarkDown.findOne({
        where: {
          userId: id,
          type,
        },
      });
      if (data?.userId || data?.markdownHtml) {
        resolve({
          codeNumber: 0,
          message: "Get MarkDown Succeed",
          markdown: data,
        });
      } else {
        resolve({
          codeNumber: 1,
          message: "Not MarkDown",
          markdown: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createMarkDownService,
  getMarkDownByIdService,
};
