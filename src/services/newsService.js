const db = require("../models");
const render_code_url = require("../utils/render_code_url");

const createNewsService = ({ title, content, contentHtml, avatarNew }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const code_url = await render_code_url(title);
      const data = await db.New.create({
        title,
        content,
        contentHtml,
        avatarNew,
        code_url,
      });
      resolve({
        codeNumber: 0,
        message_vn: "Tạo tin tức mới thành công.",
        message_en: "Create new news succeed.",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateNewsService = ({ id, title, content, contentHtml, avatarNew }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const news = await db.New.findOne({
        where: { id },
      });
      if (!news) {
        resolve({
          codeNumber: 1,
          message_vn: "Tin tức này không tồn tại trong hệ thống.",
          message_en: "This news doesn't exist in system.",
        });
      }
      await db.New.update(
        avatarNew
          ? {
              title,
              content,
              contentHtml,
              avatarNew,
            }
          : {
              title,
              content,
              contentHtml,
            },
        {
          where: { id },
        }
      );
      resolve({
        codeNumber: 0,
        message_vn: "Cập nhật tin tức mới thành công.",
        message_en: "Update news succeed.",
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

const deleteNewsService = ({ id }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const news = await db.New.findOne({
        where: { id },
      });
      if (!news) {
        resolve({
          codeNumber: 1,
          message_vn: "Tin tức này không tồn tại trong hệ thống.",
          message_en: "This news doesn't exist in system.",
        });
      }
      await db.New.destroy({
        where: { id },
      });
      resolve({
        codeNumber: 0,
        message_vn: "Xoá bỏ tin tức mới thành công.",
        message_en: "Delete news succeed.",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getNewsService = ({ page }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pageSize = 2;
      const pageCurrent = page || 1;
      const totalDocument = await db.New.count();
      const data = await db.New.findAll({
        offset: (pageCurrent - 1) * pageSize,
        limit: pageSize,
        nest: true,
        raw: true,
        order: [
          ["updatedAt", "DESC"],
          ["createdAt", "DESC"],
        ],
      });
      resolve({
        codeNumber: 0,
        news: data,
        pageCurrent,
        pageTotal: Math.ceil(totalDocument / pageSize),
        countNews: totalDocument,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getNewsLimitedService = ({ limit }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.New.findAll({
        limit: limit ? limit : 4,
        nest: true,
        raw: true,
        order: [
          ["updatedAt", "DESC"],
          ["createdAt", "DESC"],
        ],
      });
      resolve({
        codeNumber: 0,
        news: data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getOneNewsService = ({ code_url }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.New.findOne({
        where: {
          code_url,
        },
      });
      resolve({
        codeNumber: 0,
        news: data,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

module.exports = {
  createNewsService,
  updateNewsService,
  deleteNewsService,
  getNewsService,
  getNewsLimitedService,
  getOneNewsService,
};
