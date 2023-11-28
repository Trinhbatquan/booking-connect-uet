import React, { useEffect, useState } from "react";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { BsEyeSlash } from "react-icons/bs";
import { IoMdEye } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";

import { loginApi } from "../../../services/userService";
import { loginUserFailed, loginUserSucceed } from "../../../redux/authSlice";
import { path } from "../../../utils/constant";
import banner from "../../../assets/image/June.png";
import "./Login.scss";
import { useTranslation } from "react-i18next";
import Loading from "../../../utils/Loading";

const Login = () => {
  const { i18n, t } = useTranslation();
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [eye, setEye] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messageLogin, setMessageLogin] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFocusPassword = () => {
    setFocusPassword(true);
    setMessageLogin("");
  };

  const handleFocusEmail = () => {
    setFocusEmail(true);
    setMessageLogin("");
  };

  const handleCheckNullState = () => {
    let result = true;
    const stateArr = [email, password];
    const notification_en = ["Email", "Password"];
    const notification_vi = ["Trường Email", "Trường mật khẩu"];
    for (let i = 0; i < stateArr.length; i++) {
      if (!stateArr[i]) {
        if (i18n.language === "vi") {
          setMessageLogin(
            `${notification_vi[i]} ${t("system.notification.required")}`
          );
        } else {
          setMessageLogin(
            `${notification_en[i]} ${t("system.notification.required")}`
          );
        }
        result = false;
        break;
      } else {
        setMessageLogin("");
      }
    }
    return result;
  };

  const handleCheckValidate = () => {
    let result = true;
    const checkNullState = handleCheckNullState();
    if (checkNullState) {
      const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!regexEmail.test(email)) {
        setMessageLogin(`${t("system.notification.email")}`);
        return false;
      }
      const regexPassword =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      if (!regexPassword.test(password)) {
        setMessageLogin(`${t("system.notification.password")}`);
        return false;
      }

      return result;
    }
  };

  const handleLogin = () => {
    if (handleCheckValidate()) {
      setMessageLogin("");
      setLoading(true);
      loginApi.loginUser({}, { email, password }).then((data) => {
        if (data?.codeNumber === 0) {
          //success
          dispatch(loginUserSucceed(data?.user));
          setLoading(false);
          if (data?.user?.roleId === "R1") {
            navigate(`${path.SYSTEM}/${path.dashboardSystem}`);
          } else {
            navigate(`${path.MANAGER}/${path.dashboard}`);
          }
        } else {
          //false
          dispatch(loginUserFailed());
          setLoading(false);
          toast.error(
            i18n.language === "en" ? data?.message_en : data?.message_vn,
            {
              autoClose: 3000,
              position: "bottom-right",
              theme: "colored",
            }
          );
        }
      });
    } else {
      return;
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("auth-bookingCare-UET"));
    if (userInfo && userInfo?.isLogin === true && userInfo?.role !== "R3") {
      if (userInfo?.role === "R1") {
        navigate(`${path.SYSTEM}/${path.dashboardSystem}`);
      } else {
        navigate(`${path.MANAGER}/${path.dashboard}`);
      }
    }
  }, []);

  return (
    <div className="login-container">
      <ToastContainer />

      {loading && (
        <div className="fixed loading-overlay top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25">
          <div className="absolute">
            <Loading />
          </div>
        </div>
      )}
      <div className="login rounded-sm overflow-hidden">
        <div
          className="login-left"
          style={{ backgroundImage: `url(${banner})` }}
        ></div>
        <div className="login-right">
          <div className="font-semibold pt-4 text-center login-text mt-1">
            {i18n.language === "en" ? "Login" : "Đăng nhập"}
          </div>
          <div className="text-center login-des mt-1">
            {i18n.language === "en"
              ? "Management System of BookingCare-UET"
              : "Quản lý hệ thống BookingCare-UET"}
          </div>
          <div
            className="messageLogin-text text-center mt-1"
            style={messageLogin ? { opacity: "1" } : { opacity: "0" }}
          >
            {`${messageLogin ? messageLogin : "none"}`}
          </div>
          <div className="login-form flex flex-col items-start justify-center pb-5 mt-2">
            <label className="opacity-70 pb-1 pl-1" htmlFor="email">
              Email
            </label>
            <input
              autoComplete="false"
              onFocus={() => handleFocusEmail()}
              onBlur={() => setFocusEmail(false)}
              className={`login-form-input-one w-full py-2 px-3 rounded-md placeholder:text-slate-400 outline-none
                               ${
                                 focusEmail
                                   ? "bg-white duration-200 transition-all"
                                   : "bg-slate-200 duration-200 transition-all"
                               } 
                              `}
              value={email}
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="login-form flex flex-col items-start justify-center pb-5 relative">
            <label className="opacity-70 pb-1 pl-1" htmlFor="password">
              {i18n.language === "en" ? "Password" : "Mật khẩu"}
            </label>
            <input
              autoComplete="false"
              onFocus={() => handleFocusPassword()}
              onBlur={() => setFocusPassword(false)}
              className={`login-form-input-two w-full py-2 px-3 rounded-md placeholder:text-slate-400 outline-none 
                               ${
                                 focusPassword
                                   ? "bg-white duration-300 transition-all"
                                   : "bg-slate-200 duration-300 transition-all"
                               } 
                              `}
              value={password}
              id="password"
              type={`${eye ? "text" : "password"}`}
              name="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {eye ? (
              <IoMdEye
                className="absolute right-6 bottom-8 cursor-pointer"
                onClick={() => setEye(false)}
              />
            ) : (
              <BsEyeSlash
                className="absolute right-6 bottom-8 cursor-pointer"
                onClick={() => setEye(true)}
              />
            )}
          </div>

          <div className="w-full mt-4" onClick={() => handleLogin()}>
            <button className="w-full login-btn rounded-lg py-2">
              {i18n.language === "en" ? "Login" : "Đăng nhập"}
            </button>
          </div>
          <div className="mt-1 w-full">
            <span
              className="login-forgot pl-1 cursor-pointer"
              onClick={() => navigate(`${path.SYSTEM}/forgot-pass`)}
            >
              {i18n.language === "en"
                ? "Forgot your password?"
                : "Quên mật khẩu?"}
            </span>
          </div>
          <div className="w-full mt-8 text-center">
            <span className="login-other">
              {i18n.language === "en" ? "Or login with" : "Hoặc đăng nhập với"}
            </span>
            <div className="w-full flex items-center justify-center py-2">
              {/* <FaFacebookF className="rounded-full bg-blue-700 text-white w-9 h-9 px-2 py-2 mr-2 cursor-pointer" /> */}
              <FaGoogle className="rounded-full bg-red-700 text-white w-9 h-9 px-2 py-2 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
