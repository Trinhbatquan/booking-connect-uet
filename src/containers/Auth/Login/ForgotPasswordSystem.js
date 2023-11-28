import React, { useState, useEffect } from "react";
import Loading from "../../../utils/Loading";
// import { loginHomePageApi } from "../../../services/userService";
import { useTranslation } from "react-i18next";
import banner from "../../../assets/image/June.png";
import { loginApi } from "../../../services/userService";

const ForgotPasswordSystem = () => {
  const [focusEmail_login, setFocusEmail_login] = useState(false);
  const [messageLogin, setMessageLogin] = useState("");
  const [email_login, setEmail_login] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [color, setColor] = useState(false);

  const { t, i18n } = useTranslation();

  const handleFocusEmail_login = () => {
    setFocusEmail_login(true);
    setMessageLogin("");
  };

  const checkAdvancedRegister = () => {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email_login) {
      setMessageLogin(`${t("system.table.email")} ${t("system.table.mess-2")}`);
      return false;
    }
    if (!regexEmail.test(email_login)) {
      setMessageLogin(t("system.notification.email"));
      return false;
    }
    return true;
  };

  const handleGetLinkToUpdatePassword = () => {
    if (checkAdvancedRegister()) {
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
    }
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
        <div class="overlay w-[50%] h-[100%] flex items-center justify-center">
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
          <p
            className=""
            style={{ fontSize: "18px", color: "rgb(55, 55, 204)" }}
          >
            {i18n.language === "en"
              ? "Please enter email to continue."
              : "Vui lòng nhập email để tiếp tục."}
          </p>
          <div
            className={`flex text-center items-center justify-center py-2 text-md ${
              color ? "text-blue-700" : "text-red-600"
            }`}
            style={
              messageLogin
                ? { opacity: 1, maxWidth: "90%", width: "90%" }
                : { opacity: 0, maxWidth: "90%", width: "90%" }
            }
          >
            <span className="">{messageLogin ? messageLogin : "None"}</span>
          </div>
          <input
            autoComplete="false"
            onFocus={() => handleFocusEmail_login()}
            onBlur={() => setFocusEmail_login(false)}
            className={`w-[70%] py-3 px-3 text-md rounded-md placeholder:text-slate-400 outline-none
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
            placeholder=""
            onChange={(e) => setEmail_login(e.target.value)}
          />
          <div
            className="w-1/4 mt-6"
            onClick={() => handleGetLinkToUpdatePassword()}
          >
            <button
              className="w-full rounded-lg text-lg"
              style={{
                backgroundColor: "rgb(55, 55, 204)",
                fontSize: "16px",
                color: "white",
                fontWeight: "bold",
                height: "40px",
              }}
            >
              {i18n.language === "en" ? "Continue" : "Tiếp tục"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordSystem;
