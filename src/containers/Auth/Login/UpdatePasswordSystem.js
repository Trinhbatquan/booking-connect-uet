import React, { useState, useEffect } from "react";
import { BsEyeSlash } from "react-icons/bs";
import { IoMdEye } from "react-icons/io";
import { useNavigate, useParams } from "react-router";
import Loading from "../../../utils/Loading";
import { loginApi, loginHomePageApi } from "../../../services/userService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import banner from "../../../assets/image/June.png";
import { path } from "../../../utils/constant";

const UpdatePasswordSystem = () => {
  const navigate = useNavigate();
  const param = useParams();
  const [isLoading, setIsLoading] = useState(false);
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

  const { t, i18n } = useTranslation();

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

  const handleFocusPassword_login = () => {
    setFocusPassword_login(true);
    setMessageLogin("");
  };
  const handleFocusConfirmPassword = () => {
    setFocusConformPassword(true);
    setMessageLogin("");
  };

  const checkAdvancedRegister = () => {
    let regexPassword =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
    if (!password_login || !confirmPs) {
      setMessageLogin(
        i18n.language === "en"
          ? "Please enter all fields."
          : "Vui lòng nhập đủ các trường"
      );
      return false;
    }
    if (!regexPassword.test(password_login) || !regexPassword.test(confirmPs)) {
      setMessageLogin(t("system.notification.password"));
      return false;
    }
    if (password_login !== confirmPs) {
      setMessageLogin(t("system.notification.matchPassword"));
      return false;
    }
    return true;
  };
  const handleUpdateForgotPassword = () => {
    if (checkAdvancedRegister()) {
      setIsLoading(true);
      setMessageLogin("");
      loginApi
        .updatePass_forgot(
          {},
          {
            email: email_login,
            token: param.token,
            password: password_login,
            userId: param.userId,
            roleId: param.roleId,
          }
        )
        .then((data) => {
          if (data?.codeNumber === 2) {
            setColor(true);
            setMessageLogin(
              i18n.language === "en" ? data?.message_en : data?.message_vn
            );
            setTimeout(() => {
              navigate(`${path.SYSTEM}/${path.LOGIN_SYSTEM}?redirect=/system`);
            }, 3000);
            setDisableButton(true);
          } else if (data?.codeNumber === 3) {
            setColor(false);
            setMessageLogin(
              i18n.language === "en" ? data?.message_en : data?.message_vn
            );
          } else {
            setColor(false);
            setMessageLogin(t("system.notification.fail"));
          }
          setIsLoading(false);
        });
    }
  };

  const handleSendAgainLink = () => {
    setIsLoading(true);
    setMessageLogin("");
    loginApi.forgot({ email: email_login }).then((data) => {
      if (data?.codeNumber === 2) {
        setMessageLogin(
          i18n.language === "en" ? data?.message_en : data?.message_vn
        );
        setColor(true);
      } else {
        setMessageLogin(
          i18n.language === "en" ? data?.message_en : data?.message_vn
        );
        setColor(false);
      }
      setIsLoading(false);
    });
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
      {isLoading && (
        <div className="fixed loading-overlay top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25">
          <div className="absolute top-[50%] left-[50%]">
            <Loading />
          </div>
        </div>
      )}
      <div
        className="container h-[550px] w-[65%] mx-auto flex overflow-hidden bg-white"
        style={{
          marginTop: "100px",
          boxShadow:
            "rgba(0, 0, 0, 0.25) 0px 14px 28px,rgba(0, 0, 0, 0.22) 0px 10px 10px",
        }}
      >
        <div class="overlay w-[50%] flex items-center justify-center">
          <div
            style={{
              background: `url(${banner})`,
              width: "100%",
              height: "100%",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>
        <div className="w-[50%] flex flex-col items-center justify-center">
          <p className="w-[80%] text-center mx-auto text-blue-700 text-lg mt-16 flex flex-col items-center justify-center gap-0.5">
            <span>
              {i18n.language === "en"
                ? "Please enter new password to update."
                : "Vui lòng nhập mật khẩu mới để cập nhật."}
            </span>
            <span>
              {i18n.language === "en"
                ? `Time left: ${expired}s`
                : `Thời gian còn lại: ${expired}s`}
            </span>
          </p>
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
              placeholder={
                i18n.language === "en" ? "Enter your password" : "Nhập mật khẩu"
              }
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
            placeholder={
              i18n.language === "en" ? "Enter your password" : "Nhập mật khẩu"
            }
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
              {i18n.language === "en" ? "Update Password" : "Cập nhật mật khẩu"}
            </button>
          </div>
          <p className="pt-2 text-headingColor opacity-80 text-sm cursor-pointer mx-auto text-center flex items-center justify-center gap-1">
            {i18n.language === "en" ? "Time end." : "Thời gian kết thúc."}
            <div>
              <span
                className={`text-blue-700 text-md ${
                  disableButton ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                onClick={() => !disableButton && handleSendAgainLink()}
              >
                {i18n.language === "en" ? "Send a new link." : "Gửi link mới."}
              </span>
            </div>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordSystem;
