const {
  getTeacherHomePageService,
  getTeacherSystemService,
  getOneTeacherService,
  createTeacherInfoService,
  getTeacherInfoByIdService,
  getTeacherByFacultyService,
  getTeacherBySearchService,
} = require("../services/teacherService");

const getTeacherHomePageController = async (req, res) => {
  const { limit, page } = req.query;
  try {
    const data = await getTeacherHomePageService(limit, page);
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(200).send({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

const getTeacherSystemController = async (req, res) => {
  try {
    const data = await getTeacherSystemService();
    res.status(200).send({
      codeNumber: 0,
      message: "Get Teacher Succeed",
      teacher: data,
    });
  } catch (e) {
    console.log(e);
    res.status(200).send({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

const getTeacherBySearchController = async (req, res) => {
  const { search } = req.query;
  try {
    const data = await getTeacherBySearchService(search);
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(200).send({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

const getOneTeacherController = async (req, res) => {
  const { code_url } = req.query;
  if (!code_url) {
    res.status(400).send({
      codeNumber: 1,
      message: "Missing parameter code_url teacher",
    });
  }
  try {
    const data = await getOneTeacherService(code_url);
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(200).send({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

const createTeacherInfoController = async (req, res) => {
  const { teacherId, facultyId, note, action } = req.body;
  console.log(teacherId, facultyId, note, action);
  if (!teacherId || !facultyId || !action) {
    return res.status(400).send({
      codeNumber: 1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
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
        message_en: "Error. Please contact with admin.",
        message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
      });
    }
  }
};

const getTeacherInfoController = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.status(400).json({
      codeNumber: 1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  } else {
    try {
      const data = await getTeacherInfoByIdService(id);
      res.status(200).json(data);
    } catch (e) {
      res.status(200).json({
        codeNumber: -1,
        message_en: "Error. Please contact with admin.",
        message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
      });
    }
  }
};

const getOneTeacherByFacultyController = async (req, res) => {
  try {
    const { facultyId } = req.query;
    if (!facultyId) {
      res.status(400).json({
        codeNumber: 1,
        message_en: "Error. Please contact with admin.",
        message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
      });
    } else {
      const data = await getTeacherByFacultyService(facultyId);
      return res.status(200).json(data);
    }
  } catch (e) {
    console.log(e);
    res.status(200).json({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

module.exports = {
  getTeacherSystemController,
  getTeacherHomePageController,
  getOneTeacherController,
  createTeacherInfoController,
  getTeacherInfoController,
  getOneTeacherByFacultyController,
  getTeacherBySearchController,
};
