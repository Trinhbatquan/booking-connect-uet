import React, { Fragment, useState } from "react";

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
import { logOutHomePageApi } from "../../services/userService";
import { logOutUser } from "../../redux/studentSlice";
import avatar from "../../assets/image/banner.jpg";

export const T_i18n = () => {
  const { t } = useTranslation();
  return t;
};

const HomeHeader = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openModelUser, setOpenModelUser] = useState(false);

  const currentUser = useSelector((state) => state.studentReducer);

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

  return (
    <Fragment>
      <div className="homepage-header-container flex items-center">
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
            <div className="flex items-start justify-center gap-0 cursor-pointer">
              <span className="support text-md flex items-center justify-center gap-0 text-black hover:text-blue-700">
                <MdContactSupport />
                {t("header.support")}
              </span>
            </div>
            {i18n.language === "vi" ? (
              <div
                className={`text-md ml-3 cursor-pointer flex items-center justify-center gap-1 text-black hover:text-blue-700 hover:opacity-100`}
                onClick={() => handleChangeLanguages("en")}
              >
                Tiếng Việt <IoIosArrowDown className="opacity-20" />
              </div>
            ) : (
              <div
                className={`text-md ml-3 cursor-pointer flex items-center justify-center gap-1 text-black hover:text-blue-700 hover:opacity-100`}
                onClick={() => handleChangeLanguages("vi")}
              >
                Tiếng Anh <IoIosArrowDown className="opacity-20" />
              </div>
            )}

            <div
              className={`avatar relative text-black text-xl ml-3 cursor-pointer hover:text-blue-700 flex items-center justify-center gap-0`}
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
                    className="avatar-modal absolute right-0 top-9 z-50 rounded-lg  w-80 bg-white backdrop-blur-sm"
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
                    <div className="text-md text-headingColor">
                      <div className="h-full w-full flex items-center justify-center cursor-text">
                        <div
                          className="relative flex items-center justify-center"
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
                              N
                            </span>
                          </div>
                        </div>
                        <div className="h-full flex flex-col items-start gap-2">
                          <span
                            className="font-semibold"
                            style={{ fontSize: "16px" }}
                          >
                            Bui Van Trinh
                          </span>
                          <span>
                            {" "}
                            {currentUser?.email
                              ? currentUser.email
                              : "expamle@vnu.edu.vn"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ul className="py-2 text-headingColor border-t border-b border-slate-200">
                      <li>
                        <div className="flex items-center gap-2 px-4 py-2 hover:text-blue-700">
                          <AiFillEdit /> <span> Edit Profile</span>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center gap-2 px-4 py-2 hover:text-blue-700 ">
                          <AiFillUnlock /> <span>Change Password</span>
                        </div>
                      </li>
                    </ul>
                    <div className="py-2">
                      <div
                        className="flex items-center gap-2 px-4 py-2  hover:text-blue-700 text-headingColor"
                        onClick={() => handleLogOutHomePage()}
                      >
                        <BiLogOutCircle /> <span>Sign out</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
              className="text-md uppercase text-black hover:text-blue-700 font-semibold"
              // style={({ isActive }) =>
              //   isActive
              //     ? {
              //         color: "#1d5193",
              //       }
              //     : { color: "#000" }
              // }
            >
              <span>{t("header.inform")}</span>
            </NavLink>
            <NavLink
              className="text-md uppercase text-black hover:text-blue-700 font-semibold"
              // style={({ isActive }) =>
              //   isActive
              //     ? {
              //         color: "#1d5193",
              //       }
              //     : { color: "#000" }
              // }
            >
              <span>{t("header.survey")}</span>
            </NavLink>
            <NavLink
              className="text-md uppercase text-black hover:text-blue-700 font-semibold"
              // style={({ isActive }) =>
              //   isActive
              //     ? {
              //         color: "#1d5193",
              //       }
              //     : { color: "#000" }
              // }
            >
              <span>{t("header.handbook")}</span>
            </NavLink>
            <NavLink
              className="text-md uppercase text-black hover:text-blue-700 font-semibold"
              // style={({ isActive }) =>
              //   isActive
              //     ? {
              //         color: "#1d5193",
              //       }
              //     : { color: "#000" }
              // }
            >
              <span>{t("header.contact")}</span>
            </NavLink>
            <NavLink
              className="text-md uppercase text-black hover:text-blue-700 hover:opacity-100 font-semibold"
              // style={({ isActive }) =>
              //   isActive
              //     ? {
              //         color: "#1d5193",
              //       }
              //     : { color: "#000" }
              // }
            >
              <span className="flex items-center justify-center gap-1">
                {t("header.Action")} <IoIosArrowDown className="opacity-20" />
              </span>
            </NavLink>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default HomeHeader;
