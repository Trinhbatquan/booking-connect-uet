const {
  getTeacherService,
  getOneTeacherService,
  createTeacherInfoService,
  getTeacherInfoByIdService,
} = require("../services/teacherService");

const getTeacherController = async (req, res) => {
  const { limit } = req.query;
  // if (!limit) {
  //   res.status(400).send({
  //     codeNumber: 1,
  //     message: "Missing parameter limit",
  //   });
  // }
  try {
    const data = await getTeacherService(limit);
    res.status(200).send({
      codeNumber: 0,
      message: "Get Teacher Succeed",
      teacher: data,
    });
  } catch (e) {
    console.log(e);
    res.status(200).send({
      codeNumber: -1,
      message: "Can not get teacher",
    });
  }
};

const getOneTeacherController = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.status(400).send({
      codeNumber: 1,
      message: "Missing parameter id teacher",
    });
  }
  try {
    const data = await getOneTeacherService(id);
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(200).send({
      codeNumber: -1,
      message: "Can not get teacher by id",
    });
  }
};

const createTeacherInfoController = async (req, res) => {
  const { teacherId, facultyId, note, action } = req.body;
  console.log(teacherId, facultyId, note, action);
  if (!teacherId || !facultyId || !action) {
    return res.status(400).send({
      codeNumber: 1,
      message: "Missing parameter id teacher",
    });
  } else {
    try {
      const data = await createTeacherInfoService(
        teacherId,
        facultyId,
        note,
        action
      );
      res.status(200).send(data);
    } catch (e) {
      console.log(e);
      res.status(200).send({
        codeNumber: -1,
        message: "Can not create teacher info",
      });
    }
  }
};

const getTeacherInfoController = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.status(400).json({
      codeNumber: 1,
      message: "Missing parameter id",
    });
  } else {
    try {
      const data = await getTeacherInfoByIdService(id);
      res.status(200).json(data);
    } catch (e) {
      res.status(200).json({
        codeNumber: -1,
        message: "Can not get teacher info by id",
      });
    }
  }
};

module.exports = {
  getTeacherController,
  getOneTeacherController,
  createTeacherInfoController,
  getTeacherInfoController,
};
