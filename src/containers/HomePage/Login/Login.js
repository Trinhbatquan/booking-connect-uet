import React, { useEffect, useState } from "react";
import { BsEyeSlash } from "react-icons/bs";
import { IoMdEye } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { path } from "../../../utils/constant";

import "../../Auth/Login/Login.scss";
import { loginHomePageApi } from "../../../services/userService";
import { loginUserFailed, loginUserSucceed } from "../../../redux/studentSlice";
import Loading from "./../../../utils/Loading";

const Login = () => {
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [eye, setEye] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messageLogin, setMessageLogin] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleFocusPassword = () => {
    setFocusPassword(true);
    setMessageLogin({});
  };

  const handleFocusEmail = () => {
    setFocusEmail(true);
    setMessageLogin({});
  };

  const handleLogin = () => {
    console.log(email, password);
    setLoading(true);
    setMessageLogin({});
    loginHomePageApi.loginUser({}, { email, password }).then((data) => {
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

  return (
    <div className="login-container">
      <div className="login">
        <div className="font-semibold pt-4 text-center login-text mt-1">
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
            Password
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
          <button className="w-full login-btn rounded-lg py-2">Log in</button>
        </div>
        <div className="mt-1 w-full">
          <span className="login-forgot pl-1 cursor-pointer">
            Forgot your password?
          </span>
        </div>
        {/* <div className="w-full mt-8 text-center">
          <span className="login-other">Or login with</span>
          <div className="w-full flex items-center justify-center py-2">
            <FaFacebookF className="rounded-full bg-blue-700 text-white w-9 h-9 px-2 py-2 mr-2 cursor-pointer" />
            <FaGoogle className="rounded-full bg-red-700 text-white w-9 h-9 px-2 py-2 cursor-pointer" />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
