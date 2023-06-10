import React, { Fragment, useState } from "react";

import { NavLink } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { MdContactSupport } from "react-icons/md";
import { useTranslation } from "react-i18next";

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
  console.log(currentUser);

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
      <div className="homepage-header-container w-full flex items-center">
        <div className="homepage-herder-left">
          <FaBars className="text-blurColor cursor-pointer text-3xl hover:text-white" />
          <NavLink to={path.HOMEPAGE}>
            <div className="logo"></div>
          </NavLink>
          <div>
            <div className="text-white font-semibold text-md">
              {t("header.UET")}
            </div>
            <div className="text-white text-sm">{t("header.VNU")}</div>
          </div>
        </div>
        <div className="homepage-herder-right">
          <div className="flex items-center justify-center gap-0 cursor-pointer">
            <span className="text-md text-blurColor hover:text-white flex items-center justify-center gap-0">
              <MdContactSupport />
              {t("header.support")}
            </span>
          </div>
          <div
            className={`text-md ml-3 cursor-pointer hover:text-white ${
              i18n.language === "vi" ? "text-white" : "text-blurColor"
            }`}
            onClick={() => handleChangeLanguages("vi")}
          >
            VI
          </div>
          <div
            className={`text-blurColor text-md ml-3 cursor-pointer hover:text-white ${
              i18n.language === "vi" ? "text-blurColor" : "text-white"
            }`}
            onClick={() => handleChangeLanguages("en")}
          >
            EN
          </div>
          <div
            className={`avatar relative text-blurColor text-2xl ml-3 cursor-pointer hover:text-white flex items-center justify-center gap-0`}
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
                  className="avatar-modal absolute top-16 -right-12 z-5 rounded-lg shadow w-60 bg-blue-800 divide-blue-600"
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
      </div>
    </Fragment>
  );
};

export default HomeHeader;
