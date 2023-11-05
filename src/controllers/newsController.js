const {
  createNewsService,
  updateNewsService,
  deleteNewsService,
  getNewsService,
  getNewsLimitedService,
  getOneNewsService,
} = require("../services/newsService");

const createNewsController = async (req, res) => {
  try {
    const { title, content, contentHtml, avatarNew } = req.body;
    if (!title || !contentHtml || !content || !avatarNew) {
      return res.status(200).json({
        codeNumber: -1,
        message_en: "Error. Please contact with admin.",
        message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
      });
    }
    const data = await createNewsService({
      title,
      content,
      contentHtml,
      avatarNew,
    });
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

const updateNewsController = async (req, res) => {
  try {
    const { id, title, content, contentHtml, avatarNew } = req.body;
    if (!id || !title || !contentHtml || !content) {
      return res.status(200).json({
        codeNumber: -1,
        message_en: "Error. Please contact with admin.",
        message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
      });
    }
    const data = await updateNewsService({
      id,
      title,
      content,
      contentHtml,
      avatarNew,
    });
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

const deleteNewsController = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(200).json({
        codeNumber: -1,
        message_en: "Error. Please contact with admin.",
        message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
      });
    }
    const data = await deleteNewsService({ id });
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

const getNewsController = async (req, res) => {
  try {
    const { page } = req.query;
    const data = await getNewsService({ page });
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

const getNewsLimitedController = async (req, res) => {
  try {
    const { limit } = req.query;
    const data = await getNewsLimitedService({ limit });
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

const getOneNewsController = async (req, res) => {
  try {
    const { code_url } = req.query;
    const data = await getOneNewsService({ code_url });
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

module.exports = {
  createNewsController,
  updateNewsController,
  deleteNewsController,
  getNewsController,
  getNewsLimitedController,
  getOneNewsController,
};
