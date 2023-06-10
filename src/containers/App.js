import { Fragment, useState, useEffect, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { path } from "../utils/constant";

import Login from "./Auth/Login/Login";

import HomePage from "./HomePage/HomePage";
import TeacherDetail from "./HomePage/Detail/TeacherDetail";
import LoginHomePage from "./HomePage/Login/Login";

import {
  RootSystem,
  ScheduleManager,
  DepartmentManager,
  FacultyManager,
  TeacherManager,
  HealthStudentManager,
  StudentManager,
  TeacherDescription,
  DepartmentDescription,
  FacultyDescription,
  HealthStudentDescription,
} from "./System";
import EmailVerify from "./HomePage/EmailVerify/EmailVerify";

function App() {
  return (
    <Fragment>
      {/*  */}

      <Routes>
        {/* homepage */}
        <Route path="/" element={<Navigate to={path.HOMEPAGE} replace />} />

        <Route path={path.HOMEPAGE} element={<HomePage />} />
        <Route
          path={`${path.HOMEPAGE}/${path.detail_teacher_id}/:id`}
          element={<TeacherDetail />}
        />
        <Route
          path={`${path.HOMEPAGE}/${path.login_homepage}`}
          element={<LoginHomePage />}
        />
        <Route path="/users/:id/verify/:token" element={<EmailVerify />} />

        {/* system */}
        <Route
          path={`${path.SYSTEM}/${path.LOGIN_SYSTEM}`}
          element={<Login />}
        />

        <Route path={path.SYSTEM} element={<RootSystem />}>
          <Route path={path.scheduleManager} element={<ScheduleManager />} />

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

          <Route path={path.student} element={<StudentManager />} />
        </Route>
      </Routes>
    </Fragment>
  );
}

export default function WrappedApp() {
  return (
    <Suspense fallback="...is loading">
      <App />
    </Suspense>
  );
}
