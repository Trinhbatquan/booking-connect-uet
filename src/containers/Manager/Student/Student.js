import React, { useState, useEffect, Fragment } from "react";

import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";

import { useTranslation } from "react-i18next";
import "moment/locale/vi";

import ActionItem from "../../System/ScheduleAndQuestionSystem/ActionItem";
import Header from "../../System/Header/Header";

const ScheduleManager = () => {
  const { t, i18n } = useTranslation();

  const location = useLocation();
  const reviewFromNotify = location?.search.split("?")[1];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.authReducer);
  const [action, setAction] = useState(
    reviewFromNotify
      ? reviewFromNotify === "new_ques"
        ? "question"
        : "schedule"
      : ""
  );

  useEffect(() => {}, []);

  return (
    <Fragment>
      <ToastContainer />
      <div className="w-full" style={{ height: "110px" }}></div>
      <div
        className="mt-3 flex flex-col items-start mx-auto pb-5 gap-8"
        style={{ maxWidth: "80%", width: "80%" }}
      >
        <p className="mx-auto text-2xl text-blue-600 font-semibold">
          {i18n.language === "en"
            ? "Schedule & Question Management"
            : "Quản lý lịch hẹn và câu hỏi"}
        </p>

        <div className="flex items-center justify-between gap-10 w-full">
          <button
            type="button"
            class={` hover:bg-blue-800 transition-all duration-500 flex-1 hover:text-white rounded-lg focus:ring-4 focus:ring-blue-300 font-medium  text-md px-5 py-2.5  mb-2 focus:outline-none
                ${
                  action === "schedule"
                    ? "text-white bg-blue-800"
                    : "text-gray-400 bg-white border border-gray-600"
                }`}
            onClick={() => setAction("schedule")}
          >
            {i18n.language === "en"
              ? "About Schedule From Student"
              : "Về lịch hẹn từ sinh viên"}
          </button>
          <button
            type="button"
            class={`w-[50%] hover:bg-blue-800 transition-all duration-500  hover:text-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5  mb-2 focus:outline-none
                ${
                  action === "question"
                    ? "text-white bg-blue-800"
                    : "text-gray-400 bg-white border border-gray-600"
                }`}
            onClick={() => setAction("question")}
          >
            {i18n.language === "en"
              ? "About Question From Student"
              : "Về câu hỏi từ sinh viên"}
          </button>
        </div>

        {action && (
          <ActionItem
            reviewNotify={reviewFromNotify}
            action={action}
            roleManager={currentUser?.role}
            managerId={currentUser?.id}
          />
        )}
      </div>
    </Fragment>
  );
};

export default ScheduleManager;
