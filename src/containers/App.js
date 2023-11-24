import { Fragment, useState, useEffect, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { path } from "../utils/constant";

import Login from "./Auth/Login/Login";

import HomePage from "./HomePage/HomePage";
import Detail from "./HomePage/Detail/Detail";
import LoginHomePage from "./HomePage/Login/Login";

import { BsArrowUpCircleFill } from "react-icons/bs";

import "../styles/styles.scss";

import {
  CreateScheduleSystem,
  DashboardSystem,
  NewSystem,
  NotificationSystem,
  RootDepartment,
  RootFaculty,
  RootHealthStudentSystem,
  RootSystem,
  RootTeacher,
  ScheduleAndQuestionSystem,
} from "./System";
import EmailVerify from "./HomePage/EmailVerify/EmailVerify";
import ForgotPassword from "./HomePage/Login/ForgotPassword";
import UpdatePassword from "./HomePage/Login/UpdatePassword";
import RootManager from "./Manager/RootManager";
import Schedule from "./Manager/Schedule/Schedule";
import Student from "./Manager/Student/Student";
import Notification from "./Manager/Notification/Notification";
import Dashboard from "./Manager/Dashboard/Dashboard";
import FacultyDetail from "./HomePage/Detail/FacultyDetail";
import UpdateProfile from "./HomePage/UpdateProfile";
import Inform from "./HomePage/Inform";
import Contact from "./HomePage/Contact";
import SurveyOpinion from "./HomePage/Survey Opinion";
import NewsSystem from "./System/News/NewsSystem";
import SeeAllTeacher from "./HomePage/SeeAll/SeeAllTeacher";
import NewsSeeAll from "./HomePage/SeeAll/NewsSeeAll";
import NewsDetail from "./HomePage/Detail/NewsDetail";
import NotificationSeeAll from "./HomePage/SeeAll/NotificationSeeAll";
import NotificationDetail from "./HomePage/Detail/NotificationDetail";
import HealthSeeAll from "./HomePage/SeeAll/HealthSeeAll";
import ProcessBooking from "./HomePage/ProcessBooking/ProcessBooking";

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
          path={`${path.HOMEPAGE}/:code_url/ids-role/:roleId`}
          element={<Detail />}
        />
        <Route
          path={`${path.HOMEPAGE}/${path.detail_id}/:code_url/ids-role/:roleId`}
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

        <Route
          path={`${path.HOMEPAGE}/${path.update_profile}`}
          element={<UpdateProfile />}
        />
        <Route path={`${path.HOMEPAGE}/${path.inform}`} element={<Inform />} />
        <Route
          path={`${path.HOMEPAGE}/${path.survey}`}
          element={<SurveyOpinion />}
        />
        <Route
          path={`${path.HOMEPAGE}/${path.contact}`}
          element={<Contact />}
        />
        <Route
          path={`${path.HOMEPAGE}/${path.teacher}`}
          element={<SeeAllTeacher />}
        />
        <Route
          path={`${path.HOMEPAGE}/${path.news}`}
          element={<NewsSeeAll />}
        />
        <Route
          path={`${path.HOMEPAGE}/${path.notify}`}
          element={<NotificationSeeAll />}
        />
        <Route
          path={`${path.HOMEPAGE}/${path.detail_news}/:code_url`}
          element={<NewsDetail />}
        />
        <Route
          path={`${path.HOMEPAGE}/${path.detail_notify}/:code_url`}
          element={<NotificationDetail />}
        />
        <Route
          path={`${path.HOMEPAGE}/${path.health}`}
          element={<HealthSeeAll />}
        />
        <Route
          path={`${path.HOMEPAGE}/${path.processBooking}?`}
          element={<ProcessBooking />}
        />

        {/* system */}
        <Route
          path={`${path.SYSTEM}/${path.LOGIN_SYSTEM}`}
          element={<Login />}
        />

        <Route path={path.SYSTEM} element={<RootSystem />}>
          <Route
            path={path.createScheduleSystem}
            element={<CreateScheduleSystem />}
          />
          <Route
            path={path.scheduleAndQuestionSystem}
            element={<ScheduleAndQuestionSystem />}
          />

          <Route path={path.departmentSystem} element={<RootDepartment />} />

          <Route path={path.facultySystem} element={<RootFaculty />} />

          <Route path={path.teacherSystem} element={<RootTeacher />} />

          <Route
            path={path.healthStudentSystem}
            element={<RootHealthStudentSystem />}
          />

          <Route path={path.dashboardSystem} element={<DashboardSystem />} />
          <Route
            path={path.notificationSystem}
            element={<NotificationSystem />}
          />
          <Route path={path.newsSystem} element={<NewSystem />} />
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
