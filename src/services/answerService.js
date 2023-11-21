const db = require("../models");

const getAnswerService = ({ questionId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Answer.findOne({
        where: {
          questionId,
        },
        attributes: {
          exclude: ["id", "createdAt", "updatedAt"],
        },
      });
      resolve({
        codeNumber: 0,
        answerData: data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAnswerService,
};
