require("dotenv/config");

const {
  loginSystemService,
  loginHomePageService,
  registerHomePageService,
  verificationEmailService,
  getUserService,
  createNewUserService,
  editUserService,
  deleteUserService,
  getUserByRoleService,
  sendEmailToUpdatePassHomePageService,
  verifyAndUpdatePassHomePageService,
  sendEmailToUpdatePassSystemService,
  verifyAndUpdatePassSystemService,
  updatePasswordSystemService,
} = require("../services/userSevice");

const createTokenRandom = require("../middleware/createTokenRandom");

const loginSystem = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).send({
        codeNumber: 1,
        message_en: "Email and Password are required.",
        message_vn: "Email và mật khẩu là bắt buộc.",
      });
    } else {
      const data = await loginSystemService(email, password);
      if (data?.codeNumber === 0) {
        //connect socket

        const { email, roleId, fullName } = data?.user;
        const token = await createTokenRandom(email, roleId, "system");
        return res
          .cookie("access_token_booking_UET_system", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            expires: new Date(Date.now() + 30 * 24 * 3600000),
          })
          .status(200)
          .send(data);
      } else {
        return res.status(401).send(data);
      }
    }
  } catch (e) {
    return res.status(401).json({
      codeNumber: -1,
      message_en: "Login failed. Please contact with admin.",
      message_vn: "Đăng nhập thất bại. Vui lòng liên hệ quản trị viên",
    });
  }
};

const logoutSystemController = async (req, res) => {
  try {
    return res.status(200).clearCookie("access_token_booking_UET_system").json({
      codeNumber: 0,
      message_en: "Logout system succeed!",
      message_vn: "Đăng xuất thành công!",
    });
  } catch (e) {
    return res.status(401).json({
      codeNumber: -1,
      message_en: "Logout failed. Please contact with admin.",
      message_vn: "Đăng xuất thất bại. Vui lòng liên hệ quản trị viên",
    });
  }
};

const registerHomePage = async (req, res) => {
  const { email, password, fullName, faculty, classroom, phoneNumber } =
    req.body;
  if (
    !email ||
    !password ||
    !fullName ||
    !faculty ||
    !classroom ||
    !phoneNumber
  ) {
    return res.status(400).send({
      codeNumber: 1,
      message_en: "Sign up failed. Please contact with admin.",
      message_vn: "Đăng ký thất bại. Vui lòng liên hệ quản trị viên",
    });
  } else {
    try {
      const checkVNU = email.split("@")[1];
      const checkUET = email.slice(2, 4);
      if (checkVNU && checkVNU === process.env.EMAIL_VNU) {
        if (checkUET && checkUET === process.env.EMAIL_UET) {
          let data = await registerHomePageService(
            email,
            password,
            fullName,
            faculty,
            classroom,
            phoneNumber
          );
          if (data?.codeNumber === 0) {
            const { email, roleId } = data?.user;
            const token = await createTokenRandom(email, roleId, "student");
            return res
              .cookie("access_token_booking_UET_homepage", token, {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                expires: new Date(Date.now() + 30 * 24 * 3600000), //1 month
              })
              .status(200)
              .send(data);
          } else {
            return res.status(401).send(data);
          }
        } else {
          return res.status(400).send({
            codeNumber: 1,
            message_en: "Please use UET mail.",
            message_vn: "Vui lòng sử dụng UET mail.",
          });
        }
      } else {
        return res.status(400).send({
          codeNumber: 1,
          message_en: "Please use UET mail.",
          message_vn: "Vui lòng sử dụng UET mail.",
        });
      }
    } catch (e) {
      console.log(e);
      res.status(400).send({
        codeNumber: -1,
        message_en: "Sign up failed. Please contact with admin.",
        message_vn: "Đăng ký thất bại. Vui lòng liên hệ quản trị viên",
      });
    }
  }
};

const loginHomePage = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({
      codeNumber: 1,
      message_en: "Email and Password are required.",
      message_vn: "Email và mật khẩu là bắt buộc.",
    });
  } else {
    try {
      const checkVNU = email.split("@")[1];
      if (checkVNU && checkVNU === process.env.EMAIL_VNU) {
        let data = await loginHomePageService(email, password);
        if (data?.codeNumber === 0) {
          const { email, roleId } = data?.user;
          const token = await createTokenRandom(email, roleId, "student");
          const old_token = await req.cookies.access_token_booking_UET_homepage;
          if (old_token) {
            return res.status(200).send(data);
          } else {
            return res
              .cookie("access_token_booking_UET_homepage", token, {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                expires: new Date(Date.now() + 30 * 24 * 3600000), //1 month
              })
              .status(200)
              .send(data);
          }
        } else {
          return res.status(401).send(data);
        }
      } else {
        return res.status(400).send({
          codeNumber: 1,
          message_en: "Please use UET mail.",
          message_vn: "Vui lòng sử dụng UET mail.",
        });
      }
    } catch (e) {
      console.log(e);
      res.status(400).send({
        codeNumber: -1,
        message_en: "Login failed. Please contact with admin.",
        message_vn: "Đăng nhập thất bại. Vui lòng liên hệ quản trị viên",
      });
    }
  }
};

