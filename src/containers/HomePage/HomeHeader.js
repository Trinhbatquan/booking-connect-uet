import React, { Fragment, useEffect, useRef, useState } from "react";

import { Link, NavLink } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { MdContactSupport } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown } from "react-icons/io";
import { AiFillHome } from "react-icons/ai";

import "./HomeHeader.scss";
import { path } from "../../utils/constant";
import { BsFillPersonFill } from "react-icons/bs";
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
import {
  getPreviousFeedback,
  saveFeedback,
} from "../../services/student_feedback";
import flag_en from "../../assets/image/en.png";
import flag_vi from "../../assets/image/vi.png";

const HomeHeader = ({ action }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //update password
  const [isUpdatePassword, setIsUpdatePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifyCheckState, setNotifyCheckState] = useState("");
  const [eye, setEye] = useState(false);

  const currentUser = useSelector((state) => state.studentReducer);

  const languageDropDownRef = useRef();
  const languageDivRef = useRef();
  const profileDivRef = useRef();
  const profileDropDownRef = useRef();

  useEffect(() => {
    console.log("check State");
    const divLanguage = document.querySelector(".header_homepage_language");
    const divProfile = document.querySelector(".header_homepage_profile");

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

      if (!action) {
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

    divLanguage.addEventListener("click", handleClickDivLanguage);
    document.addEventListener("click", handleClickOutDiv);
    if (!action) {
      divProfile.addEventListener("click", handleClickDivProfile);
    }

    return () => {
      console.log("running");
      document.removeEventListener("click", handleClickOutDiv);
      divLanguage.removeEventListener("click", handleClickDivLanguage);
      if (!action) {
        divProfile.removeEventListener("click", handleClickDivProfile);
      }
    };
  }, []);

  const handleChangeLanguages = (language) => {
    i18n.changeLanguage(language);
  };

  const handleLogOutHomePage = () => {
    logOutHomePageApi.logoutUser({}).then((data) => {
      if (data?.codeNumber === 0) {
        dispatch(logOutUser());
        console.log("logout");
        navigate(`${path.HOMEPAGE}/${path.login_homepage}?redirect=/homepage`);
        console.log("logout2");
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
            <div className="relative">
              {i18n.language === "vi" ? (
                <div
                  className={`header_homepage_language text-sm ml-3 cursor-pointer flex items-center justify-center gap-3 text-black hover:text-blue-700 hover:opacity-100`}
                  ref={languageDivRef}
                >
                  <img
                    src={flag_vi}
                    alt=""
                    className="object-cover w-[20px] h-[15px]"
                    style={{ borderRadius: "8px" }}
                  />
                  <span className="flex items-center justify-center gap-1">
                    Tiếng Việt{" "}
                    <IoMdArrowDropdown className="hover:text-blue-700" />
                  </span>
                </div>
              ) : (
                <div
                  className={`header_homepage_language text-sm ml-3 cursor-pointer flex items-center justify-center gap-3 text-black hover:text-blue-700 hover:opacity-100`}
                  ref={languageDivRef}
                >
                  <img
                    src={flag_en}
                    alt=""
                    className="object-cover w-[20px] h-[15px]"
                    style={{ borderRadius: "8px" }}
                  />
                  <span className="flex items-center justify-center gap-1">
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
            </NavLink>

            <div className="action_header navigation cursor-pointer text-md text-black hover:text-blue-700 hover:opacity-100 relative">
              <span className="flex items-center justify-center gap-1">
                {t("header.Action")}{" "}
                <IoMdArrowDropdown className="hover:text-blue-700" />
              </span>
              <ul
                className="action_dropdown absolute profile-user-homepage avatar-modal"
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
                  minWidth: "160px",
                  top: "40px",
                }}
              >
                <li>
                  <div
                    className={`cursor-pointer hover:bg-gray-100 transition-all duration-300 p-[10px] pl-[20px]
                     text-headingColor border-none block w-full font-normal`}
                    style={{ fontSize: "16px" }}
                    onClick={() => navigate(`${path.HOMEPAGE}/${path.news}`)}
                  >
                    {i18n.language === "en" ? "News" : "Tin tức"}
                  </div>
                </li>
                <li>
                  <div
                    className={`cursor-pointer hover:bg-gray-100 transition-all duration-300 p-[10px] pl-[20px]
                     text-headingColor border-none block w-full font-normal`}
                    style={{ fontSize: "16px" }}
                    onClick={() => navigate(`${path.HOMEPAGE}/${path.notify}`)}
                  >
                    {i18n.language === "en" ? "Notification" : "Thông báo"}
                  </div>
                </li>
              </ul>
            </div>

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
            <NavLink
              // to={`${path.HOMEPAGE}/${path.contact}`}
              className="navigation text-md uppercase text-black hover:text-blue-700"
              // style={({ isActive }) =>
              //   isActive
              //     ? {
              //         color: "#1d5193",
              //       }
              //     : { color: "#000" }
              // }
            >
              <span>{t("header.support")}</span>
            </NavLink>
          </div>
        </div>

        {/* update Password Student */}
        {isUpdatePassword && (
          <div className="fixed loading-overlay top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25"></div>
        )}

        <AnimatePresence>
          {isUpdatePassword && (
            <motion.div
              initial={{ opacity: 0, translateY: -50 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -50 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="modal-setting fixed top-1 w-[60%] flex flex-col h-auto bg-white rounded-lg shadow backdrop-blur-md mx-auto mt-16 py-3 px-5 overflow-hidden"
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
      </div>
    </Fragment>
  );
};

export default HomeHeader;
