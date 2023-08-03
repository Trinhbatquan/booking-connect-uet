const { updateStudentService } = require("../services/studentService");

const updateStudentController = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;
    if (!email || !phoneNumber) {
      return res.status(501).json({
        codeNumber: 1,
        message: "Missing parameters",
      });
    } else {
      const data = await updateStudentService(email, phoneNumber);
      return res.status(200).json({
        codeNumber: 0,
        message: "Success",
      });
    }
  } catch (e) {
    console.log("update student " + e);
    res.status(501).json({
      codeNumber: -1,
      message: "Not update student",
    });
  }
};

module.exports = {
  updateStudentController,
};
