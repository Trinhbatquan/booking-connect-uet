const { getAnswerService } = require("../services/answerService");

const getAnswerController = async (req, res) => {
  const { questionId } = req.query;
  try {
    if (!questionId) {
      return res.status(501).json({
        codeNumber: 1,
        message_en: "Error. Please contact with admin.",
        message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
      });
    } else {
      const data = await getAnswerService({
        questionId,
      });
      return res.status(200).json(data);
    }
  } catch (e) {
    res.status(501).json({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

module.exports = {
  getAnswerController,
};
