import React, { Fragment, useEffect, useRef, useState } from "react";

import { Link, NavLink, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { MdContactSupport } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown } from "react-icons/io";
import { AiFillHome } from "react-icons/ai";
import { RiDeleteBack2Line } from "react-icons/ri";

import "./HomeHeader.scss";
import { path } from "../../utils/constant";
import { BsFillPersonFill } from "react-icons/bs";
import { GoBell } from "react-icons/go";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { MdOutlineEmail } from "react-icons/md";
import { AiFillEdit, AiFillUnlock } from "react-icons/ai";
import { BiLogOutCircle } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOutApi, logOutHomePageApi } from "../../services/userService";
import { logOutUser } from "../../redux/studentSlice";
import { IoMdEye } from "react-icons/io";
import { BsEyeSlash } from "react-icons/bs";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { updateStudent } from "../../services/studentService";
import { ToastContainer, toast } from "react-toastify";
import { handleMessageFromBackend } from "../../utils/handleMessageFromBackend";
import { socket } from "../../index";
import moment from "moment";
import {
  getPreviousFeedback,
  saveFeedback,
} from "../../services/student_feedback";
import flag_en from "../../assets/image/en.png";
import flag_vi from "../../assets/image/vi.png";
import { FaBell } from "react-icons/fa";
import { TbBellRinging } from "react-icons/tb";
import {
  getNotiFy,
  updateNotifyToOld,
} from "../../services/notificationService";
import {
  setChangeNotifyButton,
  setChangeNotifyIcon,
  setCountNewNotifyHomePage,
  setPathNameOfNotifySeeAll,
} from "../../redux/socketNotifyHomePage";
import surveyImage from "../../assets/image/survey.png";

//connect_socket_backend

