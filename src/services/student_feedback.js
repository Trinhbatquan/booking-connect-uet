const db = require("../models");

const saveFeedbackService = ({
  student,
  system,
  infrastructure,
  educationQuality,
  schoolActivities,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const studentFeedback = await db.Student_FeedBack.findOne({
        where: {
          studentId: student?.id,
        },
      });
      if (studentFeedback) {
        //update
        await db.Student_FeedBack.update(
          {
            system,
            infrastructure,
            education_quality: educationQuality,
            school_activities: schoolActivities,
          },
          {
            where: {
              studentId: student?.id,
            },
          }
        );
      } else {
        //new
        await db.Student_FeedBack.create({
          studentId: student?.id,
          system,
          infrastructure,
          education_quality: educationQuality,
          school_activities: schoolActivities,
        });
      }
      resolve({
        codeNumber: 0,
        message_en: "Send feedback succeed. Thanks from your participation.",
        message_vn: "Gửi đánh giá thành công. Cảm ơn sự tham gia của bạn.",
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  saveFeedbackService,
};
