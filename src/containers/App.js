import { Fragment, useState, useEffect, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { path } from "../utils/constant";

import Login from "./Auth/Login/Login";

import HomePage from "./HomePage/HomePage";
import TeacherDetail from "./HomePage/Detail/TeacherDetail";
import LoginHomePage from "./HomePage/Login/Login";

import { BsArrowUpCircleFill } from "react-icons/bs";

import "../styles/styles.scss";

import {
  RootSystem,
  ScheduleManager,
  DepartmentManager,
  FacultyManager,
  TeacherManager,
  HealthStudentManager,
  TeacherDescription,
  DepartmentDescription,
  FacultyDescription,
  HealthStudentDescription,
  NotificationSystem,
} from "./System";
import EmailVerify from "./HomePage/EmailVerify/EmailVerify";
import ScheduleAndQuestion from "./System/ScheduleAndQuestionManager/ScheduleAndQuestion";
import ForgotPassword from "./HomePage/Login/ForgotPassword";
import UpdatePassword from "./HomePage/Login/UpdatePassword";
import RootManager from "./Manager/RootManager";
import Schedule from "./Manager/Schedule/Schedule";
import Student from "./Manager/Student/Student";
import Notification from "./Manager/Notification/Notification";
import Dashboard from "./Manager/Dashboard/Dashboard";
import DashboardSystem from "./System/DashboardSystem/DashboardSystem";
import FacultyDetail from "./HomePage/Detail/FacultyDetail";

function App() {
  const [appearScrollTop, setAppearScrollTop] = useState(false);
  console.log(appearScrollTop);

  const handleScroll = (state) => {
    if (
      document.body?.scrollTop > 500 ||
      document.documentElement?.scrollTop > 500
    ) {
      if (!state) {
        setAppearScrollTop(true);
      }
    } else {
      if (state) {
        setAppearScrollTop(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener(
      "scroll",
      () => handleScroll(appearScrollTop),
      true
    );

    // Remove the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [appearScrollTop]);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="">
      {/* để 100vh là toang, nó chỉ tính phần dc hiển thị thôi */}
      <Routes>
        {/* homepage */}
        <Route path="/" element={<Navigate to={path.HOMEPAGE} replace />} />

        <Route path={path.HOMEPAGE} element={<HomePage />} />
        <Route
          path={`${path.HOMEPAGE}/${path.detail_id}/:id/role/:roleId`}
          element={<TeacherDetail />}
        />
        <Route
          path={`${path.HOMEPAGE}/${path.detail_mul_id}/:id/role/:roleId`}
          element={<FacultyDetail />}
        />
        <Route
          path={`${path.HOMEPAGE}/${path.login_homepage}`}
          element={<LoginHomePage />}
        />
        <Route path="/users/:id/verify/:token" element={<EmailVerify />} />
        <Route path="/forgot-pass" element={<ForgotPassword />} />
        <Route
          path="/updatePass/:email/verify/:token"
          element={<UpdatePassword />}
        />

        {/* system */}
        <Route
          path={`${path.SYSTEM}/${path.LOGIN_SYSTEM}`}
          element={<Login />}
        />

        <Route path={path.SYSTEM} element={<RootSystem />}>
          <Route path={path.scheduleManager} element={<ScheduleManager />} />
          <Route path={path.studentManager} element={<ScheduleAndQuestion />} />

          <Route
            path={path.departmentManager}
            element={<DepartmentManager />}
          />
          <Route
            path={path.departmentDescription}
            element={<DepartmentDescription />}
          />

          <Route path={path.facultyManager} element={<FacultyManager />} />
          <Route
            path={path.facultyDescription}
            element={<FacultyDescription />}
          />

          <Route path={path.teacherManager} element={<TeacherManager />} />
          <Route
            path={path.teacherDescription}
            element={<TeacherDescription />}
          />

          <Route
            path={path.healthStudentManager}
            element={<HealthStudentManager />}
          />
          <Route
            path={path.healthStudentDescription}
            element={<HealthStudentDescription />}
          />
          <Route path={path.dashboardManager} element={<DashboardSystem />} />
          <Route
            path={path.notificationManager}
            element={<NotificationSystem />}
          />
        </Route>

        {/* manager */}
        <Route path={path.MANAGER} element={<RootManager />}>
          <Route path={path.schedule} element={<Schedule />} />
          <Route path={path.student} element={<Student />} />
          <Route path={path.notification} element={<Notification />} />
          <Route path={path.dashboard} element={<Dashboard />} />
        </Route>
      </Routes>
      {appearScrollTop && (
        <BsArrowUpCircleFill
          className="fixed bottom-6 right-3 text-5xl cursor-pointer
        text-blue-700 z-50 opacity-30 hover:opacity-100 transition-all duration-500"
          onClick={handleScrollTop}
        ></BsArrowUpCircleFill>
      )}
    </div>
  );
}

export default App;
