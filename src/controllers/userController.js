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
} = require("../services/userSevice");

const createTokenRandom = require("../middleware/createTokenRandom");

const loginSystem = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).send({
        codeNumber: 1,
        message: "Email and Password are required.",
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
      message: "Login failed. Please try again!",
    });
  }
};

const logoutSystemController = async (req, res) => {
  try {
    return res.status(200).clearCookie("access_token_booking_UET_system").json({
      codeNumber: 0,
      message: "Logout system succeed!",
    });
  } catch (e) {
    return res.status(401).json({
      codeNumber: -1,
      message: "Logout failed. Please try again!",
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
      message: "Missing parameters.",
    });
  } else {
    try {
      const checkVNU = email.split("@")[1];
      if (checkVNU && checkVNU === process.env.EMAIL_VNU) {
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
          message: "Please use email of UET.",
        });
      }
    } catch (e) {
      console.log(e);
      res.status(400).send({
        codeNumber: -1,
        message: "Not register home page",
      });
    }
  }
};

const loginHomePage = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({
      codeNumber: 1,
      message: "Email and Password are required.",
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
            return (
              res
                //  .cookie("access_token_booking_UET_homepage", token, {
                //    httpOnly: true,
                //    secure: true,
                //    sameSite: "lax",
                //    expires: new Date(Date.now() + 30 * 24 * 3600000), //1 month
                //  })
                .status(200)
                .send(data)
            );
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
          message: "Please enter email of UET.",
        });
      }
    } catch (e) {
      console.log(e);
      res.status(400).send({
        codeNumber: -1,
        message: "Not login home page",
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
        message: "Logout homepage succeed!",
      });
  } catch (e) {
    return res.status(401).json({
      codeNumber: -1,
      message: "Logout failed. Please try again!",
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
      message: "Not verify email home page",
    });
  }
};

const sendEmailToUpdatePassHomePageController = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(200).json({
        codeNumber: 1,
        message: "Missing Parameters",
      });
    }

    const data = await sendEmailToUpdatePassHomePageService(email);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({
      codeNumber: -1,
      message: "Don't send email to update pass",
    });
  }
};

const verifyAndUpdatePasswordHomePageController = async (req, res) => {
  try {
    const { email, token, password } = req.body;
    if (!email || !token || !password) {
      return res.status(200).json({
        codeNumber: 1,
        mess: "Error. Contact with admin page.",
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
      mess: "Error. Contact with admin page.",
    });
  }
};

const getUserController = async (req, res) => {
  const userId = req.query.id;
  if (!userId) {
    res.status(500).send({
      codeNumber: 1,
      message: "Missing parameter id",
    });
  } else {
    const data = await getUserService(userId);
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
      message: "Missing parameter role",
    });
  } else {
    try {
      const data = await getUserByRoleService(role);
      res.status(200).send({
        codeNumber: 0,
        message: "get user by role succeed",
        user: data,
      });
    } catch (e) {
      res.status(200).send({
        codeNumber: -1,
        message: "Not get user by role",
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
      message: "error",
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
      message: "error",
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
      message: "error",
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
};