const HomeHeader = ({ action }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pathName = useLocation()?.pathname;

  //update password
  const [isUpdatePassword, setIsUpdatePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifyCheckState, setNotifyCheckState] = useState("");
  const [eye, setEye] = useState(false);
  const [isOpenMentalSurvey, setIsOpenMentalSurvey] = useState(false);
  const currentUser = useSelector((state) => state.studentReducer);
  const countNewNotificationRedux = useSelector(
    (state) => state.socketNotifyHomepageReducer.countNewNotifyHomePage
  );
  const changeNotifyIcon = useSelector(
    (state) => state.socketNotifyHomepageReducer.changeNotifyIcon
  );
  // const pathNameOfNotifySeeAll = useSelector(
  //   (state) => state.socketNotifyHomepageReducer.pathNameOfNotifySeeAll
  // );

  const [isPathNameOfNotifySeeAll, setIsPathNameOfNotifySeeAll] =
    useState(false);
  const [countNewNotification, setCountNewNotification] = useState(
    countNewNotificationRedux
  );

  const languageDropDownRef = useRef();
  const languageDivRef = useRef();
  const profileDivRef = useRef();
  const profileDropDownRef = useRef();

  //check pathName Current

  if (
    pathName === `${path.HOMEPAGE}/${path.notify}` &&
    isPathNameOfNotifySeeAll === false
  ) {
    setIsPathNameOfNotifySeeAll(true);
  } else if (
    pathName !== `${path.HOMEPAGE}/${path.notify}` &&
    isPathNameOfNotifySeeAll === true
  ) {
    setIsPathNameOfNotifySeeAll(false);
  }
  useEffect(() => {
    let divProfile, divLanguage;
    const handleClickDivLanguage = () => {
      languageDropDownRef.current.classList.toggle("appear");
    };
    const handleClickDivProfile = () => {
      console.log(2222222);
      profileDropDownRef.current.classList.toggle("appear");
    };
    function handleClickOutDiv(event) {
      if (
        event.target !== languageDivRef.current &&
        event.target !== languageDivRef.current.childNodes[0] &&
        event.target !== languageDivRef.current.childNodes[1]
      ) {
        languageDropDownRef.current.classList.remove("appear");
      }

      if (JSON.parse(localStorage.getItem("auth-bookingCare-UET_student"))) {
        if (
          event.target !== profileDivRef.current &&
          event.target !== profileDivRef.current.childNodes[0] &&
          event.target !== profileDivRef.current.childNodes[1]
        ) {
          console.log(33333);
          profileDropDownRef.current.classList.remove("appear");
        }
      }
    }
    divLanguage = document.querySelector(".header_homepage_language");
    divLanguage.addEventListener("click", handleClickDivLanguage);
    document.addEventListener("click", handleClickOutDiv);
    if (JSON.parse(localStorage.getItem("auth-bookingCare-UET_student"))) {
      divProfile = document.querySelector(".header_homepage_profile");

      divProfile.addEventListener("click", handleClickDivProfile);
    }

    return () => {
      console.log("running");
      document.removeEventListener("click", handleClickOutDiv);
      divLanguage.removeEventListener("click", handleClickDivLanguage);
      if (JSON.parse(localStorage.getItem("auth-bookingCare-UET_student"))) {
        if (divProfile) {
          divProfile.removeEventListener("click", handleClickDivProfile);
        }
      }
    };
  }, []);

  useEffect(() => {
    const listenNewUpdateBookingFromBackend = (data) => {
      console.log("action" + JSON.stringify(data));

      const { studentId, type, actionId } = data;
      if (studentId === currentUser?.id) {
        if (actionId === "A2") {
          if (type === "done") {
            toast.info(
              i18n.language === "en"
                ? `A question has recently answered. Check now! (${moment(
                    new Date()
                  ).calendar()})`
                : `Một câu hỏi của bạn vừa được trả lời. Kiểm tra ngay! (${moment(
                    new Date()
                  ).calendar()})`,
              {
                autoClose: 5000,
                theme: "colored",
                position: "bottom-right",
              }
            );
          }
        } else if (actionId === "A1") {
          if (type === "process") {
            toast.info(
              i18n.language === "en"
                ? `A appointment has recently approved. Check now! (${moment(
                    new Date()
                  ).calendar()})`
                : `Một lịch hẹn của bạn vừa được chấp nhận. Kiểm tra ngay! (${moment(
                    new Date()
                  ).calendar()})`,
              {
                autoClose: 5000,
                theme: "colored",
                position: "bottom-right",
              }
            );
          } else if (type === "done") {
            toast.info(
              i18n.language === "en"
                ? `A appointment has recently finished. Thanks for your using! (${moment(
                    new Date()
                  ).calendar()})`
                : `Một lịch hẹn của bạn vừa được xác nhận hoàn thành. Cảm ơn vì đã sử dụng dịch vụ! (${moment(
                    new Date()
                  ).calendar()})`,
              {
                autoClose: 5000,
                theme: "colored",
                position: "bottom-right",
              }
            );
          } else if (type === "cancel") {
            toast.info(
              i18n.language === "en"
                ? `Ohhh! A appointment has recently canceled. Please find the reason of the cancelation. (${moment(
                    new Date()
                  ).calendar()})`
                : `Ohhh! Một lịch hẹn của bạn vừa bị huỷ. Vui lòng tìm hiểu lý do huỷ. (${moment(
                    new Date()
                  ).calendar()})`,
              {
                autoClose: 5000,
                theme: "colored",
                position: "bottom-right",
              }
            );
          }
        }
        dispatch(setChangeNotifyIcon(true));
        setCountNewNotification((previousState) => {
          dispatch(setCountNewNotifyHomePage(previousState + 1));
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
      }
    };
    if (
      JSON.parse(localStorage.getItem("auth-bookingCare-UET_student")) &&
      !socket.hasListeners("new_notification_for_student_about_update_booking")
    ) {
      console.log("listen");
      socket.on("new_notification_for_student_about_update_booking", (data) =>
        listenNewUpdateBookingFromBackend(data)
      );
    }

    return () => {
      console.log("cleanup");
      socket.off(
        "new_notification_for_student_about_update_booking",
        listenNewUpdateBookingFromBackend
      );
    };
  }, []);

  useEffect(() => {
    //getCountNewNotify
    if (JSON.parse(localStorage.getItem("auth-bookingCare-UET_student"))) {
      getNotiFy
        .getCountNewNotify({
          type: "student",
          studentId: currentUser?.id,
        })
        .then((data) => {
          if (data?.codeNumber === 0) {
            // setCountNewNotification(data?.countNewNotify);
            dispatch(setCountNewNotifyHomePage(data?.countNewNotify));
            setCountNewNotification(data?.countNewNotify);
          }
        });
    }
  }, []);

  const handleChangeLanguages = (language) => {
    i18n.changeLanguage(language);
  };

  const handleLogOutHomePage = () => {
    logOutHomePageApi.logoutUser({}).then((data) => {
      if (data?.codeNumber === 0) {
        dispatch(logOutUser());
        navigate(`${path.HOMEPAGE}/${path.login_homepage}?redirect=/homepage`);
      } else {
      }
    });
  };

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
    updateStudent
      .updatePassword(
        {},
        {
          email: currentUser?.email,
          currentPassword,
          newPassword,
        }
      )
      .then((data) => {
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
              logOutHomePageApi.logoutUser({}).then((data) => {
                if (data?.codeNumber === 0) {
                  dispatch(logOutUser());
                  navigate(
                    `${path.HOMEPAGE}/${path.login_homepage}?redirect=/homepage`
                  );
                }
              });
            }, 5000);
          }
        }
      });
  };

  const handleResetNotify = async () => {
    if (countNewNotificationRedux > 0) {
      updateNotifyToOld({
        type: "student",
        studentId: currentUser?.id,
      }).then((data) => {
        dispatch(setCountNewNotifyHomePage(0));
        setCountNewNotification(0);
        dispatch(setChangeNotifyIcon(false));
        navigate(`${path.HOMEPAGE}/${path.notify}`);
      });
    } else {
      navigate(`${path.HOMEPAGE}/${path.notify}`);
    }
  };

  const handlePrePsyChologicalSurvey = () => {
    setIsOpenMentalSurvey(true);
  };

  return (
    <Fragment>
      <div className="homepage-header-container flex items-center">
        <ToastContainer />
        <div className="homepage-herder-left">
          {/* <FaBars className="text-blurColor cursor-pointer text-3xl hover:text-white" /> */}
          <Link to={path.UET} target="_blank" rel="noopener noreferrer">
            <div className="logo"></div>
          </Link>
          <div>
            <div
              className=""
              style={{ color: "#1d5193", fontSize: "15px", fontWeight: "700" }}
            >
              {t("header.UET")}
            </div>
            <div className="text-md" style={{ color: "#1d5193" }}>
              {t("header.VNU")}
            </div>
          </div>
        </div>
        <div className="homepage-herder-right">
          <div className="homepage-herder-right-up">
            {JSON.parse(
              localStorage.getItem("auth-bookingCare-UET_student")
            ) && (
              <div
                className="relative cursor-pointer pr-2 flex items-center justify-center gap-2"
                onClick={() => handleResetNotify()}
              >
                {changeNotifyIcon ? (
                  <TbBellRinging className="bell relative -top-[1px] text-blurThemeColor text-xl" />
                ) : (
                  <GoBell className="text-blurThemeColor text-xl relative -top-[1px]" />
                )}
                {+countNewNotificationRedux > 0 && (
                  <div className="absolute right-[68px] -top-[12px] flex items-center justify-center w-6 h-5 p-1 text-white bg-red-600 rounded-full">
                    <span className="text-xs">{`${countNewNotificationRedux}+`}</span>
                  </div>
                )}
                <span className="text-sm">
                  {i18n.language === "en" ? "Notification" : "Thông báo"}
                </span>
              </div>
            )}
            <div className="relative">
              {i18n.language === "vi" ? (
                <div
                  className={`header_homepage_language text-sm ml-3 cursor-pointer flex items-center justify-center gap-2 text-black hover:text-blue-700 hover:opacity-100`}
                  ref={languageDivRef}
                >
                  <img
                    src={flag_vi}
                    alt=""
                    className="object-cover w-[20px] h-[15px]"
                    style={{ borderRadius: "8px" }}
                  />
                  <span className="flex items-center justify-center">
                    Tiếng Việt{" "}
                    <IoMdArrowDropdown className="hover:text-blue-700" />
                  </span>
                </div>
              ) : (
                <div
                  className={`header_homepage_language text-sm ml-3 cursor-pointer flex items-center justify-center gap-2 text-black hover:text-blue-700 hover:opacity-100`}
                  ref={languageDivRef}
                >
                  <img
                    src={flag_en}
                    alt=""
                    className="object-cover w-[20px] h-[15px]"
                    style={{ borderRadius: "8px" }}
                  />
                  <span className="flex items-center justify-center">
                    Tiếng Anh{" "}
                    <IoMdArrowDropdown className="hover:text-blue-700" />
                  </span>
                </div>
              )}

              <ul
                className="drop_down_language rounded-sm h-[72px] w-[100%] bg-white"
                style={{
                  position: "absolute",
                  zIndex: 5,
                  top: "19px",
                  right: "0px",
                  left: "12px",
                  cursor: "pointer",
                  boxShadow: "rgba(0, 0, 0, 0.25) 0px 1px 5px",
                  border: "1px solid rgb(201, 151, 151)",
                }}
                ref={languageDropDownRef}
              >
                <li className="">
                  <div
                    className={`text-center rounded-sm py-[4px] mx-[5px] my-[3px] hover:bg-gray-300 ${
                      i18n.language === "vi" ? "bg-gray-300" : "bg-white"
                    }`}
                    onClick={() => handleChangeLanguages("vi")}
                  >
                    {i18n.language === "en" ? "Vietnamese" : "Tiếng Việt"}
                  </div>
                </li>
                <li className="mt-1">
                  <div
                    className={`text-center rounded-sm py-[4px] mx-[5px] my-[3px] hover:bg-gray-300 ${
                      i18n.language === "en" ? "bg-gray-300" : "bg-white"
                    }`}
                    onClick={() => handleChangeLanguages("en")}
                  >
                    {i18n.language === "en" ? "English" : "Tiếng Anh"}
                  </div>
                </li>
              </ul>
            </div>

            {currentUser?.isLogin && currentUser?.role === "R3" && (
              <div
                className={`avatar relative text-black text-xl ml-3 cursor-pointer hover:text-blue-700 flex items-center justify-center gap-0`}
              >
                <div
                  className="header_homepage_profile flex items-center justify-center gap-3 ml-3"
                  ref={profileDivRef}
                >
                  <div
                    className="flex items-center justify-center rounded-full bg-blue-700 text-white
                            "
                    style={{ width: "30px", height: "30px", fontSize: "15px" }}
                  >
                    {currentUser?.fullName.slice(0, 1)}
                  </div>
                  <div
                    className="flex items-center justify-start gap-0.5 text-black "
                    style={{ fontSize: "13px" }}
                  >
                    {`${currentUser?.fullName} - #${
                      currentUser?.email.split("@")[0]
                    }`}
                  </div>
                </div>

                <div
                  className="drop_down_profile avatar-modal absolute right-0 top-11 z-50 rounded-lg  w-80 bg-white backdrop-blur-sm"
                  ref={profileDropDownRef}
                  style={{ boxShadow: "0 4px 20px rgba(0,0,0,.25)" }}
                >
                  <div
                    className=""
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "4px",
                      transform: "rotate(45deg)",
                      width: "18px",
                      height: "18px",
                      backgroundColor: "#fff",
                    }}
                  ></div>
                  <div className="text-sm text-headingColor">
                    <div className="h-full w-full flex items-center justify-start cursor-text">
                      <div
                        className="relative flex items-center justify-start"
                        style={{
                          width: "100px",
                          height: "100px",
                        }}
                      >
                        <div
                          className="flex items-center justify-center rounded-full bg-blue-700 text-white
                            absolute top-0 right-0 bottom-0 left-0 w-full h-full m-auto"
                          style={{ width: "60px", height: "60px" }}
                        >
                          <span className="" style={{ fontSize: "30px" }}>
                            {currentUser?.fullName.slice(0, 1)}
                          </span>
                        </div>
                      </div>
                      <div className="h-full flex flex-col items-start gap-2">
                        <span
                          className="font-semibold"
                          style={{ fontSize: "16px" }}
                        >
                          {currentUser?.fullName}
                        </span>
                        <span>{currentUser?.email}</span>
                      </div>
                    </div>
                  </div>
                  <ul className="profile-user-homepage py-2 text-headingColor border-t border-b border-slate-200">
                    <li>
                      <div
                        className="flex items-center gap-2 px-4 py-2 hover:text-blue-700"
                        onClick={() =>
                          navigate(`${path.HOMEPAGE}/${path.update_profile}`)
                        }
                      >
                        <AiFillEdit />{" "}
                        <span>
                          {i18n.language === "en"
                            ? "Edit Profile"
                            : "Cập nhật tài khoản"}
                        </span>
                      </div>
                    </li>
                    <li>
                      <div
                        className="flex items-center gap-2 px-4 py-2 hover:text-blue-700"
                        onClick={() => setIsUpdatePassword(true)}
                      >
                        <AiFillUnlock />{" "}
                        <span>
                          {i18n.language === "en"
                            ? "Change Password"
                            : "Thay đổi mật khẩu"}
                        </span>
                      </div>
                    </li>
                  </ul>
                  <div className="py-2">
                    <div
                      className="flex items-center gap-2 px-4 py-2  hover:text-blue-700 text-headingColor"
                      onClick={() => handleLogOutHomePage()}
                    >
                      <BiLogOutCircle />{" "}
                      <span>
                        {i18n.language === "en" ? "Sign out" : "Đăng xuất"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!currentUser?.isLogin && !currentUser?.role && (
              <div className="flex items-center justify-center gap-3 ml-3">
                <button
                  class="px-5 py-1.5 flex transition-all ease-in duration-150 items-center justify-center overflow-hidden text-sm font-semibold border border-blue-500 text-white  rounded-md bg-blue-500 hover:text-blue-500 hover:bg-white"
                  onClick={() =>
                    navigate(`${path.HOMEPAGE}/${path.login_homepage}`)
                  }
                >
                  <span class="">
                    {i18n.language === "en" ? "Login" : "Đăng nhập"}
                  </span>
                </button>
                <button
                  class="px-5 py-1.5 flex transition-all ease-in duration-150 items-center justify-center overflow-hidden text-sm font-semibold border border-red-500 text-white  rounded-md bg-red-500 hover:text-red-500 hover:bg-white"
                  onClick={() =>
                    navigate(`${path.HOMEPAGE}/${path.login_homepage}`)
                  }
                >
                  <span class="">
                    {i18n.language === "en" ? "Register" : "Đăng ký"}
                  </span>
                </button>
              </div>
            )}
          </div>
          {JSON.parse(localStorage.getItem("auth-bookingCare-UET_student")) && (
            <div className="homepage-herder-right-down">
              <NavLink
                to={path.HOMEPAGE}
                className="text-blue-700 text-3xl cursor-pointer rounded-full p-1"
                style={{ backgroundColor: "#edf5ff" }}
              >
                <AiFillHome
                  className="text-blue-700 text-3xl cursor-pointer rounded-full p-1"
                  style={{ backgroundColor: "#edf5ff" }}
                />
              </NavLink>
              <NavLink
                to={`${path.HOMEPAGE}/${path.inform}`}
                className="navigation text-md uppercase text-black hover:text-blue-700"
                style={({ isActive }) =>
                  isActive
                    ? {
                        color: "#1d5193",
                      }
                    : {}
                }
              >
                <span>{t("header.inform")}</span>
              </NavLink>
              <NavLink
                to={`${path.HOMEPAGE}/${path.processBooking}`}
                className={`navigation text-md uppercase text-black hover:text-blue-700`}
                style={({ isActive }) =>
                  isActive
                    ? {
                        color: "#1d5193",
                      }
                    : {}
                }
              >
                <span>
                  {i18n.language === "en"
                    ? "Process Management"
                    : "Quản lý tiến trình"}
                </span>
              </NavLink>
              <NavLink
                to={`${path.HOMEPAGE}/${path.news}`}
                className={`navigation text-md uppercase text-black hover:text-blue-700`}
                style={({ isActive }) =>
                  isActive
                    ? {
                        color: "#1d5193",
                      }
                    : {}
                }
              >
                <span>{i18n.language === "en" ? "News" : "Tin tức"}</span>
              </NavLink>

              <div
                className="relative navigation text-md text-black hover:text-blue-700"
                // style={({ isActive }) =>
                //   isActive
                //     ? {
                //         color: "#1d5193",
                //       }
                //     : { color: "#000" }
                // }
              >
                {/* <span className="flex items-center justify-center gap-1">
                {i18n.language === "en" ? "STUDENT HANDBOOK" : "SỔ TAY SINH VIÊN"}
                <IoMdArrowDropdown className="hover:text-blue-700" />
              </span> */}
                {/* <a
                href="http://handbook.uet.vnu.edu.vn/"
                className="text-md text-headingColor hover:text-blue-700"
                style={{ fontSize: "16px" }}
                target={"_blank"}
                rel="noopener noreferrer"
                alt=""
              >
                {i18n.language === "en"
                  ? "STUDENT HANDBOOK"
                  : "SỔ TAY SINH VIÊN"}
              </a> */}
                <Link
                  className="navigation text-md uppercase hover:text-blue-700 text-black"
                  to="http://handbook.uet.vnu.edu.vn/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {i18n.language === "en"
                    ? "STUDENT HANDBOOK"
                    : "SỔ TAY SINH VIÊN"}
                </Link>
              </div>
              <NavLink
                to={`${path.HOMEPAGE}/${path.contact}`}
                className="navigation text-md uppercase hover:text-blue-700"
                style={({ isActive }) =>
                  isActive
                    ? {
                        color: "#1d5193",
                      }
                    : { color: "#000" }
                }
              >
                <span>{t("header.contact")}</span>
              </NavLink>
              <div className="survey_header navigation cursor-pointer text-md text-black hover:text-blue-700 hover:opacity-100 relative">
                <span className="flex items-center justify-center gap-1">
                  {i18n.language === "en" ? "SURVEY" : "KHẢO SÁT"}
                  <IoMdArrowDropdown className="hover:text-blue-700" />
                </span>
                <ul
                  className="survey_dropdown absolute profile-user-homepage avatar-modal"
                  style={{
                    padding: ".5rem 0",
                    margin: 0,
                    marginTop: "0px",
                    fontSize: "1rem",
                    color: "#212529",
                    textAlign: "left",
                    listStyle: "none",
                    backgroundColor: "#fff",
                    backgroundClip: "padding-box",
                    border: "1px solid rgba(0,0,0,.15)",
                    borderRadius: ".25rem",
                    minWidth: "182px",
                    top: "40px",
                  }}
                >
                  <li>
                    <div
                      className={`cursor-pointer hover:bg-gray-100 transition-all duration-300 p-[10px] pl-[20px]
                     text-headingColor border-none block w-full font-normal`}
                      style={{ fontSize: "16px" }}
                      onClick={() => handlePrePsyChologicalSurvey()}
                    >
                      {i18n.language === "en"
                        ? "Pre-psychological survey"
                        : "Tiền khảo sát tâm lý"}
                    </div>
                  </li>
                  <li>
                    <div
                      className={`cursor-pointer hover:bg-gray-100 transition-all duration-300 p-[10px] pl-[20px]
                     text-headingColor border-none block w-full font-normal`}
                      style={{ fontSize: "16px" }}
                      onClick={() =>
                        navigate(`${path.HOMEPAGE}/${path.survey}`)
                      }
                    >
                      {i18n.language === "en"
                        ? "Student Opinion"
                        : "Ý kiến sinh viên"}
                    </div>
                  </li>
                </ul>
              </div>
              {/* <NavLink
              to={`${path.HOMEPAGE}/${path.survey}`}
              className={`navigation text-md uppercase text-black hover:text-blue-700`}
              style={({ isActive }) =>
                isActive
                  ? {
                      color: "#1d5193",
                    }
                  : {}
              }
            >
              <span>{t("header.survey")}</span>
            </NavLink> */}
            </div>
          )}
        </div>

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
                {i18n.language === "en"
                  ? "Update Password"
                  : "Cập nhật mật khẩu"}
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

        {isOpenMentalSurvey && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, translateY: -50 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -50 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="fixed modal-update-password-overlay top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25"
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: "70%",
                  height: "55vh",
                }}
              >
                {/* <div
                style={{
                  background: `url(${surveyImage}) no-repeat`,
                  borderRadius: "15px",
                  // width: "80%",
                  // height: "80vh",
                  backgroundSize: "contain",
                }}
              ></div> */}
                <div
                  style={{
                    // objectFit: "contain",
                    borderRadius: "15px",
                    overflow: "hidden",
                    backgroundImage: `url(${surveyImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    // objectFit: "contain",
                    width: "100%",
                    paddingTop: "45%",
                    // scale: height = 1/2 width auto proportion
                    position: "relative",
                  }}
                >
                  <div className="absolute top-[60%] left-[53.8%] w-[40.2%] flex flex-col justify-center items-center gap-5">
                    <button
                      class={`flex gap-1 px-5 w-[60%] py-1.5 transition-all ease-in duration-150 items-center justify-center overflow-hidden text-md font-semibold border border-blue-500 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 
            `}
                      // onClick={() => handleRefreshNotification()}
                    >
                      <span class="">Khảo sát ngay</span>
                    </button>
                    <button
                      class={`flex gap-1 px-5 w-[60%] py-1.5 transition-all ease-in duration-150 items-center justify-center overflow-hidden text-md font-semibold border border-blue-500 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 
            `}
                      onClick={() => setIsOpenMentalSurvey(false)}
                    >
                      <span class="">Để sau</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </Fragment>
  );
};

export default HomeHeader;
