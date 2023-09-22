import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useNavigate } from "react-router";
import { createContext } from "react";

import Header from "./Header/Header";
import { path } from "../../utils/constant";

import "./RootSystem.scss";

// export const ContextScrollTop = createContext();
const RootSystem = () => {
  console.log(`${path.SYSTEM}${path.LOGIN_SYSTEM}`);
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("auth-bookingCare-UET_system")
  );

  useEffect(() => {
    if (!currentUser?.isLogin || currentUser?.role !== "R1") {
      navigate(`${path.SYSTEM}/${path.LOGIN_SYSTEM}?redirect=/system`);
    }
  }, []);

  return (
    // <ContextScrollTop.Provider value={{ isScroll: scrollToTop }}>
    <div
    // className="overflow-y-scroll"
    // style={{ width: "100vw", height: "100vh" }}
    >
      <Header />
      {/* <div className="w-full" style={{ height: "110px" }}></div> */}
      <Outlet />
    </div>
    // </ContextScrollTop.Provider>
  );
};

export default RootSystem;