const logoutHomePageController = async (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie("access_token_booking_UET_homepage")
      .json({
        codeNumber: 0,
        message_en: "Logout system succeed!",
        message_vn: "Đăng xuất thành công!",
      });
  } catch (e) {
    return res.status(401).json({
      codeNumber: -1,
      message_en: "Logout failed. Please contact with admin.",
      message_vn: "Đăng xuất thất bại. Vui lòng liên hệ quản trị viên",
    });
  }
};

const verificationEmailController = async (req, res) => {
  try {
    const data = await verificationEmailService(req);
    console.log(data);
    if (data?.codeNumber === 0) {
      const { email, roleId } = data?.user;
      const token = await createTokenRandom(email, roleId, "student");
      return res
        .cookie("access_token_booking_UET_homepage", token, {
          httpOnly: true,
          secure: true,
        })
        .status(200)
        .send(data);
    } else {
      return res.status(401).send(data);
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({
      codeNumber: -1,
      message_en: "Verification of email failed. Please contact with admin.",
      message_vn: "Không xác minh được email. Vui lòng liên hệ quản trị viên",
    });
  }
};

const sendEmailToUpdatePassHomePageController = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(200).json({
        codeNumber: 1,
        message_en: "Please enter email.",
        message_vn: "Vui lòng nhập email của bạn.",
      });
    }

    const data = await sendEmailToUpdatePassHomePageService(email);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

const sendEmailToUpdatePassSystemController = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(200).json({
        codeNumber: 1,
        message_en: "Please enter email.",
        message_vn: "Vui lòng nhập email của bạn.",
      });
    }

    const data = await sendEmailToUpdatePassSystemService(email);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

const verifyAndUpdatePasswordHomePageController = async (req, res) => {
  try {
    const { email, token, password } = req.body;
    if (!email || !token || !password) {
      return res.status(200).json({
        codeNumber: 1,
        message_en: "Error. Please contact with admin.",
        message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
      });
    }

    const data = await verifyAndUpdatePassHomePageService(
      email,
      token,
      password
    );
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

const verifyAndUpdatePasswordSystemController = async (req, res) => {
  try {
    const { email, token, password, userId, roleId } = req.body;
    if (!email || !token || !password || !userId || !roleId) {
      return res.status(200).json({
        codeNumber: 1,
        message_en: "Error. Please contact with admin.",
        message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
      });
    }

    const data = await verifyAndUpdatePassSystemService(
      email,
      token,
      password,
      userId,
      roleId
    );
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

const getUserController = async (req, res) => {
  const code_url = req.query?.code_url;
  if (!code_url) {
    res.status(500).send({
      codeNumber: 1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  } else {
    const data = await getUserService(code_url);
    if (data?.codeNumber === 0) {
      res.status(200).send(data);
    } else {
      res.status(500).send(data);
    }
  }
};

const getUserByRoleController = async (req, res) => {
  const role = req.query.role;
  if (!role) {
    res.status(500).send({
      codeNumber: 1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  } else {
    try {
      const data = await getUserByRoleService(role);
      res.status(200).send({
        codeNumber: 0,
        message_en: "Get User Succeed.",
        message_vn: "Lấy người dùng thành công",
        user: data,
      });
    } catch (e) {
      res.status(200).send({
        codeNumber: -1,
        message_en: "Error. Please contact with admin.",
        message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
      });
    }
  }
};

const createUserController = async (req, res) => {
  try {
    const data = await createNewUserService(req.body);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(501).json({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

const editUserController = async (req, res) => {
  try {
    const data = await editUserService(req.body);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(501).json({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

const deleteUserController = async (req, res) => {
  try {
    const data = await deleteUserService(req.query);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(501).json({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

const updatePasswordSystemController = async (req, res) => {
  const { currentPassword, newPassword, roleId } = req.body;
  const { user } = req;
  try {
    const data = await updatePasswordSystemService({
      user,
      currentPassword,
      newPassword,
      roleId,
    });
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    res.status(501).json({
      codeNumber: -1,
      message_en: "Error. Please contact with admin.",
      message_vn: "Có lỗi. Vui lòng liên hệ quản trị viên",
    });
  }
};

module.exports = {
  loginSystem,
  registerHomePage,
  loginHomePage,
  logoutSystemController,
  logoutHomePageController,
  verificationEmailController,
  getUserController,
  createUserController,
  editUserController,
  deleteUserController,
  getUserByRoleController,
  sendEmailToUpdatePassHomePageController,
  verifyAndUpdatePasswordHomePageController,
  sendEmailToUpdatePassSystemController,
  verifyAndUpdatePasswordSystemController,
  updatePasswordSystemController,
};
