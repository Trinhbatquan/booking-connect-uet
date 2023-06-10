require("dotenv/config");

const {
  loginSystemService,
  loginHomePageService,
  verificationEmailService,
  getUserService,
  createNewUserService,
  editUserService,
  deleteUserService,
  getUserByRoleService,
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
        const { email, roleId } = data?.user;
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
          message: "Not student of UET",
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
  const data = await createNewUserService(req.body);
  return res.send(data);
};

const editUserController = async (req, res) => {
  const data = await editUserService(req.body);
  return res.send(data);
};

const deleteUserController = async (req, res) => {
  const data = await deleteUserService(req.query);
  return res.send(data);
};

module.exports = {
  loginSystem,
  loginHomePage,
  logoutSystemController,
  logoutHomePageController,
  verificationEmailController,
  getUserController,
  createUserController,
  editUserController,
  deleteUserController,
  getUserByRoleController,
};
