import React, { useState, useEffect, Fragment } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import moment from "moment";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import Button from "../../../utils/Button";
import {
  getAllCodeApi,
  getUserApi,
  logOutApi,
} from "../../../services/userService";
import { dateFormat, path } from "../../../utils/constant";
import {
  createSchedule,
  deleteScheduleByIdAndDate,
  getScheduleSystem,
} from "../../../services/scheduleService";

import { useTranslation } from "react-i18next";
import "moment/locale/vi";
import DeleteModal from "../Modal/DeleteModal";
import { logOutUser } from "../../../redux/authSlice";
import { getTeacherHomePageAPI } from "../../../services/teacherService";
import ActionItem from "./ActionItem";
import Loading from "../../../utils/Loading";

const ScheduleManager = () => {
  const [selectedOptionObject, setSelectedOptionObject] = useState({});
  const [selectedOption, setSelectedOption] = useState({});
  const [startDate, setStartDate] = useState(
    new Date().setDate(new Date().getDate() + 1)
  );

  const [userData, setUserData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [timeUserSelected, setTimeUserSelected] = useState([]);
  const [optionSelected, setOptionSelected] = useState();

  const [isUpdate, setIsUpdate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [dataScheduleDelete, setDataScheduleDelete] = useState([]);
  const [loading, setLoading] = useState(false);

  const [action, setAction] = useState("");

  const { t, i18n } = useTranslation();

  console.log(action);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // async function fetchData() {
    //   await getAllCodeApi.getByType({ type: "TIME" }).then((data) => {
    //     if (data?.codeNumber === 0) {
    //       let { allCode } = data;
    //       if (allCode.length > 0) {
    //         allCode = allCode.map((time, index) => ({
    //           ...time,
    //           isSelected: false,
    //         }));
    //       }
    //       setTimeData(allCode);
    //     }
    //   });
    // }
    // fetchData();
  }, []);

  //option-general select
  let option_general = [
    {
      value: "R2",
      label: `${t("system.schedule.department")}`,
    },
    { value: "R4", label: `${t("system.schedule.faculty")}` },
    { value: "R5", label: `${t("system.schedule.teacher")}` },
    { value: "R6", label: `${t("system.schedule.health")}` },
  ];

  //option-detail select
  let options_detail = [];
  if (userData.length > 0) {
    userData.forEach((user, index) => {
      options_detail.push({ value: user?.id, label: user?.fullName });
    });
  }

  //handle change select
  const handleChangeSelect_general = async (e) => {
    setLoading(true);
    if (e?.value === "R5") {
      await getTeacherHomePageAPI.getTeacher({}).then((data) => {
        if (data?.codeNumber === 0) {
          setUserData(data.teacher);
        }
      });
    } else {
      await getUserApi.getUserByRole({ role: e?.value }).then((data) => {
        if (data?.codeNumber === 0) {
          setUserData(data?.user);
        }
      });
    }
    option_general.forEach((item, index) => {
      if (item?.value === e?.value) {
        setOptionSelected(index);
      }
    });
    setSelectedOption({});
    // setTimeUserSelected([]);
    // setStartDate(new Date().setDate(new Date().getDate() + 1));
    // timeData.forEach((time) => {
    //   time.isSelected = false;
    // });
    // setTimeData(timeData);
    setSelectedOptionObject(e);
    setAction("");
    // setIsUpdate(false);
    setLoading(false);
  };

  const handleChangeSelect_detail = async (e) => {
    console.log(selectedOptionObject);

    setSelectedOption(e);
  };

  return (
    <Fragment>
      <div className="w-full" style={{ height: "100px" }}></div>
      {loading && (
        <div className="fixed loading-overlay top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25">
          <div className="absolute">
            <Loading />
          </div>
        </div>
      )}
      <ToastContainer />
      <div
        className="mt-3 flex flex-col items-start mx-auto pb-5 gap-8"
        style={{ maxWidth: "80%", width: "80%" }}
      >
        <p className="mx-auto text-2xl text-blue-600 font-semibold">
          {i18n.language === "en"
            ? "Schedule & Question Management"
            : "Quản lý lịch hẹn và câu hỏi"}
        </p>

        <div className="flex items-start justify-between w-full gap-10">
          <div className="flex-1 flex flex-col justify-center gap-1">
            <label className="text-lg text-opacity-60 text-black">
              {t("system.schedule.choose")}
            </label>
            <Select
              value={selectedOptionObject}
              onChange={(e) => handleChangeSelect_general(e)}
              options={option_general}
              className="w-full"
            />
          </div>
          {selectedOptionObject?.value && (
            <>
              <div className="w-[50%] flex items-start justify-center gap-5">
                <div className="flex-1 flex flex-col justify-center gap-1">
                  <label className="text-lg text-opacity-60 text-black">
                    {`${t("system.schedule.mess")} ${
                      option_general[optionSelected]?.label
                    }`}
                  </label>
                  <Select
                    value={selectedOption}
                    onChange={(e) => handleChangeSelect_detail(e)}
                    options={options_detail}
                    className="w-full"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {selectedOption?.value && (
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
        )}
        {action && (
          <ActionItem
            action={action}
            roleManager={selectedOptionObject?.value}
            managerId={selectedOption?.value}
          />
        )}
      </div>
    </Fragment>
  );
};

export default ScheduleManager;
