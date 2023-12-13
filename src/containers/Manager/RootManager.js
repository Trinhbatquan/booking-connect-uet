import React,{ useEffect,useState } from "react";
import { Outlet } from "react-router";
import { useNavigate } from "react-router";
import { createContext } from "react";

import Header from "../System/Header/Header";
import { path } from "../../utils/constant";
import { useDispatch,useSelector } from "react-redux";
// import { getNotiFy } from "../../services/notificationService";
// import { getAllNotify } from "../../redux/notificationSlice";

const RootManager = () => {
  // console.log(`${path.SYSTEM}${path.LOGIN_SYSTEM}`);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.authReducer);

  useEffect(() => {
    if (
      !currentUser ||
      !currentUser?.isLogin ||
      currentUser?.role === "R3" ||
      currentUser.role === "R1"
    ) {
      navigate(`${path.SYSTEM}/${path.LOGIN_SYSTEM}?redirect=/system`);
    }
  },[]);

  return (
    <div>
      {currentUser?.role &&
        currentUser?.role !== "R1" &&
        currentUser?.role !== "R3" && (
          <>
            <Header />
            <Outlet />
          </>
        )}
    </div>
  );
};

export default RootManager;
