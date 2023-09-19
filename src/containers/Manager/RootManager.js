import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useNavigate } from "react-router";
import { createContext } from "react";

import Header from "../System/Header/Header";
import { path } from "../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { getNotiFy } from "../../services/notificationService";
import { getAllNotify } from "../../redux/notificationSlice";

const RootManager = () => {
  console.log(`${path.SYSTEM}${path.LOGIN_SYSTEM}`);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.authReducer);

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("auth-bookingCare-UET_system"))) {
      navigate(`${path.SYSTEM}/${path.LOGIN_SYSTEM}?redirect=/system`);
    }

    if (
      currentUser?.isLogin &&
      currentUser?.role !== "R1" &&
      currentUser?.role !== "R3"
    ) {
      getNotiFy
        .get({ managerId: currentUser?.id, roleManager: currentUser?.role })
        .then((res) => {
          console.log(res);

          if (res?.codeNUmber === 0) {
            dispatch(getAllNotify(res?.notify));
          }
        });
    }
  }, []);

  return (
    <div>
      <Header />
      <div className="w-full" style={{ height: "110px" }}></div>
      <Outlet />
    </div>
  );
};

export default RootManager;
