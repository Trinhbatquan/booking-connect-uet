import React, { useState, useEffect } from "react";
import { BsEyeSlash } from "react-icons/bs";
import { IoMdEye } from "react-icons/io";
import { useParams } from "react-router";
import Loading from "../../../utils/Loading";
import { loginHomePageApi } from "../../../services/userService";
import { toast } from "react-toastify";
import HomeHeader from "../HomeHeader";

const UpdatePassword = () => {
  const param = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [focusEmail_login, setFocusEmail_login] = useState(false);
  const [focusPassword_login, setFocusPassword_login] = useState(false);
  const [focusConformPassword, setFocusConformPassword] = useState(false);

  const [messageLogin, setMessageLogin] = useState("");
  const [email_login, setEmail_login] = useState(param?.email);
  const [password_login, setPassword_login] = useState("");
  const [confirmPs, setConfirmPs] = useState("");
  const [color, setColor] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  const [expired, setExpired] = useState(4 * 60);

  const [eye_login, setEye_login] = useState(false);

  useEffect(() => {
    let time = setInterval(() => {
      setExpired((prevState) => {
        if (prevState > 0) {
          return prevState - 1;
        } else {
          clearInterval();
          return 0;
        }
      });
    }, 1000);
    return () => {
      clearInterval(time);
    };
  }, []);

  const handleFocusEmail_login = () => {
    setFocusEmail_login(true);
    setMessageLogin("");
  };
  const handleFocusPassword_login = () => {
    setFocusPassword_login(true);
    setMessageLogin("");
  };
  const handleFocusConfirmPassword = () => {
    setFocusConformPassword(true);
    setMessageLogin("");
  };

  const checkAdvancedRegister = () => {
    // let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let regexPassword =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
    if (!password_login || !confirmPs) {
      setMessageLogin("Please enter all field.");
      return false;
    }
    if (!regexPassword.test(password_login) || !regexPassword.test(confirmPs)) {
      setMessageLogin(
        "Password must have the least 8 characters, 1 number and 1 a special character."
      );
      return false;
    }
    if (password_login.trim() !== confirmPs.trim()) {
      setMessageLogin("Password not match. Please try again.");
      return false;
    }
    return true;
  };
  const handleUpdateForgotPassword = () => {
    if (checkAdvancedRegister()) {
      setIsLoading(true);
      setMessageLogin("");
      setTimeout(() => {
        loginHomePageApi
          .updatePass_forgot(
            {},
            { email: email_login, token: param.token, password: password_login }
          )
          .then((data) => {
            if (data?.codeNumber === 2) {
              setColor(true);
              setMessageLogin(data?.message);
              setDisableButton(true);
            } else if (data?.codeNumber === 3) {
              setColor(false);
              setMessageLogin(data?.message);
            } else {
              setColor(false);
              toast.error("Error.Please contact with admin page.", {
                theme: "colored",
                autoClose: 3000,
                position: "bottom-right",
              });
            }
            setIsLoading(false);
          });
      }, 2000);
    }
  };

  const handleSendAgainLink = () => {
    setIsLoading(true);
    setMessageLogin("");
    setTimeout(() => {
      loginHomePageApi.forgot({ email: email_login }).then((data) => {
        if (data?.codeNumber === 2) {
          setMessageLogin(data?.message);
          setColor(true);
        } else {
          setMessageLogin(data?.message);
          setColor(false);
        }
        setIsLoading(false);
      });
    }, 2000);
  };

  return (
    <div
      className="flex items-center justify-center"
      style={{
        backgroundColor: "rgb(234, 224, 224)",
        width: "100%",
        height: "100vh",
      }}
    >
      <HomeHeader />
      <div
        className="container h-[550px] w-[65%] mx-auto flex overflow-hidden bg-white"
        style={{
          marginTop: "100px",
          boxShadow:
            "rgba(0, 0, 0, 0.25) 0px 14px 28px,rgba(0, 0, 0, 0.22) 0px 10px 10px",
        }}
      >
        <div
          class="overlay w-[50%] flex items-center justify-center"
          style={{ backgroundColor: "#6741ff" }}
        >
          <div class="text-center">
            <h3 style={{ color: "#fff", fontSize: "30px" }}>Update Password</h3>
            <p
              className="font-semibold text-white"
              style={{ fontSize: "16px" }}
            >
              Let's follow instruction to finish.
            </p>
          </div>
        </div>
        <div className="w-[50%] flex flex-col items-center justify-center">
          <p className="w-[80%] text-center mx-auto text-blue-700 text-lg mt-16 flex flex-col items-center justify-center gap-0.5">
            <span>Please enter new password to update.</span>
            <span>{`Time left: ${expired}s`}</span>
          </p>
          {isLoading && <Loading />}
          <div
            className={`flex text-center items-center justify-center pb-2 pt-3 text-md ${
              color ? "text-blue-700" : "text-red-600"
            }`}
            style={
              messageLogin
                ? { opacity: 1, maxWidth: "90%", width: "90%" }
                : { opacity: 0, maxWidth: "90%", width: "90%" }
            }
          >
            <span className="py-1">{messageLogin ? messageLogin : "None"}</span>
          </div>
          <input
            autoComplete="false"
            className={`w-[70%] py-3 px-3 mb-4 text-md rounded-md placeholder:text-slate-400 outline-none
                                  bg-white duration-200 transition-all
                                  `}
            value={email_login}
            id="email"
            type="email"
            disabled
            name="email"
            placeholder="Enter your email"
          />
          <div className="login-form w-[70%] mb-4 relative">
            <input
              autoComplete="false"
              onFocus={() => handleFocusPassword_login()}
              onBlur={() => setFocusPassword_login(false)}
              className={`w-full py-3 px-3 text-md rounded-md placeholder:text-slate-400 outline-none
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
                className="absolute right-4 bottom-4 cursor-pointer text-xl"
                onClick={() => setEye_login(false)}
              />
            ) : (
              <BsEyeSlash
                className="absolute right-4 bottom-4 cursor-pointer text-xl"
                onClick={() => setEye_login(true)}
              />
            )}
          </div>
          <input
            autoComplete="false"
            onFocus={() => handleFocusConfirmPassword()}
            onBlur={() => setFocusConformPassword(false)}
            className={`w-[70%] py-3 mb-4 px-3 text-md rounded-md placeholder:text-slate-400 outline-none
                                  ${
                                    focusConformPassword
                                      ? "bg-white duration-300 transition-all"
                                      : "bg-slate-200 duration-300 transition-all"
                                  }
                                  `}
            value={confirmPs}
            id="password_confirm"
            type={`${eye_login ? "text" : "password"}`}
            name="password"
            placeholder="Confirm your password"
            onChange={(e) => setConfirmPs(e.target.value)}
          />
          <div
            className="w-fit mt-3"
            onClick={() => !disableButton && handleUpdateForgotPassword()}
          >
            <button
              className={`w-full rounded-lg ${
                disableButton ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              style={{
                backgroundColor: "rgb(55, 55, 204)",
                fontSize: "16px",
                color: "white",
                fontWeight: "bold",
                padding: "10px 15px",
              }}
            >
              Update Password
            </button>
          </div>
          <p className="pt-2 text-headingColor opacity-80 text-sm cursor-pointer mx-auto text-center flex items-center justify-center gap-1">
            Time end.
            <div>
              <span
                className={`text-blue-700 text-md ${
                  disableButton ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                onClick={() => !disableButton && handleSendAgainLink()}
              >
                Send a new link.
              </span>
            </div>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
