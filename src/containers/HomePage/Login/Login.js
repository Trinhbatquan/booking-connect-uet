import React, { useEffect, useState, useRef } from "react";
import { BsEyeSlash } from "react-icons/bs";
import { IoMdEye } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { path } from "../../../utils/constant";

import "./Login.scss";
import { loginHomePageApi } from "../../../services/userService";
import { loginUserFailed, loginUserSucceed } from "../../../redux/studentSlice";
import Loading from "./../../../utils/Loading";
import { select_faculty } from "../../../utils/constant";

import { FaPencilAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import HomeHeader from "../HomeHeader";

const Login = () => {
  //login
  const [focusEmail_login, setFocusEmail_login] = useState(false);
  const [focusPassword_login, setFocusPassword_login] = useState(false);
  const [eye_login, setEye_login] = useState(false);
  const [email_login, setEmail_login] = useState("");
  const [password_login, setPassword_login] = useState("");
  const [messageLogin, setMessageLogin] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //register
  const [focusFullName, setFocusFullName] = useState(false);
  const [focusEmail_register, setFocusEmail_register] = useState(false);
  const [focusPassword_register, setFocusPassword_register] = useState(false);
  const [focusConformPassword_register, setFocusConformPassword_register] =
    useState(false);
  const [focusFaculty, setFocusFaculty] = useState(false);
  const [focusClassroom, setFocusClassroom] = useState(false);
  const [focusPhone, setFocusPhone] = useState(false);
  const [eye_register, setEye_register] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email_register, setEmail_register] = useState("");
  const [password_register, setPassword_register] = useState("");
  const [confirmPs, setConfirmPs] = useState("");
  const [faculty, setFaculty] = useState("");
  const [messageRegister, setMessageRegister] = useState({});
  const [classroom, setClassroom] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  const [active, setActive] = useState(false);
  const containerRef = useRef();

  //login
  const handleFocusPassword_login = () => {
    setFocusPassword_login(true);
    setMessageLogin({});
  };

  const handleFocusEmail_login = () => {
    setFocusEmail_login(true);
    setMessageLogin({});
  };

  const handleLogin = () => {
    setLoading(true);
    setMessageLogin({});
    loginHomePageApi
      .loginUser({}, { email: email_login, password: password_login })
      .then((data) => {
        setLoading(false);
        if (data?.codeNumber === 0) {
          //success
          dispatch(loginUserSucceed(data?.user));
          navigate(`${path.HOMEPAGE}`);
        } else {
          //false
          setMessageLogin({
            codeNumber: data?.codeNumber,
            message: data?.message,
          });
          dispatch(loginUserFailed());
        }
      });
  };

  useEffect(() => {
    const userInfo = JSON.parse(
      localStorage.getItem("auth-bookingCare-UET_student")
    );
    if (userInfo && userInfo?.isLogin === true && userInfo?.role === "R3") {
      navigate(`${path.HOMEPAGE}`);
    }
  }, []);

  const handleSignIn = () => {
    setActive(false);
  };

  const handleSignUp = () => {
    console.log(1);
    setActive(true);
  };

  //register
  const handleFocusFullName_register = () => {
    setFocusFullName(true);
    setMessageRegister({});
  };
  const handleFocusPassword_register = () => {
    setFocusPassword_register(true);
    setMessageRegister({});
  };
  const handleFocusEmail_register = () => {
    setFocusEmail_register(true);
    setMessageRegister({});
  };
  const handleFocusConfirmPassword_register = () => {
    setFocusConformPassword_register(true);
    setMessageRegister({});
  };
  const handleFocusFaculty_register = () => {
    setFocusFaculty(true);
    setMessageRegister({});
  };
  const handleFocusClassroom_register = () => {
    setFocusClassroom(true);
    setMessageRegister({});
  };
  const handleFocusPhone_register = () => {
    setFocusPhone(true);
    setMessageRegister({});
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
    for (let i = 0; i < stateArr.length; i++) {
      if (!stateArr[i]) {
        setMessageRegister(`${notification_en[i]} is required.`);
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
        setMessageRegister(`Please enter the correct email format.`);
        return false;
      }
      if (!regexPassword.test(password_register)) {
        setMessageRegister(
          `Password must have the least 8 letters, 1 number and 1 special character.`
        );
        return false;
      }
      if (!rejexPhoneNumber.test(phone)) {
        setMessageRegister(`Please enter the correct phone format.`);
        return false;
      }

      return result;
    }
  };

  const handleRegister = () => {
    console.log("register");
    console.log(password_register, confirmPs);
    if (
      password_register &&
      confirmPs &&
      password_register === confirmPs &&
      handleCheckValidate_Register()
    ) {
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
          setLoading(false);
          if (data?.codeNumber === 0) {
            //success
            dispatch(loginUserSucceed(data?.user));
            navigate(`${path.HOMEPAGE}`);
          } else {
            //false
            setMessageRegister({
              codeNumber: data?.codeNumber,
              message: data?.message,
            });
            dispatch(loginUserFailed());
          }
        });
    } else {
      setMessageRegister({
        codeNumber: 1,
        message: "Password is not match. Please try again.",
      });
    }
  };

  return (
    <div className="login-register-homepage-container">
      <HomeHeader />
      <div className={`${active ? "active" : ""} container`} ref={containerRef}>
        <div className="box">
          <div className="form login">
            <div className="font-semibold text-center login-text py-1">
              Login
            </div>
            <div
              className={`${
                messageLogin?.codeNumber === 2
                  ? "messageLogin-email"
                  : "messageLogin-text"
              } text-center mt-1`}
              style={
                messageLogin && messageLogin?.codeNumber
                  ? { opacity: "1" }
                  : { opacity: "0" }
              }
            >
              {`${messageLogin?.message ? messageLogin?.message : "none"}`}
            </div>
            <div className="flex items-center justify-center">
              {loading && <Loading />}
            </div>
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
                                  ${
                                    focusEmail_login
                                      ? "bg-white duration-200 transition-all"
                                      : "bg-slate-200 duration-200 transition-all"
                                  }
                                  `}
                value={email_login}
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail_login(e.target.value)}
              />
            </div>
            <div className="login-form w-2/3 flex flex-col items-start justify-center pb-4 relative">
              <label className="opacity-70 pb-1 pl-1" htmlFor="password">
                Password
              </label>
              <input
                autoComplete="false"
                onFocus={() => handleFocusPassword_login()}
                onBlur={() => setFocusPassword_login(false)}
                className={`w-full py-2 px-3 rounded-md placeholder:text-slate-400 outline-none
                                  ${
                                    focusPassword_login
                                      ? "bg-white duration-300 transition-all"
                                      : "bg-slate-200 duration-300 transition-all"
                                  }
                                  `}
                value={password_login}
                id="password"
                type={`${eye_login ? "text" : "password"}`}
                name="password"
                placeholder="Enter your password"
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
              <button className="w-full btn-form rounded-lg">Log in</button>
            </div>
            <NavLink to="/forgot-pass" className="mt-2 w-full">
              <span className="login-forgot pl-1 cursor-pointer">
                Forgot your password?
              </span>
            </NavLink>
          </div>

          <div className="form register">
            <div className="font-semibold text-center register-text py-1">
              Sign up
            </div>
            <div
              className={`${
                messageRegister?.codeNumber === 2
                  ? "messageRegister-email"
                  : "messageRegister-text"
              } text-center mt-1`}
              style={
                messageRegister && messageRegister?.codeNumber
                  ? { opacity: "1" }
                  : { opacity: "0" }
              }
            >
              {`${
                messageRegister?.message ? messageRegister?.message : "none"
              }`}
            </div>
            <div className="flex items-center justify-center">
              {loading && <Loading />}
            </div>
            <div className="register-form w-2/3 flex flex-col items-start justify-center pb-4 mt-2">
              <div className="flex items-center justify-start pl-1 pb-1 gap-0.5">
                <FaPencilAlt className="text-sm opacity-70" />
                <label className="opacity-70" htmlFor="name_register">
                  FullName
                </label>
              </div>
              <input
                autoComplete="false"
                onFocus={() => handleFocusFullName_register()}
                onBlur={() => setFocusFullName(false)}
                className={`w-full py-2 px-3 rounded-md placeholder:text-slate-400 outline-none
                                  ${
                                    focusFullName
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
                                  ${
                                    focusEmail_register
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
                Password
              </label>
              <input
                autoComplete="false"
                onFocus={() => handleFocusPassword_register()}
                onBlur={() => setFocusPassword_register(false)}
                className={`w-full py-2 px-3 rounded-md placeholder:text-slate-400 outline-none
                                  ${
                                    focusPassword_register
                                      ? "bg-white duration-200 transition-all"
                                      : "bg-slate-200 duration-200 transition-all"
                                  }
                                  `}
                value={password_register}
                id="pass_re"
                type={`${eye_register ? "text" : "password"}`}
                name="pass_re"
                placeholder="Enter your password"
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
                Confirm Password
              </label>
              <input
                autoComplete="false"
                onFocus={() => handleFocusConfirmPassword_register()}
                onBlur={() => setFocusConformPassword_register(false)}
                className={`w-full py-2 px-3 rounded-md placeholder:text-slate-400 outline-none
                                  ${
                                    focusConformPassword_register
                                      ? "bg-white duration-300 transition-all"
                                      : "bg-slate-200 duration-300 transition-all"
                                  }
                                  `}
                value={confirmPs}
                id="password"
                type={`${eye_register ? "text" : "password"}`}
                name="password"
                placeholder="Enter your password"
                onChange={(e) => setConfirmPs(e.target.value)}
              />
            </div>
            <div className="register-form w-2/3 flex flex-col items-start justify-center pb-4 mt-2">
              <label className="opacity-70 pb-1 pl-1" htmlFor="faculties">
                Khoa
              </label>
              <select
                className={`w-full py-2 px-3 rounded-md placeholder:text-slate-400 outline-none
                                  ${
                                    focusFaculty
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
                <option name="faculties" value="">
                  Select---
                </option>
                {select_faculty?.length > 0 &&
                  select_faculty?.map((e, i) => {
                    return (
                      <option key={i} name="faculties" value={e?.value}>
                        {e?.label}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="register-form w-2/3 flex flex-col items-start justify-center pb-4 mt-2">
              <label className="opacity-70 pb-1 pl-1" htmlFor="classroom">
                Classroom
              </label>
              <input
                autoComplete="false"
                onFocus={() => handleFocusClassroom_register()}
                onBlur={() => setFocusClassroom(false)}
                className={`w-full py-2 px-3 rounded-md placeholder:text-slate-400 outline-none
                                  ${
                                    focusClassroom
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
                PhoneNumber
              </label>
              <input
                autoComplete="false"
                onFocus={() => handleFocusPhone_register()}
                onBlur={() => setFocusPhone(false)}
                className={`w-full py-2 px-3 rounded-md placeholder:text-slate-400 outline-none
                                  ${
                                    focusPhone
                                      ? "bg-white duration-200 transition-all"
                                      : "bg-slate-200 duration-200 transition-all"
                                  }
                                  `}
                value={phone}
                id="phone"
                type="text"
                name="phone"
                placeholder="Enter your phoneNumber"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="w-1/3 mt-4" onClick={() => handleRegister()}>
              <button className="w-full btn-form rounded-lg py-1">
                Sign up
              </button>
            </div>
          </div>
        </div>

        <div class="overlay">
          <div class="page page_signUp">
            <h3>Welcome Back!</h3>
            <p>
              To Dialogue scheduling system And Support answer questions for
              learners of UET.
            </p>

            <button class="btn btnSign-in" onClick={() => handleSignIn()}>
              Sign Up <i class="bi bi-arrow-right"></i>
            </button>
          </div>

          <div class="page page_signIn">
            <h3>Hello Friend!</h3>
            <p>Let's register to use website. Good luck to you.</p>

            <button class="btn btnSign-up" onClick={() => handleSignUp()}>
              <i class="bi bi-arrow-left"></i> Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
