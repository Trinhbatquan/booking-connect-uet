import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import success from "../../../assets/image/success.png";
import { loginHomePageApi } from "../../../services/userService";
import { useNavigate, useParams } from "react-router";
import Loading from "./../../../utils/Loading";
import Button from "../../../utils/Button_Home";
import { NavLink } from "react-router-dom";
import { path } from "./../../../utils/constant";
import { loginUserFailed, loginUserSucceed } from "../../../redux/studentSlice";
import HomeHeader from "../HomeHeader";
import { useTranslation } from "react-i18next";

const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(true);
  const [loading, setLoading] = useState(true);
  const param = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      try {
        loginHomePageApi
          .verifyEmailUrl({ id: param.id, token: param.token })
          .then((data) => {
            if (data?.codeNumber === 0) {
              setValidUrl(true);
              dispatch(loginUserSucceed(data?.user));
              navigate(path.HOMEPAGE);
            } else {
              setValidUrl(false);
              dispatch(loginUserFailed());
            }
            setLoading(false);
          });
      } catch (e) {
        console.log("verify email uel error /n" + e);
      }
    }, 3000);
  }, []);

  return (
    <div
      className=" flex items-center justify-center"
      style={{ width: "100vw", height: "100vh" }}
    >
      <HomeHeader />
      <div className="w-full h-[100px]"></div>
      {loading ? (
        <div className="fixed z-50 top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25">
          <div className="absolute top-[50%] left-[50%]">
            <Loading />
          </div>
        </div>
      ) : validUrl ? (
        ""
      ) : (
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-black font-semibold text-2xl">Oh oh...</p>
          <p className="text-black opacity-80 text-md">
            {t("system.notification.fail")}
          </p>
          <NavLink to={`${path.HOMEPAGE}/${path.login_homepage}`}>
            <Button text="Login" />
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default EmailVerify;
