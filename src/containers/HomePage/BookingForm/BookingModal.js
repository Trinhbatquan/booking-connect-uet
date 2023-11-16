import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { TiUserAdd } from "react-icons/ti";
import { MdOutlineEditCalendar } from "react-icons/md";
import { IoTime } from "react-icons/io5";
import avatar from "../../../assets/image/uet.png";
import { ToastContainer, toast } from "react-toastify";
import "../Detail/Detail.scss";

import { emitter } from "../../../utils/emitter";
import { getAllCodeApi } from "../../../services/userService";
import ConfirmSendBookingSchedule from "./ConfirmSendBookingSchedule";
import moment from "moment";

const BookingModal = ({
  close,
  dataModalSchedule,
  userData,
  create,
  roleManager,
}) => {
  console.log(dataModalSchedule);
  const [email, setEmail] = useState(
    dataModalSchedule?.currentStudent?.email
      ? dataModalSchedule.currentStudent.email
      : ""
  );
  const [fullName, setFullName] = useState(
    dataModalSchedule?.currentStudent?.fullName
      ? dataModalSchedule.currentStudent.fullName
      : ""
  );
  const [mssv, setMssv] = useState(() => {
    if (dataModalSchedule?.currentStudent?.email) {
      return dataModalSchedule?.currentStudent?.email.split("@")[0];
    } else {
      return "";
    }
  });
  const [reason, setReason] = useState("");
  const [isConfirmMakeAppoint, setIsConfirmMakeAppoint] = useState(false);
  const { t, i18n } = useTranslation();

  const handleChangeEvent = (value, type) => {
    const stateArr = ["Reason"];
    const setStateArr = [setReason];
    for (let i = 0; i < stateArr.length; i++) {
      if (type === stateArr[i]) {
        setStateArr[i](value);
        break;
      }
    }
  };

  useEffect(() => {}, []);

  // clear data modal with emitter
  // emitter.on("CLEAR_DATA_MODAL", () => {
  //   setEmail("");
  //   setFullName("");
  //   setPassword("");
  //   setPhoneNumber("");
  // });

  emitter.on("clear_data_booking_schedule", () => {
    setReason("");
  });

  const handleCheckNullState = () => {
    let result = true;
    const stateArr = [reason];
    const notification_en = ["Reason"];
    const notification_vi = ["Trường lý do"];
    for (let i = 0; i < stateArr.length; i++) {
      if (!stateArr[i]) {
        toast.error(
          i18n.language === "en"
            ? `${notification_en[i]} ${t("system.notification.required")}`
            : `${notification_vi[i]} ${t("system.notification.required")}`,
          {
            autoClose: 3000,
            theme: "colored",
            position: "bottom-right",
          }
        );
        result = false;
        break;
      }
    }
    return result;
  };

  const handleOpenConfirmBookingSchedule = () => {
    if (handleCheckNullState()) {
      setIsConfirmMakeAppoint(true);
    }
  };
  const handleCreateBookingSchedule = () => {
    if (handleCheckNullState()) {
      create({
        email,
        managerId: userData?.id,
        roleManager,
        studentId: dataModalSchedule?.currentStudent?.id,
        date: dataModalSchedule.date,
        timeType: dataModalSchedule.timeType,
        reason,
      });
    }
  };

  const closeConfirm = () => setIsConfirmMakeAppoint(false);

  return (
    <>
      <ToastContainer />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, translateY: -50 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -50 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="modal-schedule-container pb-4 fixed top-[10%] w-[65%] max-w-[65%] flex overflow-y-scroll flex-col bg-white rounded-lg shadow backdrop-blur-md mx-auto mt-16"
          style={{ left: "17.5%" }}
        >
          {/* Header BookingModal */}
          <div className="bg-blue-600 px-6 py-2 w-full pt-4 flex items-center">
            <span className="text-white font-semibold text-lg">
              {i18n.language === "en"
                ? "Make an new appointment"
                : "Đặt một lịch hẹn mới"}
            </span>
          </div>
          <div className="px-6 pt-3">
            <div className=" flex items-center justify-start gap-8">
              <p className="text-lg font-normal text-blurThemeColor">
                {i18n.language === "en"
                  ? "Appointment Information:"
                  : "Thông tin lịch hẹn:"}
              </p>
              <p className="flex items-center justify-start gap-2">
                <TiUserAdd className="text-blurThemeColor w-9 h-9 p-1.5 rounded-full bg-gray-200" />
                <span className="block text-blurThemeColor">
                  {userData?.positionData?.valueVn
                    ? `${userData?.positionData?.valueVn}, ${userData?.fullName}`
                    : `${userData?.fullName}`}
                </span>
              </p>
              <p className="flex items-center justify-start gap-2">
                <MdOutlineEditCalendar className="text-blurThemeColor w-9 h-9 p-1.5 rounded-full bg-gray-200" />
                <span className="block text-blurThemeColor">
                  {" "}
                  {dataModalSchedule?.date ? dataModalSchedule.date : ""}
                </span>
              </p>
              <p className="flex items-center justify-start gap-2">
                <IoTime className="text-blurThemeColor w-9 h-9 p-1.5 rounded-full bg-gray-200" />
                <span className="block text-blurThemeColor">
                  {" "}
                  {dataModalSchedule?.valueTime
                    ? dataModalSchedule.valueTime
                    : ""}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-3 pb-4 px-6 flex flex-col w-full">
            <div className="w-full flex items-center justify-center gap-6">
              <div className="flex-1 flex flex-col justify-center">
                <label className="mb-1 text-headingColor flex items-center gap-1">
                  Email
                  <HiOutlinePencilAlt />
                </label>
                <input
                  className=" rounded-sm w-full focus:ring-0 focus:border focus:border-solid focus:border-gray-500 border border-solid bg-gray-200 outline-none py-1 px-2 text-md"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleChangeEvent(e.target.value, "Email")}
                  disabled
                />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <label className="mb-1 text-headingColor flex items-center gap-1">
                  {i18n.language === "en" ? "FullName" : "Tên đầy đủ"}
                  <HiOutlinePencilAlt />
                </label>
                <input
                  className=" rounded-sm w-full focus:ring-0 focus:border focus:border-solid focus:border-gray-500 border border-solid bg-gray-200 outline-none py-1 px-2 text-md"
                  name="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) =>
                    handleChangeEvent(e.target.value, "FullName")
                  }
                  disabled
                />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <label className="mb-1 text-headingColor flex items-center gap-1">
                  {i18n.language === "en"
                    ? "Student Number Code"
                    : " Mã số sinh viên"}
                  <HiOutlinePencilAlt />
                </label>
                <input
                  className=" rounded-sm w-full focus:ring-0 focus:border focus:border-solid focus:border-gray-500 border border-solid bg-gray-200 outline-none py-1 px-2 text-md"
                  name="mssv"
                  type="text"
                  value={mssv}
                  onChange={(e) => handleChangeEvent(e.target.value, "Mssv")}
                  disabled
                />
              </div>
            </div>
            <div className="w-full flex items-start justify-center gap-6 mt-3">
              <div className="flex-1 flex-col justify-center">
                <label className="mb-1 text-headingColor flex items-center gap-1">
                  {i18n.language === "en"
                    ? "Appointment Reason"
                    : "Lý do đặt lịch"}
                  <HiOutlinePencilAlt />
                </label>
                <textarea
                  className=" rounded-sm w-full focus:ring-0 focus:border focus:border-solid focus:border-gray-500 border border-solid border-gray-500 outline-none py-1 px-2 text-md"
                  name="reason"
                  type="text"
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value, "Reason")}
                />
              </div>
            </div>

            <div className="w-full flex item-center justify-start mt-3">
              <span className="text-red-500 font-semibold flex-1 flex items-center gap-1">
                {t("system.table.mess-1")} <HiOutlinePencilAlt />
                {t("system.table.mess-2")}
              </span>
            </div>

            <div className="flex items-start justify-between mt-6">
              <div className="flex items-start justify-start gap-6">
                <button
                  className="px-7 py-1 flex transition-all ease-in duration-150 items-center justify-center overflow-hidden text-md font-semibold border border-blue-500 text-white  rounded-md bg-blue-500 hover:text-blue-500 hover:bg-white"
                  onClick={() => handleOpenConfirmBookingSchedule()}
                >
                  {i18n.language === "en" ? "Make appointment" : "Đặt lịch"}
                </button>

                <button
                  className="px-7 py-1 flex transition-all ease-in duration-150 items-center justify-center overflow-hidden text-md font-semibold border border-backColor text-white  rounded-md bg-backColor hover:text-backColor hover:bg-white"
                  onClick={() => setReason("")}
                >
                  {i18n.language === "en" ? "Clear" : "Đặt lại"}
                </button>
              </div>
              <button
                className="px-7 py-1 flex transition-all ease-in duration-150 items-center justify-center overflow-hidden text-md font-semibold border border-red-500 text-white  rounded-md bg-red-500 hover:text-red-500 hover:bg-white"
                onClick={() => close()}
              >
                {i18n.language === "en" ? "Close" : "Đóng"}
              </button>
            </div>
          </div>

          <RiDeleteBack2Fill
            className="absolute top-4 right-4 text-white text-xl cursor-pointer"
            onClick={() => close()}
          />
        </motion.div>
      </AnimatePresence>

      {isConfirmMakeAppoint && (
        <ConfirmSendBookingSchedule
          closeConfirm={closeConfirm}
          create={handleCreateBookingSchedule}
        />
      )}

      {isConfirmMakeAppoint && (
        <div className="modal-confirm-schedule-overplay fixed top-0 bottom-0 left-0 right-0 w-full max-h-full bg-black bg-opacity-30"></div>
      )}
    </>
  );
};

export default BookingModal;
