import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { BsFillPersonFill } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import {
  MdOutlineEmail,
  MdOutlineNotificationAdd,
  MdNotificationsNone,
} from "react-icons/md";
import { AiFillEdit, AiFillUnlock } from "react-icons/ai";
import { BiLogOutCircle } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdEye } from "react-icons/io";
import { BsEyeSlash } from "react-icons/bs";
import { RiDeleteBack2Fill } from "react-icons/ri";

import { MdDashboard } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { TbBellRinging } from "react-icons/tb";

import "./Header.scss";
import { logOutUser } from "../../../redux/authSlice";
import { path } from "../../../utils/constant";
import { NavLink } from "react-router-dom";
import { logOutApi, updatePasswordSystem } from "../../../services/userService";
import moment from "moment";

import { socket } from "../../../index";
import { toast, ToastContainer } from "react-toastify";
import {
  getNotiFy,
  updateNotifyToOld,
} from "../../../services/notificationService";
import { handleMessageFromBackend } from "../../../utils/handleMessageFromBackend";
import {
  setChangeNotifyButton,
  setChangeNotifyIcon,
  setCountNewNotifyManager,
  setOptionNotification,
  setPathNameOfNotifySeeAll,
} from "../../../redux/socketNotifyManager";

const HeaderUser = ({ openModelUpdatePass }) => {
  const pathName = useLocation()?.pathname;

  const { t, i18n } = useTranslation();
  const [openModelUser, setOpenModelUser] = useState(false);
  const currentUser = useSelector((state) => state.authReducer);
  const [socketNotify, setSocketNotify] = useState(false);
  const dispatch = useDispatch();
  const countNewNotificationRedux = useSelector(
    (state) => state.socketNotifyManagerReducer.countNewNotifyManager
  );
  const changeNotifyIcon = useSelector(
    (state) => state.socketNotifyManagerReducer.changeNotifyIcon
  );

  const [isPathNameOfNotifySeeAll, setIsPathNameOfNotifySeeAll] =
    useState(false);
  const [countNewNotification, setCountNewNotification] = useState(
    countNewNotificationRedux
  );

  if (
    pathName === `${path.MANAGER}/${path.notification}` &&
    isPathNameOfNotifySeeAll === false
  ) {
    setIsPathNameOfNotifySeeAll(true);
  } else if (
    pathName !== `${path.MANAGER}/${path.notification}` &&
    isPathNameOfNotifySeeAll === true
  ) {
    setIsPathNameOfNotifySeeAll(false);
  }

  useEffect(() => {
    const listenNewBookingFromBackend = (data) => {
      console.log("1");
      const { managerId, roleManager, action } = data;
      if (managerId === currentUser?.id && roleManager === currentUser?.role) {
        if (action === "A1") {
          toast.info(
            i18n.language === "en"
              ? `You recently had a new appointment from student(${moment(
                  new Date()
                ).calendar()}).`
              : `Bạn vừa có một lịch hẹn mới từ sinh viên (${moment(
                  new Date()
                ).calendar()}).`,
            {
              autoClose: 5000,
              theme: "colored",
              position: "bottom-right",
            }
          );
        } else {
          toast.info(
            i18n.language === "en"
              ? `You recently had a new question from student (${moment(
                  new Date()
                ).calendar()}).`
              : `Bạn vừa có một câu hỏi mới từ sinh viên (${moment(
                  new Date()
                ).calendar()}).`,
            {
              autoClose: 5000,
              theme: "colored",
              position: "bottom-right",
            }
          );
        }
        dispatch(setChangeNotifyIcon(true));
        setCountNewNotification((previousState) => {
          dispatch(setCountNewNotifyManager(previousState + 1));
          return previousState + 1;
        });
        // if () {
        //   console.log("oo hay");
        //   dispatch(setChangeNotifyButton(true));
        // }
        setIsPathNameOfNotifySeeAll((previousState) => {
          if (previousState === true) {
            dispatch(setChangeNotifyButton(true));
          }
          return previousState;
        });
        dispatch(setOptionNotification("booking"));
      }
    };

    const listenNewNotifyFromSystem = (data) => {
      console.log("2");
      console.log(data);

      const { dataRoleManager, time } = data;
      const checkRole = dataRoleManager.includes(currentUser?.role);
      if (checkRole) {
        toast.info(
          i18n.language === "en"
            ? `You recently had a new notification from system (${moment(
                time
              ).calendar()}).`
            : `Bạn vừa có một thông báo mới từ hệ thống (${moment(
                time
              ).calendar()}).`,
          {
            autoClose: 5000,
            theme: "colored",
            position: "bottom-right",
          }
        );
        dispatch(setChangeNotifyIcon(true));
        setCountNewNotification((previousState) => {
          dispatch(setCountNewNotifyManager(previousState + 1));
          return previousState + 1;
        });
        // if () {
        //   console.log("oo hay");
        //   dispatch(setChangeNotifyButton(true));
        // }
        setIsPathNameOfNotifySeeAll((previousState) => {
          if (previousState === true) {
            dispatch(setChangeNotifyButton(true));
          }
          return previousState;
        });
        dispatch(setOptionNotification("system"));
      }
    };

    const listenCheckEventBookingScheduleComingFromBackend = (data) => {
      const { managerId, roleManager } = data;
      if (managerId === currentUser?.id && roleManager === currentUser?.role) {
        toast.info(
          i18n.language === "en"
            ? `You have an appointment with a student tomorrow. Check now! (${moment(
                new Date()
              ).calendar()})`
            : `Bạn có một lịch hẹn với sinh viên vào ngày mai. Kiểm tra ngay! (${moment(
                new Date()
              ).calendar()})`,
          {
            autoClose: 5000,
            theme: "colored",
            position: "bottom-right",
          }
        );
        dispatch(setChangeNotifyIcon(true));
        setCountNewNotification((previousState) => {
          dispatch(setCountNewNotifyManager(previousState + 1));
          return previousState + 1;
        });
        // if () {
        //   console.log("oo hay");
        //   dispatch(setChangeNotifyButton(true));
        // }
        setIsPathNameOfNotifySeeAll((previousState) => {
          if (previousState === true) {
            dispatch(setChangeNotifyButton(true));
          }
          return previousState;
        });
        dispatch(setOptionNotification("booking"));
      }
    };

    if (!socket.hasListeners("new_booking")) {
      socket.on("new_booking", (data) => listenNewBookingFromBackend(data));
    }
    if (!socket.hasListeners("new_notification_system")) {
      socket.on("new_notification_system", (data) =>
        listenNewNotifyFromSystem(data)
      );
    }
    if (!socket.hasListeners("check_event_booking_schedule_coming")) {
      socket.on("check_event_booking_schedule_coming", (data) =>
        listenCheckEventBookingScheduleComingFromBackend(data)
      );
    }

    return () => {
      socket.off("new_booking", listenNewBookingFromBackend);
      socket.off("new_notification_system", listenNewNotifyFromSystem);
      socket.off(
        "check_event_booking_schedule_coming",
        listenCheckEventBookingScheduleComingFromBackend
      );
    };
  }, []);

  useEffect(() => {
    //getCountNewNotify
    getNotiFy
      .getCountNewNotify({
        type: "manager",
        managerId: currentUser?.id,
        roleManager: currentUser?.role,
      })
      .then((data) => {
        if (data?.codeNumber === 0) {
          console.log("header_user");
          dispatch(setCountNewNotifyManager(data?.countNewNotify));
          setCountNewNotification(data?.countNewNotify);
        }
      });
  }, []);

  useEffect(() => {
    const handleToggleProfileSystem = (e) => {
      console.log(divProfileSystem);
      // const profileSystemDropdown = document.querySelector(
      //   ".profile-system-dropdown"
      // );

      e.target.parentElement.classList.toggle("appear");
    };

    const handleCloseProfileSystem = (e) => {
      console.log(3);
      const divProfileSystem = document.querySelector(".div-profile-system");
      if (
        divProfileSystem.childNodes[0] !== e.target &&
        divProfileSystem.childNodes[1] !== e.target
      ) {
        console.log(4);

        divProfileSystem.classList.remove("appear");
      }
    };

    const divProfileSystem = document.querySelector(".div-profile-system");

    if (divProfileSystem) {
      divProfileSystem.addEventListener("click", handleToggleProfileSystem);
    }

    document.addEventListener("click", handleCloseProfileSystem);

    return () => {
      if (divProfileSystem) {
        divProfileSystem.removeEventListener(
          "click",
          handleToggleProfileSystem
        );
      }

      document.removeEventListener("click", handleCloseProfileSystem);
    };
  }, []);

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

  const handleResetNotify = async () => {
    if (+countNewNotificationRedux > 0) {
      updateNotifyToOld({
        type: "manager",
        managerId: currentUser?.id,
        roleManager: currentUser?.role,
      }).then((data) => {
        dispatch(setCountNewNotifyManager(0));
        setCountNewNotification(0);
        dispatch(setChangeNotifyIcon(false));
        navigate(`${path.MANAGER}/${path.notification}`);
      });
    } else {
      navigate(`${path.MANAGER}/${path.notification}`);
    }
  };

  return (
    <div className="system-header-container fixed top-0 left-0 right-0 flex items-center justify-between shadow-md backdrop-blur-md shadow-blurColor">
      <div className="system-header-item-left flex items-center justify-start">
        <NavLink
          to={`${path.MANAGER}/${path.dashboard}`}
          className="system-header-text relative text-blurColor font-semibold text-lg w-1/5 h-full flex items-center gap-1
       justify-center cursor-pointer pl-3 hover:text-white transition-all duration-200"
          style={({ isActive }) => ({
            color: isActive ? "#fff" : "rgb(195, 181, 181)",
          })}
        >
          <MdDashboard className="text-lg" />
          <span>{i18n.language === "en" ? "Dashboard" : "Tổng quan"}</span>
        </NavLink>
        <div
          className="system-header-text relative text-blurColor font-semibold text-lg w-1/5 h-full flex items-center gap-1
       justify-center cursor-pointer pl-3 hover:text-white transition-all duration-200"
        >
          <BsPencilSquare className="text-lg" />
          <span>
            {i18n.language === "en" ? "Schedule & Question" : "Lịch và câu hỏi"}
          </span>
          <IoIosArrowDown className="text-lg relative" style={{ top: "1px" }} />
          <ul
            className="absolute system-header-dropdown left-0 list-none flex flex-col justify-center w-300"
            style={{
              top: "50px",
              backgroundColor: "#fff",
              border: "1px solid #cccdc9",
              padding: "15px",
            }}
          >
            <NavLink
              to={`${path.MANAGER}/${path.schedule}`}
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
              <li>
                {/* {t("system.header.manager-schedule")} */}
                {i18n.language === "en" ? "Create Appointment" : "Tạo lịch hẹn"}
              </li>
            </NavLink>
            <NavLink
              to={`${path.MANAGER}/${path.student}`}
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
              <li>
                {i18n.language === "en"
                  ? "Schedule/Question Management"
                  : "Quản lý lịch và câu hỏi"}
              </li>
            </NavLink>
          </ul>
        </div>
        <NavLink
          to={`${path.MANAGER}/${path.notification}`}
          className={`system-header-text relative font-semibold text-lg w-1/5 h-full flex items-center gap-1
       justify-center cursor-pointer pl-3 transition-all duration-200`}
          style={({ isActive }) => ({
            color: isActive ? "#fff" : "rgb(195, 181, 181)",
          })}
          onClick={() => handleResetNotify()}
        >
          <div className="relative flex items-center justify-center gap-2">
            {changeNotifyIcon && <TbBellRinging className={`text-2xl bell`} />}
            {!changeNotifyIcon && <MdNotificationsNone className="text-2xl" />}
            {+countNewNotificationRedux > 0 && (
              <div className="absolute -right-[9px] -top-[12px] flex items-center justify-center w-6 h-5 p-1 text-white bg-red-600 rounded-full">
                <span className="text-xs">{`${countNewNotificationRedux}+`}</span>
              </div>
            )}
          </div>
          <span>{i18n.language === "en" ? "Notification" : "Thông báo"}</span>
        </NavLink>
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
          className={`div-profile-system avatar relative text-blurColor text-2xl ml-3 cursor-pointer hover:text-white flex items-center justify-center gap-0 mr-5`}
          onClick={() => setOpenModelUser(!openModelUser)}
        >
          <span className="font-semibold" style={{ fontSize: "16px" }}>
            {i18n.language === "en" ? "Account" : "Tài khoản"}
          </span>
          <IoMdArrowDropdown />

          <div
            initial={{ opacity: 0, translateY: -50 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -50 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="profile-system-dropdown avatar-modal absolute top-16 -right-0 z-5 rounded-lg shadow w-72 bg-blue-800 divide-blue-600"
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
            <ul className="py-2 profile-user-manager text-gray-200 border-t border-b border-slate-400">
              <li>
                <div
                  className="flex items-center gap-1 px-4 py-2 hover:bg-blue-600 hover:text-white"
                  onClick={() =>
                    navigate(`${path.MANAGER}/${path.updateProfile}`)
                  }
                >
                  <AiFillEdit /> <span>{t("system.header.edit-profile")}</span>
                </div>
              </li>
              <li>
                <div
                  className="flex items-center gap-1 px-4 py-2 hover:bg-blue-600 hover:text-white "
                  onClick={() => openModelUpdatePass(true)}
                >
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
                <BiLogOutCircle /> <span>{t("system.header.sign-out")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeaderAdmin = ({ openModelUpdatePass }) => {
  const { t, i18n } = useTranslation();
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

  useEffect(() => {
    const handleToggleProfileSystem = (e) => {
      console.log(divProfileSystem);
      // const profileSystemDropdown = document.querySelector(
      //   ".profile-system-dropdown"
      // );

      e.target.parentElement.classList.toggle("appear");
    };

    const handleCloseProfileSystem = (e) => {
      console.log(3);
      const divProfileSystem = document.querySelector(".div-profile-system");
      if (
        divProfileSystem.childNodes[0] !== e.target &&
        divProfileSystem.childNodes[1] !== e.target
      ) {
        console.log(4);

        divProfileSystem.classList.remove("appear");
      }
    };

    const divProfileSystem = document.querySelector(".div-profile-system");

    if (divProfileSystem) {
      divProfileSystem.addEventListener("click", handleToggleProfileSystem);
    }

    document.addEventListener("click", handleCloseProfileSystem);

    return () => {
      if (divProfileSystem) {
        divProfileSystem.removeEventListener(
          "click",
          handleToggleProfileSystem
        );
      }

      document.removeEventListener("click", handleCloseProfileSystem);
    };
  }, []);

  return (
    <div className="system-header-container fixed top-0 left-0 right-0 flex items-center justify-between shadow-md backdrop-blur-md shadow-blurColor">
      <div className="system-header-item-left flex items-center justify-start">
        <NavLink
          to={path.dashboardSystem}
          className="system-header-text relative text-blurColor font-semibold text-lg w-1/6 h-full flex items-center gap-1
       justify-center cursor-pointer pl-3 hover:text-white transition-all duration-200"
          style={({ isActive }) => ({
            color: isActive ? "#fff" : "rgb(195, 181, 181)",
          })}
        >
          <MdDashboard className="text-lg" />
          <span>{i18n.language === "en" ? "Dashboard" : "Tổng quan"}</span>
        </NavLink>
        <div
          className="system-header-text relative text-blurColor font-semibold text-lg w-1/6 h-full flex items-center gap-1
       justify-center cursor-pointer pl-3 hover:text-white transition-all duration-200"
        >
          <span>
            {i18n.language === "en" ? "Schedule & Question" : "Lịch và câu hỏi"}
          </span>
          <IoIosArrowDown className="text-lg relative" style={{ top: "1px" }} />
          <ul
            className="absolute system-header-dropdown left-0 list-none flex flex-col justify-center w-300"
            style={{
              top: "50px",
              backgroundColor: "#fff",
              border: "1px solid #cccdc9",
              padding: "15px",
            }}
          >
            <NavLink
              to={path.createScheduleSystem}
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
              <li>
                {i18n.language === "en"
                  ? "Create Appointment"
                  : "Tạo lịch hẹn mới"}
              </li>
            </NavLink>
            <NavLink
              to={path.scheduleAndQuestionSystem}
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
              <li>
                {i18n.language === "en"
                  ? "Schedule/Question Management"
                  : "Quản lý lịch và câu hỏi"}
              </li>
            </NavLink>
          </ul>
        </div>

        <div
          className={`system-header-text relative text-blurColor font-semibold text-lg w-1/6 h-full flex items-center gap-1
       justify-center cursor-pointer hover:text-white transition-all duration-200`}
        >
          <span>
            {i18n.language === "en" ? "User Management" : "Quản lý người dùng"}
          </span>
          <IoIosArrowDown className="text-lg relative" style={{ top: "1px" }} />
          <ul
            className="system-header-dropdown absolute left-0 list-none flex items-center justify-center gap-4 min-w-[750px]"
            style={{
              top: "50px",
              backgroundColor: "#fff",
              border: "1px solid #cccdc9",
              padding: "15px",
            }}
          >
            <NavLink
              to={path.departmentSystem}
              className="system-header-option text-lg relative"
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
              <li>{t("system.header.department")}</li>
              <IoIosArrowDown
                className="text-lg relative"
                style={{ top: "1px" }}
              />
            </NavLink>
            <NavLink
              to={path.facultySystem}
              className="system-header-option text-lg relative"
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
              <li>{t("system.header.faculty")}</li>
              <IoIosArrowDown
                className="text-lg relative"
                style={{ top: "1px" }}
              />
            </NavLink>
            <NavLink
              to={path.teacherSystem}
              className="system-header-option text-lg relative"
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
              <li>{t("system.header.teacher")}</li>
              <IoIosArrowDown
                className="text-lg relative"
                style={{ top: "1px" }}
              />
            </NavLink>
            <NavLink
              to={path.healthStudentSystem}
              className="system-header-option text-lg relative"
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
              <li>{t("system.header.health-student")}</li>
              <IoIosArrowDown
                className="text-lg relative"
                style={{ top: "1px" }}
              />
            </NavLink>
          </ul>
        </div>

        <div
          className="system-header-text relative text-blurColor font-semibold text-lg w-1/5 h-full flex items-center gap-1
       justify-center cursor-pointer pl-3 hover:text-white transition-all duration-200"
        >
          <MdOutlineNotificationAdd className="text-lg" />
          <span>
            {i18n.language === "en"
              ? "Notification And News"
              : "Tin tức và thông báo"}
          </span>
          <IoIosArrowDown className="text-lg relative" style={{ top: "1px" }} />
          <ul
            className="absolute system-header-dropdown left-0 list-none flex flex-col justify-center w-[220px]"
            style={{
              top: "50px",
              backgroundColor: "#fff",
              border: "1px solid #cccdc9",
              padding: "15px",
            }}
          >
            <NavLink
              to={path.notificationSystem}
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
              <li>{i18n.language === "en" ? "Notification" : "Thông báo"}</li>
            </NavLink>
            <NavLink
              to={path.newsSystem}
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
              <li>{i18n.language === "en" ? "News" : "Tin tức"}</li>
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
          className={`div-profile-system avatar relative text-blurColor text-2xl ml-3 cursor-pointer hover:text-white flex items-center justify-center gap-0 mr-5`}
        >
          <span className="font-semibold" style={{ fontSize: "16px" }}>
            {i18n.language === "en" ? "Account" : "Tài khoản"}
          </span>
          <IoMdArrowDropdown />
          <div className="profile-system-dropdown avatar-modal absolute top-16 -right-0 z-5 rounded-lg shadow w-72 bg-blue-800 divide-blue-600">
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
            <ul className="py-2 profile-user-manager text-gray-200 border-t border-b border-slate-400">
              {/* <li>
                <div className="flex items-center gap-1 px-4 py-2 hover:bg-blue-600 hover:text-white">
                  <AiFillEdit /> <span>{t("system.header.edit-profile")}</span>
                </div>
              </li> */}
              <li>
                <div
                  className="flex items-center gap-1 px-4 py-2 hover:bg-blue-600 hover:text-white "
                  onClick={() => openModelUpdatePass(true)}
                >
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
                <BiLogOutCircle /> <span>{t("system.header.sign-out")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log("render");
  const currentUser = useSelector((state) => state.authReducer);
  const [isUpdatePassword, setIsUpdatePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifyCheckState, setNotifyCheckState] = useState("");
  const [eye, setEye] = useState(false);

  const handleUpdatePassword = () => {
    const stateArr = [currentPassword, newPassword, confirmPassword];
    const notification_en = [
      "Current Password",
      "New password",
      "Confirm New Password",
    ];
    const notification_vi = [
      "Trường mật khẩu hiện tại",
      "Trường mật khẩu mới",
      "Trường xác nhận mật khẩu mới",
    ];
    for (let i = 0; i < stateArr.length; i++) {
      if (!stateArr[i]) {
        if (i18n.language === "vi") {
          setNotifyCheckState(
            `${notification_vi[i]} ${t("system.notification.required")}`
          );
        } else {
          setNotifyCheckState(
            `${notification_en[i]} ${t("system.notification.required")}`
          );
        }
        return;
      }
    }
    const regexPassword =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (
      !regexPassword.test(currentPassword) ||
      !regexPassword.test(newPassword) ||
      !regexPassword.test(confirmPassword)
    ) {
      setNotifyCheckState(`${t("system.notification.password")}`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setNotifyCheckState(t("system.notification.matchPassword"));
      return;
    }
    //change Password
    updatePasswordSystem(
      {},
      {
        email: currentUser?.email,
        currentPassword,
        newPassword,
        roleId: currentUser?.role,
      }
    ).then((data) => {
      if (data?.codeNumber === 0) {
        setCurrentPassword("");
        setConfirmPassword("");
        setNewPassword("");
        setIsUpdatePassword(false);
        toast.success(
          i18n.language === "en" ? data?.message_en : data?.message_vn,
          {
            autoClose: 3000,
            theme: "colored",
            position: "bottom-right",
          }
        );
      } else {
        const response = handleMessageFromBackend(data, i18n.language);
        toast.error(response, {
          autoClose: 3000,
          theme: "colored",
          position: "bottom-right",
        });
        if (data?.codeNumber === -2) {
          setTimeout(() => {
            logOutApi.logoutUser({}).then((data) => {
              if (data?.codeNumber === 0) {
                dispatch(logOutUser());
                navigate(
                  `${path.SYSTEM}/${path.LOGIN_SYSTEM}?redirect=/system`
                );
              }
            });
          }, 5000);
        }
      }
    });
  };

  return (
    <>
      {currentUser?.role === "R1" ? (
        <HeaderAdmin openModelUpdatePass={setIsUpdatePassword} />
      ) : (
        <HeaderUser openModelUpdatePass={setIsUpdatePassword} />
      )}
      {/* update Password Student */}
      {isUpdatePassword && (
        <div className="fixed modal-update-password-overlay top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25"></div>
      )}

      <AnimatePresence>
        {isUpdatePassword && (
          <motion.div
            initial={{ opacity: 0, translateY: -50 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -50 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="modal-update-password-dropdown fixed top-1 w-[60%] flex flex-col h-auto bg-white rounded-lg shadow backdrop-blur-md mx-auto mt-16 py-3 px-5 overflow-hidden"
            style={{ left: "20%" }}
          >
            <p className="text-lg text-blurThemeColor font-semibold border-b-2 border-gray-200 py-2">
              {i18n.language === "en" ? "Update Password" : "Cập nhật mật khẩu"}
            </p>
            <div className="password_previous mt-4 w-[90%] mx-auto flex items-center justify-center gap-4 py-2 relative">
              <label className="w-[240px] font-semibold text-headingColor max-w-[200px]">
                {i18n.language === "en"
                  ? "Current Password:"
                  : "Mật khẩu hiện tại:"}
              </label>
              <input
                autoComplete="false"
                onFocus={() => setNotifyCheckState("")}
                className={` flex-1 shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light
                                  `}
                value={currentPassword}
                id="classroom"
                type={eye ? "text" : "password"}
                name="classroom"
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              {eye ? (
                <IoMdEye
                  className="absolute right-2 bottom-5 cursor-pointer"
                  onClick={() => setEye(false)}
                />
              ) : (
                <BsEyeSlash
                  className="absolute right-2 bottom-5 cursor-pointer"
                  onClick={() => setEye(true)}
                />
              )}
            </div>
            <div className="password_new w-[90%] mx-auto flex items-center justify-center gap-4 py-2">
              <label className="w-[240px] font-semibold text-headingColor max-w-[200px]">
                {i18n.language === "en" ? "New Password:" : "Mật khẩu mới:"}
              </label>
              <input
                autoComplete="false"
                onFocus={() => setNotifyCheckState("")}
                className={` flex-1 shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light
                                  `}
                value={newPassword}
                id="classroom"
                type={eye ? "text" : "password"}
                name="classroom"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="password_confirm w-[90%] mx-auto flex items-center justify-center gap-4 py-2">
              <label className="w-[200px] font-semibold text-headingColor max-w-[200px]">
                {i18n.language === "en"
                  ? "Confirm New Password:"
                  : "Nhập lại mật khẩu mới:"}
              </label>
              <input
                autoComplete="false"
                onFocus={() => setNotifyCheckState("")}
                className={` flex-1 shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light
                                  `}
                value={confirmPassword}
                id="classroom"
                type={eye ? "text" : "password"}
                name="classroom"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <span
              className="mx-auto text-red-500 my-2"
              style={notifyCheckState ? { opacity: "1" } : { opacity: "0" }}
            >
              {notifyCheckState ? notifyCheckState : "Null"}
            </span>
            <div className="flex items-center justify-between">
              <button
                className={`bg-blurThemeColor text-white mt-6 py-2 px-1 font-semibold rounded-md shadow backdrop-blur-md bg-opacity-80 hover:bg-opacity-100`}
                style={{ maxWidth: "15%", width: "15%" }}
                onClick={() => handleUpdatePassword()}
              >
                {t("system.teacher.save")}
              </button>
              <button
                className={` text-white mt-6 py-2 px-1 font-semibold rounded-md shadow backdrop-blur-md bg-opacity-80 hover:bg-opacity-100 bg-green-600`}
                style={{ maxWidth: "10%", width: "10%" }}
                onClick={() => setIsUpdatePassword(false)}
              >
                {t("system.teacher.close")}
              </button>
            </div>
            <RiDeleteBack2Fill
              className="absolute top-4 right-2 text-blurThemeColor text-3xl cursor-pointer opacity-80 hover:opacity-100 transition-all duration-300"
              onClick={() => setIsUpdatePassword(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
