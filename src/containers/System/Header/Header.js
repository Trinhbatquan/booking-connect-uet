import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { BsFillPersonFill } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { MdOutlineEmail } from "react-icons/md";
import { AiFillEdit, AiFillUnlock } from "react-icons/ai";
import { BiLogOutCircle } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";

import "./Header.scss";
import { logOutUser } from "../../../redux/authSlice";
import { path } from "../../../utils/constant";
import { NavLink } from "react-router-dom";
import { logOutApi } from "../../../services/userService";

const HeaderUser = () => {
  const { t, i18n } = useTranslation();
  const [openModelUser, setOpenModelUser] = useState(false);
  const currentUser = useSelector((state) => state.authReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogOutSystem = () => {
    logOutApi.logoutUser({}).then((data) => {
      if (data?.codeNumber === 0) {
        dispatch(logOutUser());
        navigate(`${path.SYSTEM}/${path.LOGIN_SYSTEM}?redirect=/system`);
      } else {
      }
    });
  };

  return (
    <div className="system-header-container shadow-md backdrop-blur-md shadow-blurColor z-30 flex items-center justify-between">
      <div className="px-4 system-header-item relative">
        <NavLink
          to={path.scheduleManager}
          className="system-header-text text-blurColor font-semibold text-lg w-full h-full flex items-center
        "
          style={({ isActive }) =>
            isActive
              ? {
                  color: "#fff",
                }
              : { color: "#b6b5b6" }
          }
        >
          <span>Quản lý lịch hẹn</span>
        </NavLink>
      </div>
      <div className="flex items-center justify-items-end gap-8">
        <span className="text-blurColor font-semibold text-lg cursor-pointer">
          EN
        </span>
        <span className="text-blurColor font-semibold text-lg cursor-pointer">
          VN
        </span>
        <div
          className={`avatar relative mr-5 text-blurColor text-2xl ml-3 cursor-pointer hover:text-white flex items-center justify-center gap-0`}
          onClick={() => setOpenModelUser(!openModelUser)}
        >
          <BsFillPersonFill className={``} />
          {openModelUser ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
          <AnimatePresence>
            {openModelUser && (
              <motion.div
                initial={{ opacity: 0, translateY: -50 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: -50 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="avatar-modal absolute top-16 -right-0 z-5 rounded-lg shadow w-72 bg-blue-800 divide-blue-600"
              >
                <div className="px-4 py-3 text-md text-white">
                  <div className="flex items-center gap-1 cursor-text">
                    <MdOutlineEmail className="mt-1" />
                    <span>
                      {currentUser?.email
                        ? currentUser.email
                        : "expamle@vnu.edu.vn"}
                    </span>
                  </div>
                </div>
                <ul className="py-2  text-gray-200 border-t border-b border-slate-400">
                  <li>
                    <div className="flex items-center gap-1 px-4 py-2 hover:bg-blue-600 hover:text-white">
                      <AiFillEdit /> <span> Edit Profile</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center gap-1 px-4 py-2 hover:bg-blue-600 hover:text-white ">
                      <AiFillUnlock /> <span>Change Password</span>
                    </div>
                  </li>
                </ul>
                <div className="py-2">
                  <div
                    className="flex items-center gap-1 px-4 py-2  hover:bg-blue-600 hover:text-white text-gray-200"
                    onClick={() => handleLogOutSystem()}
                  >
                    <BiLogOutCircle /> <span>Sign out</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const HeaderAdmin = () => {
  const { t, i18n } = useTranslation();
  const [openModelUser, setOpenModelUser] = useState(false);
  const currentUser = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogOutSystem = () => {
    logOutApi.logoutUser({}).then((data) => {
      if (data?.codeNumber === 0) {
        dispatch(logOutUser());
        navigate(`${path.SYSTEM}/${path.LOGIN_SYSTEM}?redirect=/system`);
      } else {
      }
    });
  };
  const handleChangeLanguages = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="system-header-container fixed top-0 left-0 right-0 flex items-center justify-between shadow-md backdrop-blur-md shadow-blurColor">
      <div className="system-header-item-left flex items-center justify-start">
        <div
          className="system-header-text relative text-blurColor font-semibold text-lg w-1/5 h-full flex items-center gap-1
       justify-center cursor-pointer pl-3 hover:text-white transition-all duration-200"
        >
          <span>{t("system.header.admin")}</span>
          <IoIosArrowDown className="text-lg relative" style={{ top: "1px" }} />
          <ul
            className="absolute left-0 list-none flex flex-col justify-center w-300"
            style={{
              top: "50px",
              backgroundColor: "#fff",
              border: "1px solid #cccdc9",
              padding: "15px",
            }}
          >
            <NavLink
              to={path.scheduleManager}
              className="system-header-option text-lg"
              style={({ isActive }) =>
                isActive
                  ? {
                      color: "#004aac",
                      backgroundColor: "#d3ecfc",
                      transition: "background-color 0.1s",
                      fontWeight: "600",
                      lineHeight: "20px",
                      padding: "10px 15px",
                    }
                  : {}
              }
            >
              <li>{t("system.header.manager-schedule")}</li>
            </NavLink>
          </ul>
        </div>

        <div
          className={`system-header-text relative text-blurColor font-semibold text-lg w-1/6 h-full flex items-center gap-1
       justify-center cursor-pointer hover:text-white transition-all duration-200`}
        >
          <span>{t("system.header.department")}</span>
          <IoIosArrowDown className="text-lg relative" style={{ top: "1px" }} />
          <ul
            className="absolute left-0 list-none flex flex-col justify-center w-300"
            style={{
              top: "50px",
              backgroundColor: "#fff",
              border: "1px solid #cccdc9",
              padding: "15px",
            }}
          >
            <NavLink
              to={path.departmentManager}
              className="system-header-option text-lg"
              style={({ isActive }) =>
                isActive
                  ? {
                      color: "#004aac",
                      backgroundColor: "#d3ecfc",
                      transition: "background-color 0.1s",
                      fontWeight: "600",
                      lineHeight: "20px",
                      padding: "10px 15px",
                    }
                  : {}
              }
            >
              <li>{t("system.header.manager-department")}</li>
            </NavLink>
            <NavLink
              to={path.departmentDescription}
              className="system-header-option text-lg"
              style={({ isActive }) =>
                isActive
                  ? {
                      color: "#004aac",
                      backgroundColor: "#d3ecfc",
                      transition: "background-color 0.1s",
                      fontWeight: "600",
                      lineHeight: "20px",
                      padding: "10px 15px",
                    }
                  : {}
              }
            >
              <li>{t("system.header.desc-department")}</li>
            </NavLink>
          </ul>
        </div>

        <div
          className={`system-header-text relative text-blurColor font-semibold text-lg w-1/6 h-full flex items-center gap-1
       justify-center cursor-pointer hover:text-white transition-all duration-200`}
        >
          <span>{t("system.header.faculty")}</span>
          <IoIosArrowDown className="text-lg relative" style={{ top: "1px" }} />
          <ul
            className="absolute left-0 list-none flex flex-col justify-center w-300"
            style={{
              top: "50px",
              backgroundColor: "#fff",
              border: "1px solid #cccdc9",
              padding: "15px",
            }}
          >
            <NavLink
              to={path.facultyManager}
              className="system-header-option text-lg"
              style={({ isActive }) =>
                isActive
                  ? {
                      color: "#004aac",
                      backgroundColor: "#d3ecfc",
                      transition: "background-color 0.1s",
                      fontWeight: "600",
                      lineHeight: "20px",
                      padding: "10px 15px",
                    }
                  : {}
              }
            >
              <li>{t("system.header.manager-faculty")}</li>
            </NavLink>
            <NavLink
              to={path.facultyDescription}
              className="system-header-option text-lg"
              style={({ isActive }) =>
                isActive
                  ? {
                      color: "#004aac",
                      backgroundColor: "#d3ecfc",
                      transition: "background-color 0.1s",
                      fontWeight: "600",
                      lineHeight: "20px",
                      padding: "10px 15px",
                    }
                  : {}
              }
            >
              <li>{t("system.header.desc-faculty")}</li>
            </NavLink>
          </ul>
        </div>

        <div
          className={`system-header-text relative text-blurColor font-semibold text-lg w-1/6 h-full flex items-center gap-1
       justify-center cursor-pointer hover:text-white transition-all duration-200`}
        >
          <span>{t("system.header.teacher")}</span>
          <IoIosArrowDown className="text-lg relative" style={{ top: "1px" }} />
          <ul
            className="absolute left-0 list-none flex flex-col justify-center w-300"
            style={{
              top: "50px",
              backgroundColor: "#fff",
              border: "1px solid #cccdc9",
              padding: "15px",
            }}
          >
            <NavLink
              to={path.teacherManager}
              className="system-header-option text-lg"
              style={({ isActive }) =>
                isActive
                  ? {
                      color: "#004aac",
                      backgroundColor: "#d3ecfc",
                      transition: "background-color 0.1s",
                      fontWeight: "600",
                      lineHeight: "20px",
                      padding: "10px 15px",
                    }
                  : {}
              }
            >
              <li>{t("system.header.manager-teacher")}</li>
            </NavLink>
            <NavLink
              to={path.teacherDescription}
              className="system-header-option text-lg"
              style={({ isActive }) =>
                isActive
                  ? {
                      color: "#004aac",
                      backgroundColor: "#d3ecfc",
                      transition: "background-color 0.1s",
                      fontWeight: "600",
                      lineHeight: "20px",
                      padding: "10px 15px",
                    }
                  : {}
              }
            >
              <li>{t("system.header.desc-teacher")}</li>
            </NavLink>
          </ul>
        </div>

        <div
          className={`system-header-text relative text-blurColor font-semibold text-lg w-1/4 h-full flex items-center gap-1
       justify-center cursor-pointer hover:text-white transition-all duration-200`}
        >
          <span>{t("system.header.health-student")}</span>
          <IoIosArrowDown className="text-lg relative" style={{ top: "1px" }} />
          <ul
            className="absolute left-0 list-none flex flex-col justify-center w-300"
            style={{
              top: "50px",
              backgroundColor: "#fff",
              border: "1px solid #cccdc9",
              padding: "15px",
            }}
          >
            <NavLink
              to={path.healthStudentManager}
              className="system-header-option text-lg"
              style={({ isActive }) =>
                isActive
                  ? {
                      color: "#004aac",
                      backgroundColor: "#d3ecfc",
                      transition: "background-color 0.1s",
                      fontWeight: "600",
                      lineHeight: "20px",
                      padding: "10px 15px",
                    }
                  : {}
              }
            >
              <li>{t("system.header.manager-health-student")}</li>
            </NavLink>
            <NavLink
              to={path.healthStudentDescription}
              className="system-header-option text-lg"
              style={({ isActive }) =>
                isActive
                  ? {
                      color: "#004aac",
                      backgroundColor: "#d3ecfc",
                      transition: "background-color 0.1s",
                      fontWeight: "600",
                      lineHeight: "20px",
                      padding: "10px 15px",
                    }
                  : {}
              }
            >
              <li>{t("system.header.desc-health-student")}</li>
            </NavLink>
          </ul>
        </div>
      </div>

      <div className="system-header-item-right flex items-center justify-items-end gap-8">
        <span
          className={`font-semibold text-lg cursor-pointer
        hover:text-white ${
          i18n.language === "vi" ? "text-blurColor" : "text-white"
        }`}
          onClick={() => handleChangeLanguages("en")}
        >
          EN
        </span>
        <span
          className={`font-semibold text-lg cursor-pointer
        hover:text-white ${
          i18n.language === "vi" ? "text-white" : "text-blurColor"
        }`}
          onClick={() => handleChangeLanguages("vi")}
        >
          VN
        </span>
        <div
          className={`avatar relative text-blurColor text-2xl ml-3 cursor-pointer hover:text-white flex items-center justify-center gap-0 mr-5`}
          onClick={() => setOpenModelUser(!openModelUser)}
        >
          <BsFillPersonFill className={``} />
          {openModelUser ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
          <AnimatePresence>
            {openModelUser && (
              <motion.div
                initial={{ opacity: 0, translateY: -50 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: -50 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="avatar-modal absolute top-16 -right-0 z-5 rounded-lg shadow w-72 bg-blue-800 divide-blue-600"
              >
                <div className="px-4 py-3 text-md text-white">
                  <div className="flex items-center gap-1 cursor-text">
                    <MdOutlineEmail className="mt-1" />
                    <span>
                      {currentUser?.email
                        ? currentUser.email
                        : "expamle@vnu.edu.vn"}
                    </span>
                  </div>
                </div>
                <ul className="py-2  text-gray-200 border-t border-b border-slate-400">
                  <li>
                    <div className="flex items-center gap-1 px-4 py-2 hover:bg-blue-600 hover:text-white">
                      <AiFillEdit />{" "}
                      <span>{t("system.header.edit-profile")}</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center gap-1 px-4 py-2 hover:bg-blue-600 hover:text-white ">
                      <AiFillUnlock />{" "}
                      <span>{t("system.header.change-password")}</span>
                    </div>
                  </li>
                </ul>
                <div className="py-2">
                  <div
                    className="flex items-center gap-1 px-4 py-2  hover:bg-blue-600 hover:text-white text-gray-200"
                    onClick={() => handleLogOutSystem()}
                  >
                    <BiLogOutCircle />{" "}
                    <span>{t("system.header.sign-out")}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  // console.log(
  //   JSON.parse(localStorage.getItem("auth-bookingCare-UET")).userInfo
  // );
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    if (
      localStorage.getItem("auth-bookingCare-UET_system") &&
      JSON.parse(localStorage.getItem("auth-bookingCare-UET_system"))?.role
    ) {
      setCurrentUser(
        JSON.parse(localStorage.getItem("auth-bookingCare-UET_system"))?.role
      );
    }
  }, []);

  return <>{currentUser === "R1" ? <HeaderAdmin /> : <HeaderUser />}</>;
};

export default Header;
