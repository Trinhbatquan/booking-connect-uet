const db = require("../models");

const createMarkDownService = async (
  markdownHtml,
  markdownText,
  description,
  userId,
  action
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (action === "create") {
        await db.MarkDown.create({
          markdownHtml,
          markdownText,
          description,
          userId,
        });
        resolve({
          codeNumber: 0,
          message: "Create a new markdown succeed",
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
            },
          }
        );
        resolve({
          codeNumber: 0,
          message: "Update markdown succeed",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getMarkDownByIdService = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.MarkDown.findOne({
        where: {
          userId: id,
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
