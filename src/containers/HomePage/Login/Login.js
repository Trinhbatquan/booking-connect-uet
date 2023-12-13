import React,{ useEffect,useState,useRef } from "react";
import { BsEyeSlash } from "react-icons/bs";
import { IoMdEye } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { path } from "../../../utils/constant";

import "./Login.scss";
import { loginHomePageApi } from "../../../services/userService";
import { loginUserFailed,loginUserSucceed } from "../../../redux/studentSlice";
import Loading from "./../../../utils/Loading";
import { select_faculty } from "../../../utils/constant";

import { FaPencilAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import HomeHeader from "../HomeHeader";
import { useTranslation } from "react-i18next";
import { toast,ToastContainer } from "react-toastify";

const Login = () => {
  //login
  const [focusEmail_login,setFocusEmail_login] = useState(false);
  const [focusPassword_login,setFocusPassword_login] = useState(false);
  const [eye_login,setEye_login] = useState(false);
  const [email_login,setEmail_login] = useState("");
  const [password_login,setPassword_login] = useState("");
  const [messageLogin,setMessageLogin] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //register
  const [focusFullName,setFocusFullName] = useState(false);
  const [focusEmail_register,setFocusEmail_register] = useState(false);
  const [focusPassword_register,setFocusPassword_register] = useState(false);
  const [focusConformPassword_register,setFocusConformPassword_register] =
    useState(false);
  const [focusFaculty,setFocusFaculty] = useState(false);
  const [focusClassroom,setFocusClassroom] = useState(false);
  const [focusPhone,setFocusPhone] = useState(false);
  const [eye_register,setEye_register] = useState(false);
  const [fullName,setFullName] = useState("");
  const [email_register,setEmail_register] = useState("");
  const [password_register,setPassword_register] = useState("");
  const [confirmPs,setConfirmPs] = useState("");
  const [faculty,setFaculty] = useState("");
  const [messageRegister,setMessageRegister] = useState("");
  const [classroom,setClassroom] = useState("");
  const [phone,setPhone] = useState("");

  const [loading,setLoading] = useState(false);

  const [active,setActive] = useState(false);
  const containerRef = useRef();
  const { t,i18n } = useTranslation();
  //login
  const handleFocusPassword_login = () => {
    setFocusPassword_login(true);
    setMessageLogin("");
  };

  const handleFocusEmail_login = () => {
    setFocusEmail_login(true);
    setMessageLogin("");
  };

  //check null state
  const handleCheckNullState_Login = () => {
    let result = true;
    const stateArr = [email_login,password_login];
    const notification_en = ["Email","Password"];
    const notification_vn = ["Trường Email","Trường mật khẩu"];
    for (let i = 0; i < stateArr.length; i++) {
      if (!stateArr[i]) {
        setMessageLogin(
          `${i18n.language === "en"
            ? `${notification_en[i]} ${t("system.table.mess-2")}`
            : `${notification_vn[i]} ${t("system.table.mess-2")}`
          }`
        );
        result = false;
        break;
      } else {
        setMessageLogin("");
      }
    }
    return result;
  };
  const handleCheckValidate_Login = () => {
    let result = true;
    const checkNullState = handleCheckNullState_Login();
    if (checkNullState) {
      const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const regexPassword =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      if (!regexEmail.test(email_login)) {
        setMessageLogin(t("system.notification.email"));
        return false;
      }
      if (!regexPassword.test(password_login)) {
        setMessageLogin(t("system.notification.password"));
        return false;
      }

      return result;
    }
  };

  const handleLogin = () => {
    if (handleCheckValidate_Login()) {
      setLoading(true);
      setMessageLogin("");
      loginHomePageApi
        .loginUser({},{ email: email_login,password: password_login })
        .then((data) => {
          if (data?.codeNumber === 0) {
            //success
            setLoading(false);
            dispatch(loginUserSucceed(data?.user));
            navigate(`${path.HOMEPAGE}`);
          } else {
            //false
            setLoading(false);
            setMessageLogin({
              codeNumber: data?.codeNumber,
              message:
                i18n.language === "en" ? data?.message_en : data?.message_vn,
            });
            dispatch(loginUserFailed());
          }
        });
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(
      localStorage.getItem("auth-bookingCare-UET_student")
    );
    if (userInfo && userInfo?.isLogin === true && userInfo?.role === "R3") {
      navigate(`${path.HOMEPAGE}`);
    }
  },[]);

  const handleSignIn = () => {
    setActive(false);
  };

  const handleSignUp = () => {
    setActive(true);
  };

  //register
  const handleFocusFullName_register = () => {
    setFocusFullName(true);
    setMessageRegister("");
  };
  const handleFocusPassword_register = () => {
    setFocusPassword_register(true);
    setMessageRegister("");
  };
  const handleFocusEmail_register = () => {
    setFocusEmail_register(true);
    setMessageRegister("");
  };
  const handleFocusConfirmPassword_register = () => {
    setFocusConformPassword_register(true);
    setMessageRegister("");
  };
  const handleFocusFaculty_register = () => {
    setFocusFaculty(true);
    setMessageRegister("");
  };
  const handleFocusClassroom_register = () => {
    setFocusClassroom(true);
    setMessageRegister("");
  };
  const handleFocusPhone_register = () => {
    setFocusPhone(true);
    setMessageRegister("");
  };

  //check null state
  const handleCheckNullState_Register = () => {
    let result = true;
    const stateArr = [
      fullName,
      email_register,
      password_register,
      faculty,
      classroom,
      phone,
    ];
    const notification_en = [
      "FullName",
      "Email",
      "Password",
      "Faculty",
      "Classroom",
      "PhoneNumber",
    ];
    const notification_vn = [
      "Trường Tên đầy đủ",
      "Trường Email",
      "Trường mật khẩu",
      "Trường khoa",
      "Trường lớp",
      "Trường số điện thoại",
    ];
    for (let i = 0; i < stateArr.length; i++) {
      if (!stateArr[i]) {
        setMessageRegister(
          `${i18n.language === "en"
            ? `${notification_en[i]} ${t("system.table.mess-2")}`
            : `${notification_vn[i]} ${t("system.table.mess-2")}`
          }`
        );
        result = false;
        break;
      } else {
        setMessageRegister("");
      }
    }
    return result;
  };
  const handleCheckValidate_Register = () => {
    let result = true;
    const checkNullState = handleCheckNullState_Register();
    if (checkNullState) {
      const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const regexPassword =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      const rejexPhoneNumber = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
      if (!regexEmail.test(email_register)) {
        setMessageRegister(t("system.notification.email"));
        return false;
      }
      if (!regexPassword.test(password_register)) {
        setMessageRegister(t("system.notification.password"));
        return false;
      }
      if (!rejexPhoneNumber.test(phone)) {
        setMessageRegister(t("system.notification.phone"));
        return false;
      }
      if (password_register !== confirmPs) {
        setMessageRegister(t("system.notification.matchPassword"));
        return false;
      }
      return result;
    }
  };

  const handleRegister = () => {
    if (handleCheckValidate_Register()) {
      setLoading(true);
      setMessageRegister({});
      loginHomePageApi
        .registerUser(
          {},
          {
            email: email_register,
            password: password_register,
            fullName,
            faculty,
            classroom,
            phoneNumber: phone,
          }
        )
        .then((data) => {
          if (data?.codeNumber === 0) {
            //success
            setLoading(false);
            dispatch(loginUserSucceed(data?.user));
            navigate(`${path.HOMEPAGE}`);
          } else {
            //false
            setLoading(false);
            setMessageRegister({
              codeNumber: data?.codeNumber,
              message:
                i18n.language === "en" ? data?.message_en : data?.message_vn,
            });
            dispatch(loginUserFailed());
          }
        });
    } else {
      return;
    }
  };

  return (
    <div className="login-register-homepage-container">
      {/* {console.log("render")} */}
      {loading && (
        <div className="fixed loading-overlay top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25">
          <div className="absolute top-[50%] left-[50%]">
            <Loading />
          </div>
        </div>
      )}
      <ToastContainer />
      <HomeHeader action="preventDefault_checkClickDropDown" />
      <div className={`${active ? "active" : ""} container`} ref={containerRef}>
        <div className="box">
          <div className="form login">
            <div className="font-semibold text-center login-text py-1">
              {t("login_register.signin")}
            </div>
            <div
              className={`${messageLogin?.codeNumber === 2
                  ? "messageLogin-email"
                  : "messageLogin-text"
                } text-center mt-1`}
              style={
                messageLogin || messageLogin?.codeNumber
                  ? { opacity: "1" }
                  : { opacity: "0" }
              }
            >
              {`${messageLogin?.message
                  ? messageLogin?.message
                  : messageLogin
                    ? messageLogin
                    : "none"
                }`}
            </div>
            <div className="flex items-center justify-center"></div>
            <div className="login-form w-2/3 flex flex-col items-start justify-center pb-4 mt-2">
              <div className="flex items-center justify-start gap-0.5 pb-1 pl-1">
                <FaPencilAlt className="text-sm opacity-70" />
                <label className="opacity-70" htmlFor="email">
                  Email
                </label>
              </div>
              <input
                autoComplete="false"
                onFocus={() => handleFocusEmail_login()}
                onBlur={() => setFocusEmail_login(false)}
                className={`w-full py-2 px-3 rounded-md placeholder:text-slate-400 outline-none
                                  ${focusEmail_login
                    ? "bg-white duration-200 transition-all"
                    : "bg-slate-200 duration-200 transition-all"
                  }
                                  `}
                value={email_login}
                id="email"
                type="email"
                name="email"
                placeholder="VD: 19020641@vnu.edu.vn"
                onChange={(e) => setEmail_login(e.target.value)}
              />
            </div>
            <div className="login-form w-2/3 flex flex-col items-start justify-center pb-4 relative">
              <label className="opacity-70 pb-1 pl-1" htmlFor="password">
                {t("login_register.password")}
              </label>
              <input
                autoComplete="false"
                onFocus={() => handleFocusPassword_login()}
                onBlur={() => setFocusPassword_login(false)}
                className={`w-full py-2 px-3 rounded-md placeholder:text-slate-400 outline-none
                                  ${focusPassword_login
                    ? "bg-white duration-300 transition-all"
                    : "bg-slate-200 duration-300 transition-all"
                  }
                                  `}
                value={password_login}
                id="password"
                type={`${eye_login ? "text" : "password"}`}
                name="password"
                placeholder={
                  i18n.language === "en"
                    ? "Enter your password"
                    : "Nhập mật khẩu"
                }
                onChange={(e) => setPassword_login(e.target.value)}
              />
              {eye_login ? (
                <IoMdEye
                  className="absolute right-6 bottom-7 cursor-pointer"
                  onClick={() => setEye_login(false)}
                />
              ) : (
                <BsEyeSlash
                  className="absolute right-6 bottom-7 cursor-pointer"
                  onClick={() => setEye_login(true)}
                />
              )}
            </div>
            <div className="w-1/4 mt-4 " onClick={() => handleLogin()}>
              <button className="w-full btn-form rounded-lg">
                {t("login_register.signin")}
              </button>
            </div>
            <NavLink
              to={`${path.HOMEPAGE}/forgot-pass`}
              className="mt-2 w-full"
            >
              <span className="login-forgot pl-1 cursor-pointer">
                {t("login_register.forgotPassword")}
              </span>
            </NavLink>
          </div>

          <div className="form register">
            <div className="font-semibold text-center register-text py-1">
              {t("login_register.signup")}
            </div>
            <div
              className={`${messageRegister?.codeNumber === 2
                  ? "messageRegister-email"
                  : "messageRegister-text"
                } text-center mt-1`}
              style={
                messageRegister || messageRegister?.codeNumber
                  ? { opacity: "1" }
                  : { opacity: "0" }
              }
            >
              {`${messageRegister?.message
                  ? messageRegister?.message
                  : messageRegister
                    ? messageRegister
                    : "none"
                }`}
            </div>
            <div className="flex items-center justify-center"></div>
            <div className="register-form w-2/3 flex flex-col items-start justify-center pb-4 mt-2">
              <div className="flex items-center justify-start pl-1 pb-1 gap-0.5">
                <FaPencilAlt className="text-sm opacity-70" />
                <label className="opacity-70" htmlFor="name_register">
                  {t("login_register.name")}
                </label>
              </div>
              <input
                autoComplete="false"
                onFocus={() => handleFocusFullName_register()}
                onBlur={() => setFocusFullName(false)}
                className={`w-full py-2 px-3 rounded-md placeholder:text-slate-400 outline-none
                                  ${focusFullName
                    ? "bg-white duration-200 transition-all"
                    : "bg-slate-200 duration-200 transition-all"
                  }
                                  `}
                value={fullName}
                id="name_register"
                type="text"
                name="name_register"
                placeholder="VD: Vũ Văn A"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="register-form w-2/3 flex flex-col items-start justify-center pb-4 mt-2">
              <label className="opacity-70 pb-1 pl-1" htmlFor="email_re">
                Email
              </label>
              <input
                autoComplete="false"
                onFocus={() => handleFocusEmail_register()}
                onBlur={() => setFocusEmail_register(false)}
                className={`w-full py-2 px-3 rounded-md placeholder:text-slate-400 outline-none
                                  ${focusEmail_register
                    ? "bg-white duration-200 transition-all"
                    : "bg-slate-200 duration-200 transition-all"
                  }
                                  `}
                value={email_register}
                id="email_re"
                type="email"
                name="email_re"
                placeholder="VD: 19020641@vnu.edu.vn"
                onChange={(e) => setEmail_register(e.target.value)}
              />
            </div>
            <div className="register-form w-2/3 flex flex-col items-start justify-center pb-4 mt-2 relative">
              <label className="opacity-70 pb-1 pl-1" htmlFor="pass_re">
                {t("login_register.password")}
              </label>
              <input
                autoComplete="false"
                onFocus={() => handleFocusPassword_register()}
                onBlur={() => setFocusPassword_register(false)}
                className={`w-full py-2 px-3 rounded-md placeholder:text-slate-400 outline-none
                                  ${focusPassword_register
                    ? "bg-white duration-200 transition-all"
                    : "bg-slate-200 duration-200 transition-all"
                  }
                                  `}
                value={password_register}
                id="pass_re"
                type={`${eye_register ? "text" : "password"}`}
                name="pass_re"
                placeholder={
                  i18n.language === "en"
                    ? "Enter your password"
                    : "Nhập mật khẩu"
                }
                onChange={(e) => setPassword_register(e.target.value)}
              />
              {eye_register ? (
                <IoMdEye
                  className="absolute right-6 bottom-7 cursor-pointer"
                  onClick={() => setEye_register(false)}
                />
              ) : (
                <BsEyeSlash
                  className="absolute right-6 bottom-7 cursor-pointer"
                  onClick={() => setEye_register(true)}
                />
              )}
            </div>
            <div className="register-form w-2/3 flex flex-col items-start justify-center pb-4 relative">
              <label className="opacity-70 pb-1 pl-1" htmlFor="password">
                {t("login_register.confirm_password")}
              </label>
              <input
                autoComplete="false"
                onFocus={() => handleFocusConfirmPassword_register()}
                onBlur={() => setFocusConformPassword_register(false)}
                className={`w-full py-2 px-3 rounded-md placeholder:text-slate-400 outline-none
                                  ${focusConformPassword_register
                    ? "bg-white duration-300 transition-all"
                    : "bg-slate-200 duration-300 transition-all"
                  }
                                  `}
                value={confirmPs}
                id="password"
                type={`${eye_register ? "text" : "password"}`}
                name="password"
                placeholder={
                  i18n.language === "en"
                    ? "Enter your password"
                    : "Nhập mật khẩu"
                }
                onChange={(e) => setConfirmPs(e.target.value)}
              />
            </div>
            <div className="register-form w-2/3 flex flex-col items-start justify-center pb-4 mt-2">
              <label className="opacity-70 pb-1 pl-1" htmlFor="faculties">
                {t("login_register.faculty")}
              </label>
              <select
                className={`w-full py-2 px-3 rounded-md text-sm placeholder:text-slate-400 outline-none
                                  ${focusFaculty
                    ? "bg-white duration-200 transition-all"
                    : "bg-slate-200 duration-200 transition-all"
                  }
                                  `}
                name="faculties"
                id="faculties"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                onFocus={() => handleFocusFaculty_register()}
                onBlur={() => setFocusFaculty(false)}
              >
                <option name="faculties" value="" className="text-sm">
                  {i18n.language === "en" ? "Select---" : "Chọn---"}
                </option>
                {select_faculty?.length > 0 &&
                  select_faculty?.map((e,i) => {
                    return (
                      <option
                        key={i}
                        name="faculties"
                        value={e?.value}
                        className="text-sm"
                      >
                        {e?.label}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="register-form w-2/3 flex flex-col items-start justify-center pb-4 mt-2">
              <label className="opacity-70 pb-1 pl-1" htmlFor="classroom">
                {t("login_register.classroom")}
              </label>
              <input
                autoComplete="false"
                onFocus={() => handleFocusClassroom_register()}
                onBlur={() => setFocusClassroom(false)}
                className={`w-full py-2 px-3 rounded-md placeholder:text-slate-400 outline-none
                                  ${focusClassroom
                    ? "bg-white duration-200 transition-all"
                    : "bg-slate-200 duration-200 transition-all"
                  }
                                  `}
                value={classroom}
                id="classroom"
                type="text"
                name="classroom"
                placeholder="VD: K64K1"
                onChange={(e) => setClassroom(e.target.value)}
              />
            </div>
            <div className="register-form w-2/3 flex flex-col items-start justify-center pb-4 mt-2">
              <label className="opacity-70 pb-1 pl-1" htmlFor="phone">
                {t("login_register.phoneNumber")}
              </label>
              <input
                autoComplete="false"
                onFocus={() => handleFocusPhone_register()}
                onBlur={() => setFocusPhone(false)}
                className={`w-full py-2 px-3 rounded-md placeholder:text-slate-400 outline-none
                                  ${focusPhone
                    ? "bg-white duration-200 transition-all"
                    : "bg-slate-200 duration-200 transition-all"
                  }
                                  `}
                value={phone}
                id="phone"
                type="text"
                name="phone"
                placeholder={
                  i18n.language === "en"
                    ? "Enter your phone"
                    : "Nhập số điện thoại của bạn"
                }
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="w-1/3 mt-4" onClick={() => handleRegister()}>
              <button className="w-full btn-form rounded-lg py-1">
                {t("login_register.signup")}
              </button>
            </div>
          </div>
        </div>

        <div class="overlay">
          <div class="page page_signUp">
            <h3>
              {i18n.language === "en" ? "Welcome Back!" : "Chào mừng quay lại!"}
            </h3>
            <p>
              {i18n.language === "en"
                ? "To Dialogue scheduling system And Support answer questions for learners of UET."
                : "Hệ thống lập kế hoạch đối thoại và hỗ trợ giải đáp thắc mắc cho người học UET."}
            </p>

            <button class="btn btnSign-in" onClick={() => handleSignIn()}>
              {t("login_register.signup")}
              { } <i class="bi bi-arrow-right"></i>
            </button>
          </div>

          <div class="page page_signIn">
            <h3>{i18n.language === "en" ? "Hello Friend!" : "Chào bạn!"}</h3>
            <p>
              {i18n.language === "en"
                ? "Let's register to use website. Have a good day."
                : "Đăng ký để sử dụng hệ thống. Chúc bạn một ngày tốt lành."}
            </p>

            <button class="btn btnSign-up" onClick={() => handleSignUp()}>
              <i class="bi bi-arrow-left"></i>
              {t("login_register.signin")}
              { }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
