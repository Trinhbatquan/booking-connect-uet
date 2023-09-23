import React, { Fragment, useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import Cart from "./Cart";

import {
  BsPerson,
  BsBorderAll,
  BsBook,
  BsHeart,
  BsFillCalendarMonthFill,
  BsCalendarDay,
  BsPieChart,
} from "react-icons/bs";

import { RxComponentNone } from "react-icons/rx";

import { RiSurveyLine } from "react-icons/ri";
import { MdSchedule } from "react-icons/md";
import { GrNewWindow } from "react-icons/gr";
import { VscRunAll } from "react-icons/vsc";
import { TbClockCancel } from "react-icons/tb";
import { MdQuestionMark } from "react-icons/md";

import { BsBarChart } from "react-icons/bs";
import { BiHomeAlt2, BiCalendarWeek } from "react-icons/bi";
import { FaCube } from "react-icons/fa";
import {
  AiOutlineFieldTime,
  AiOutlineFileDone,
  AiOutlineBarChart,
} from "react-icons/ai";
import Loading from "./../../../utils/Loading";

import {
  getDashboardByMonths,
  getDashboardByUserAndTime,
} from "../../../services/dshboardService";
import Chart from "./Chart";
import Pie from "./Pie";

const DashboardSystem = () => {
  const [dbUser, setDbUser] = useState("total");
  const [dbTime, setDbTime] = useState("month");
  const [loading, setLoading] = useState(true);

  let userSelected;
  if (dbUser === "total") {
    userSelected = "Tất cả";
  } else if (dbUser === "R2") {
    userSelected = "Phòng ban";
  } else if (dbUser === "R4") {
    userSelected = "Khoa & Viện";
  } else if (dbUser === "R5") {
    userSelected = "Giảng viên";
  } else if (dbUser === "R6") {
    userSelected = "Ban sức khoẻ sinh viên";
  }

  let timeSelected;
  if (dbTime === "month") {
    timeSelected = "Tháng hiện tại";
  } else if (dbTime === "week") {
    timeSelected = "Tuần hiện tại";
  } else if (dbTime === "3week") {
    timeSelected = "3 tuần gần đây";
  } else if (dbTime === "3month") {
    timeSelected = "3 tháng gần đây";
  }

  const [dataDashboardByUserAndTime, setDataDashboardByUserAndTime] =
    useState();

  const [dataDashboardByMonths, setDataDashBoardByMonth] = useState();

  //customData
  let customDataQuestion, customDataSchedule;
  if (dataDashboardByUserAndTime) {
    customDataQuestion = dataDashboardByUserAndTime.customDataQuestion;
    customDataSchedule = dataDashboardByUserAndTime.customDataSchedule;
  }

  let customScheduleMonths, customQuestionMonths;
  if (dataDashboardByMonths) {
    customScheduleMonths = dataDashboardByMonths.customScheduleMonths;
    customQuestionMonths = dataDashboardByMonths.customQuestionMonths;
  }

  // setup api
  useEffect(() => {
    setLoading(true);
    //call api
    setTimeout(() => {
      getDashboardByUserAndTime
        .get({
          roleManager: dbUser === "total" ? "" : dbUser,
          time: dbTime,
        })
        .then((res) => {
          if (res?.codeNumber === 0) {
            setDataDashboardByUserAndTime(res?.dashboard);
            getDashboardByMonths
              .get({ roleManager: dbUser === "total" ? "" : dbUser })
              .then((data) => {
                if (data?.codeNumber === 0) {
                  setDataDashBoardByMonth(data?.dashboardMonths);
                  setLoading(false);
                }
              });
          }
        });
    }, 1500);
  }, [dbUser, dbTime]);

  //import system

  return (
    <div
      style={{
        // backgroundColor: "rgb(240, 242, 245)",
        backgroundColor: "#fff",
        height: "100%",
        padding: "40px 0 30px 0",
      }}
    >
      <ToastContainer />

      <div className="w-full h-[60px]"></div>

      <div
        className="overflow-y-auto pb-6 flex flex-col z-50 fixed top-0 outline-0 mx-2 mb-1 mt-[80px] translate-x-0"
        style={{
          height: "calc(-8rem + 100vh)",
          borderRadius: "0.75rem",
          background: "rgb(72, 72, 237)",
          boxShadow: "rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem",
          width: "220px",
        }}
      >
        <div
          className="text-center bg-transparent"
          style={{ padding: "24px 32px 8px" }}
        >
          <div className="flex items-center bg-transparent justify-start gap-1">
            <BsPerson className="text-3xl text-white" />
            <span className="font-semibold text-white text-lg ">Đối tượng</span>
          </div>
          <hr
            style={{
              borderWidth: "0 0 medium",
              borderStyle: "solid solid none",
              height: "0.063rem",
              margin: "1rem 0",
              opacity: 0.55,
              backgroundImage:
                "linear-gradient(to right, rgba(255, 255, 255, 0), rgb(255, 255, 255), rgba(255, 255, 255, 0))",
            }}
          />
        </div>

        <ul className="list-none">
          <div className="my-1 mx-6">
            <div
              className="flex items-center justify-start gap-3 hover:opacity-100"
              style={
                dbUser === "total"
                  ? {
                      cursor: "pointer",
                      color: "#fff",
                      padding: "0.75rem 1rem",
                      opacity: 1,
                    }
                  : {
                      cursor: "pointer",
                      color: "#fff",
                      padding: "0.75rem 1rem",
                      opacity: 0.5,
                    }
              }
              onClick={() => setDbUser("total")}
            >
              <BsBorderAll className="text-white text-2xl" />
              <span className="text-md  text-white">Tất cả</span>
            </div>
          </div>

          <div className="my-1 mx-6">
            <div
              className="flex items-center justify-start gap-3 hover:opacity-100"
              style={
                dbUser === "R2"
                  ? {
                      cursor: "pointer",
                      color: "#fff",
                      padding: "0.75rem 1rem",
                      opacity: 1,
                    }
                  : {
                      cursor: "pointer",
                      color: "#fff",
                      padding: "0.75rem 1rem",
                      opacity: 0.5,
                    }
              }
              onClick={() => setDbUser("R2")}
            >
              <BiHomeAlt2 className="text-white text-2xl" />
              <span className="text-md  text-white">Phòng ban</span>
            </div>
          </div>

          <div className="my-1 mx-6">
            <div
              className="flex items-center justify-start gap-3 hover:opacity-100"
              style={
                dbUser === "R4"
                  ? {
                      cursor: "pointer",
                      color: "#fff",
                      padding: "0.75rem 1rem",
                      opacity: 1,
                    }
                  : {
                      cursor: "pointer",
                      color: "#fff",
                      padding: "0.75rem 1rem",
                      opacity: 0.5,
                    }
              }
              onClick={() => setDbUser("R4")}
            >
              <FaCube className="text-white text-2xl" />
              <span className="text-md  text-white">Khoa viện</span>
            </div>
          </div>

          <div className="my-1 mx-6">
            <div
              className="flex items-center justify-start gap-3 hover:opacity-100"
              style={
                dbUser === "R5"
                  ? {
                      cursor: "pointer",
                      color: "#fff",
                      padding: "0.75rem 1rem",
                      opacity: 1,
                    }
                  : {
                      cursor: "pointer",
                      color: "#fff",
                      padding: "0.75rem 1rem",
                      opacity: 0.5,
                    }
              }
              onClick={() => setDbUser("R5")}
            >
              <BsBook className="text-white text-2xl" />
              <span className="text-md  text-white">Giảng viên</span>
            </div>
          </div>

          <div className="my-1 mx-6">
            <div
              className="flex items-center justify-start gap-3 hover:opacity-100"
              style={
                dbUser === "R6"
                  ? {
                      cursor: "pointer",
                      color: "#fff",
                      padding: "0.75rem 1rem",
                      opacity: 1,
                    }
                  : {
                      cursor: "pointer",
                      color: "#fff",
                      padding: "0.75rem 1rem",
                      opacity: 0.5,
                    }
              }
              onClick={() => setDbUser("R6")}
            >
              <BsHeart className="text-white text-2xl" />
              <span className="text-md  text-white">Quản lý sức khoẻ</span>
            </div>
          </div>
        </ul>

        <div
          className="text-center bg-transparent"
          style={{ padding: "24px 32px 8px" }}
        >
          <div className="flex items-center bg-transparent justify-start gap-1">
            <AiOutlineFieldTime className="text-3xl text-white" />
            <span className="font-semibold text-white text-lg">
              Thống kê theo
            </span>
          </div>
          <hr
            style={{
              borderWidth: "0 0 medium",
              borderStyle: "solid solid none",
              height: "0.063rem",
              margin: "1rem 0",
              opacity: 0.55,
              backgroundImage:
                "linear-gradient(to right, rgba(255, 255, 255, 0), rgb(255, 255, 255), rgba(255, 255, 255, 0))",
            }}
          />
        </div>
        <ul className="list-none">
          <div className="my-1 mx-6">
            <div
              className="flex items-center justify-start gap-3"
              style={{
                cursor: "pointer",
                color: "#fff",
                padding: "0.75rem 1rem",
                opacity: `${dbTime === "month" ? 1 : 0.5}`,
              }}
              onClick={() => setDbTime("month")}
            >
              <BsFillCalendarMonthFill className="text-white text-2xl" />
              <span className="text-md text-white">Tháng hiện tại</span>
            </div>
          </div>

          <div className="my-1 mx-6">
            <div
              className="flex items-center justify-start gap-3"
              style={{
                cursor: "pointer",
                color: "#fff",
                padding: "0.75rem 1rem",
                opacity: `${dbTime === "week" ? 1 : 0.5}`,
              }}
              onClick={() => setDbTime("week")}
            >
              <BiCalendarWeek className="text-white text-2xl" />
              <span className="text-md text-white">Tuần hiện tại</span>
            </div>
          </div>

          <div className="my-1 mx-6">
            <div
              className="flex items-center justify-start gap-3"
              style={{
                cursor: "pointer",
                color: "#fff",
                padding: "0.75rem 1rem",
                opacity: `${dbTime === "3month" ? 1 : 0.5}`,
              }}
              onClick={() => setDbTime("3month")}
            >
              <BsCalendarDay className="text-white text-2xl" />
              <span className="text-md text-white">3 tháng gần đây</span>
            </div>
          </div>

          <div className="my-1 mx-6">
            <div
              className="flex items-center justify-start gap-3"
              style={{
                cursor: "pointer",
                color: "#fff",
                padding: "0.75rem 1rem",
                opacity: `${dbTime === "3week" ? 1 : 0.5}`,
              }}
              onClick={() => setDbTime("3week")}
            >
              <BsCalendarDay className="text-white text-2xl" />
              <span className="text-md text-white">3 tuần gần đây</span>
            </div>
          </div>
        </ul>
      </div>

      <div
        className="flex flex-col justify-start items-start gap-1"
        style={{
          marginLeft: "20.125rem",
          marginRight: "2rem",
          height: "100%",
        }}
      >
        <div className="w-full text-blurThemeColor flex flex-col items-center justify-center">
          <p className="text-xl font-semibold uppercase">
            Trang thống kê lịch hẹn và câu hỏi của sinh viên
          </p>
          {/* <p className="text-lg">
            {` Đối tượng: ${userSelected} ---- Thời gian: ${timeSelected}`}
          </p> */}
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className="flex flex-col items-start justify-center gap-1 w-full">
            <div className="p-[24px] flex flex-col items-start w-full gap-2">
              <div className="flex items-center w-full justify-start gap-2">
                <RxComponentNone className="text-blurThemeColor text-2xl" />
                <p className="font-semibold text-lg text-blurThemeColor">
                  Theo các thành phần
                </p>
              </div>
              <div className="cart w-full grid grid-cols-4 gap-3">
                <Cart
                  title="Lịch hẹn"
                  number={customDataSchedule.new?.length}
                  Symbol=<RiSurveyLine className="text-2xl" />
                  styleSymbol={{
                    background:
                      "linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25))",
                    color: "#fff",
                    boxShadow:
                      "rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(64, 64, 64, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem",
                    borderRadius: "2.375rem",
                  }}
                  time="Mới Từ Sinh Viên"
                />
                <Cart
                  title="Lịch hẹn"
                  number={customDataSchedule.process?.length}
                  Symbol=<VscRunAll className="text-2xl" />
                  styleSymbol={{
                    background:
                      "linear-gradient(195deg, rgb(73, 163, 241), rgb(26, 115, 232))",
                    color: "#fff",
                    boxShadow:
                      "rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(0, 187, 212, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem",
                    borderRadius: "2.375rem",
                  }}
                  time="Đang tiến hành"
                />
                <Cart
                  title="Lịch hẹn"
                  number={customDataSchedule.done?.length}
                  Symbol=<AiOutlineFileDone className="text-2xl" />
                  styleSymbol={{
                    background:
                      "linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))",
                    color: "#fff",
                    boxShadow:
                      "rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(76, 175, 79, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem",
                    borderRadius: "2.375rem",
                  }}
                  time="Đã hoàn thành"
                />
                <Cart
                  title="Lịch hẹn"
                  number={customDataSchedule.cancel?.length}
                  Symbol=<TbClockCancel className="text-2xl" />
                  styleSymbol={{
                    background:
                      "linear-gradient(195deg, rgb(236, 64, 122), rgb(216, 27, 96))",
                    color: "#fff",
                    boxShadow:
                      "rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(233, 30, 98, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem",
                    borderRadius: "2.375rem",
                  }}
                  time="Đã bị huỷ"
                />
                <Cart
                  title="Câu hỏi"
                  number={customDataQuestion.new?.length}
                  Symbol=<MdQuestionMark className="text-2xl" />
                  styleSymbol={{
                    background:
                      "linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25))",
                    color: "#fff",
                    boxShadow:
                      "rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(64, 64, 64, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem",
                    borderRadius: "2.375rem",
                  }}
                  time="Mới từ sinh viên"
                />
                <Cart
                  title="Câu hỏi"
                  number={customDataQuestion.done?.length}
                  Symbol=<MdSchedule className="text-2xl" />
                  styleSymbol={{
                    background:
                      "linear-gradient(195deg, rgb(73, 163, 241), rgb(26, 115, 232))",
                    color: "#fff",
                    boxShadow:
                      "rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(0, 187, 212, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem",
                    borderRadius: "2.375rem",
                  }}
                  time="Đã được trả lời"
                />
              </div>
            </div>
            <div
              className="p-[24px] flex flex-col items-start w-full gap-2"
              // style={{
              //   boxShadow:
              //     "rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem",
              // }}
            >
              <div className="flex items-center w-full justify-start gap-2">
                <BsPieChart className="text-blurThemeColor text-2xl" />
                <p className="font-semibold text-lg text-blurThemeColor">
                  Theo cơ cấu
                </p>
              </div>
              <div className="cart w-full grid grid-cols-2 gap-10">
                <div
                  className="flex items-center justify-center py-3"
                  style={{
                    border: "1px solid rgb(207, 201, 219)",
                  }}
                >
                  <Pie data={customDataSchedule} type="schedule" />
                </div>
                <div
                  className="flex items-center justify-center py-3"
                  style={{
                    border: "1px solid rgb(207, 201, 219)",
                  }}
                >
                  <Pie data={customDataQuestion} type="question" />
                </div>
              </div>
            </div>

            <div
              className="p-[24px] flex flex-col items-start w-full gap-2"
              style={
                {
                  // border: "1px solid blue",
                  // borderRadius: "10px",
                  // boxShadow:
                  //   "rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem",
                }
              }
            >
              <div className="flex items-center w-full justify-start gap-2">
                <AiOutlineBarChart className="text-blurThemeColor text-2xl" />
                <p className="font-semibold text-lg text-blurThemeColor">
                  Tổng số theo các tháng
                </p>
              </div>
              <div className="chart w-full grid grid-cols-2 gap-10">
                <div>
                  <Chart data={customScheduleMonths} type="schedule" />
                </div>
                <div>
                  <Chart data={customQuestionMonths} type="question" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardSystem;
