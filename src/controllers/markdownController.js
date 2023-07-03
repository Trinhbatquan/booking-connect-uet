const {
  createMarkDownService,
  getMarkDownByIdService,
} = require("../services/markdownService");

const createMarkDownController = async (req, res) => {
  const { markdownHtml, markdownText, description, userId, action, type } =
    req.body;
  if (!markdownHtml || !markdownText || !description || !userId || !type) {
    res.status(400).json({
      codeNumber: 1,
      message: "Missing data body markdown",
    });
  } else {
    try {
      const data = await createMarkDownService(
        markdownHtml,
        markdownText,
        description,
        userId,
        action,
        type
      );
      res.status(200).json(data);
    } catch (e) {
      res.status(200).json({
        codeNumber: -1,
        message: "Can not create a new markdown",
      });
    }
  }
};

const getMarkDownController = async (req, res) => {
  const { id, type } = req.query;
  if (!id || !type) {
    res.status(400).json({
      codeNumber: 1,
      message: "Missing parameter id",
    });
  } else {
    try {
      const data = await getMarkDownByIdService(id, type);
      res.status(200).json(data);
    } catch (e) {
      res.status(200).json({
        codeNumber: -1,
        message: "Can not get markdown by id",
      });
    }
  }
};

module.exports = {
  createMarkDownController,
  getMarkDownController,
};
