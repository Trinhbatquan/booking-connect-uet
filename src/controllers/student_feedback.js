const jwt = require("jsonwebtoken");
const db = require("../models");
require("dotenv/config");

const { saveFeedbackService } = require("../services/student_feedback");

const getPreviousFeedback = async (req, res) => {
  try {
    let decode;
    const token = await req.cookies.access_token_booking_UET_homepage;
    if (token) {
      decode = await jwt.verify(token, process.env.SECRET_KEY_STUDENT);
    } else {
      return res.status(401).json({
        codeNumber: -2,
        message: "No token found or cookie session expired.",
      });
    }
    //get student id;
    const { email } = decode;
    const student = await db.Student.findOne({
      where: {
        email,
      },
      attributes: {
        exclude: ["password"],
      },
    });
    const studentFeedback = await db.Student_FeedBack.findOne({
      where: {
        studentId: student?.id,
      },
    });
    if (!studentFeedback) {
      return res.status(200).json({
        codeNumber: 1,
        message_en: "You hasn't posted any feedback yet.",
        message_vn: "Bạn chưa có bản đánh giá trước đó nào.",
      });
    }
    return res.status(200).json({
      codeNumber: 0,
      feedback: studentFeedback,
    });
  } catch (e) {
    console.log(e);
    return res.status(501).json({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

const saveFeedbackController = async (req, res) => {
  try {
    const { user } = req;
    const { system, infrastructure, educationQuality, schoolActivities } =
      req.body;
    const data = await saveFeedbackService({
      student: user,
      system,
      infrastructure,
      educationQuality,
      schoolActivities,
    });
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(501).json({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

const getFeedbackController = async (req, res) => {
  try {
    const { limit } = req.query;
    const data = await db.Student_FeedBack.findAll({
      include: [
        {
          model: db.Student,
          as: "studentData_FeedBack",
          attributes: ["fullName", "faculty", "classroom", "image"],
        },
      ],
      raw: true,
      nest: true, //fix result.get is not a function
      limit: limit ? limit : 5,
    });
    const countDocument = await db.Student_FeedBack.count();
    return res.status(200).json({
      codeNumber: 0,
      feedback: data,
      count: countDocument,
    });
  } catch (e) {
    console.log(e);
    return res.status(501).json({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

module.exports = {
  getPreviousFeedback,
  saveFeedbackController,
  getFeedbackController,
};
