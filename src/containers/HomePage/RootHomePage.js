import React,{ lazy,Suspense,useEffect } from "react";
import { Outlet,useLocation,useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { path } from "../../utils/constant";
import HomeHeader from "./HomeHeader";

const RootHomePage = () => {
  const currentUser = useSelector((state) => state.studentReducer);
  const pathName = useLocation()?.pathname;
  // console.log("pathName");
  // console.log(pathName);

  const navigate = useNavigate();

  useEffect(() => {
    // console.log("useEffect root homepath");
    if (!JSON.parse(localStorage.getItem("auth-bookingCare-UET_student"))) {
      navigate(`${path.HOMEPAGE}/${path.login_homepage}redirect=/homepage`);
    }
  },[]);

  return (
    <div>
      {currentUser && currentUser?.isLogin ? (
        <>
          <HomeHeader />
          <div className="w-full h-[100px]"></div>
          <Outlet />
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default RootHomePage;
