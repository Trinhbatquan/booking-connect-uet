import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { useTranslation } from "react-i18next";

import avatar from "../../../assets/image/uet.png";

import "./Detail.scss";

import { emitter } from "../../../utils/emitter";
import { getAllCodeApi } from "../../../services/userService";

const BookingModal = ({ close, dataModalSchedule, teacherId, create }) => {
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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mssv, setMssv] = useState(() => {
    if (dataModalSchedule?.currentStudent?.email) {
      return dataModalSchedule?.currentStudent?.email.split("@")[0];
    } else {
      return "";
    }
  });
  // const [address, setAddress] = useState("");
  const [reason, setReason] = useState("");
  // const [gender, setGender] = useState("");
  const [notifyCheckState, setNotifyCheckState] = useState("");

  // const [genderAPI, setGenderAPI] = useState([]);

  const { t, i18n } = useTranslation();

  const handleChangeEvent = (value, type) => {
    const stateArr = [
      // "Email",
      // "FullName",
      "PhoneNumber",
      // "Mssv",
      // "Address",
      "Reason",
      // "Gender",
    ];
    const setStateArr = [
      // setEmail,
      // setFullName,
      setPhoneNumber,
      // setMssv,
      // setAddress,
      setReason,
      // setGender,
    ];
    for (let i = 0; i < stateArr.length; i++) {
      if (type === stateArr[i]) {
        setStateArr[i](value);
        break;
      }
    }
  };

  useEffect(() => {
    // const gender = "Gender";
    // getAllCodeApi.getByType({ type: gender }).then((data) => {
    //   if (data?.codeNumber === 0) {
    //     setGenderAPI(data.allCode);
    //   }
    // });
  }, []);

  //clear data modal with emitter
  //   emitter.on("CLEAR_DATA_MODAL", () => {
  //     setEmail("");
  //     setFullName("");
  //     setPassword("");
  //     setPhoneNumber("");
  //   });

  const handleCheckNullState = () => {
    let result = true;
    const stateArr = [phoneNumber, reason];
    const notification = ["PhoneNumber", "Reason"];
    for (let i = 0; i < stateArr.length; i++) {
      if (!stateArr[i]) {
        setNotifyCheckState(`${notification[i]} is required`);
        result = false;
        break;
      } else {
        setNotifyCheckState("");
      }
    }
    return result;
  };

  const handleCheckValidate = () => {
    let result = true;
    const checkNullState = handleCheckNullState();
    if (checkNullState) {
      const rejexPhoneNumber = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
      // const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      // console.log(regexEmail.test(email));
      if (!rejexPhoneNumber.test(phoneNumber)) {
        setNotifyCheckState("Please enter correct format of phone");
        result = false;
      }
    } else {
      result = false;
    }
    return result;
  };

  const handleCreateBookingSchedule = () => {
    if (handleCheckValidate()) {
      create({
        email,
        managerId: teacherId?.id,
        roleManager: "R5",
        studentId: dataModalSchedule?.currentStudent?.id,
        date: dataModalSchedule.date,
        timeType: dataModalSchedule.timeType,
        phoneNumber,
        reason,
      });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, translateY: -50 }}
        animate={{ opacity: 1, translateY: 0 }}
        exit={{ opacity: 0, translateY: -50 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="modal-schedule-container pb-4 fixed top-8 w-3/4 max-w-[3/4] flex overflow-y-scroll flex-col bg-white rounded-lg shadow backdrop-blur-md mx-auto mt-16"
        style={{ left: "12.25%" }}
      >
        {/* Header BookingModal */}
        <div className="bg-blue-600 px-6 py-2 w-full pt-4 flex items-center">
          <span className="text-white font-semibold">Create a new booking</span>
        </div>
        <div className="detail-teacher">
          <div
            className="detail-teacher-avatar flex-3"
            style={{
              backgroundImage: `url(${avatar})`,
            }}
          ></div>
          <div className="detail-teacher-content flex-1">
            <p className="detail-teacher-content-name">
              {teacherId?.positionData?.valueVn}, {teacherId?.fullName}
            </p>
            <p>
              Ngày hẹn: {dataModalSchedule?.date ? dataModalSchedule.date : ""}
            </p>
            <p>
              Giờ hẹn:{" "}
              {dataModalSchedule?.valueTime ? dataModalSchedule.valueTime : ""}
            </p>
          </div>
        </div>

        <div className="pt-1 pb-4 px-6 flex flex-col w-full">
          <span
            className="mx-auto text-red-500 mb-1"
            style={notifyCheckState ? { opacity: "1" } : { opacity: "0" }}
          >
            {notifyCheckState ? notifyCheckState : "Null"}
          </span>
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
                onFocus={() => setNotifyCheckState("")}
                disabled
              />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <label className="mb-1 text-headingColor flex items-center gap-1">
                FullName
                <HiOutlinePencilAlt />
              </label>
              <input
                className=" rounded-sm w-full focus:ring-0 focus:border focus:border-solid focus:border-gray-500 border border-solid bg-gray-200 outline-none py-1 px-2 text-md"
                name="fullName"
                type="text"
                value={fullName}
                onChange={(e) => handleChangeEvent(e.target.value, "FullName")}
                onFocus={() => setNotifyCheckState("")}
                disabled
              />
            </div>
          </div>

          <div className="w-full flex items-center justify-center gap-6 mt-3">
            <div className="flex-1 flex flex-col justify-center">
              <label className="mb-1 text-headingColor flex items-center gap-1">
                PhoneNumber
                <HiOutlinePencilAlt />
              </label>
              <input
                className=" rounded-sm w-full focus:ring-0 focus:border focus:border-solid focus:border-gray-500 border border-solid border-gray-500 outline-none py-1 px-2 text-md"
                name="phone"
                type="text"
                value={phoneNumber}
                onChange={(e) =>
                  handleChangeEvent(e.target.value, "PhoneNumber")
                }
                onFocus={() => setNotifyCheckState("")}
              />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <label className="mb-1 text-headingColor flex items-center gap-1">
                Mssv <HiOutlinePencilAlt />
              </label>
              <input
                className=" rounded-sm w-full focus:ring-0 focus:border focus:border-solid focus:border-gray-500 border border-solid bg-gray-200 outline-none py-1 px-2 text-md"
                name="mssv"
                type="text"
                value={mssv}
                onChange={(e) => handleChangeEvent(e.target.value, "Mssv")}
                onFocus={() => setNotifyCheckState("")}
                disabled
              />
            </div>
          </div>

          {/* <div className="w-full flex items-center justify-center gap-6 mt-3">
            <div className="flex flex-col justify-center flex-1">
              <label className="mb-1 text-headingColor flex items-center gap-1">
                Address <HiOutlinePencilAlt />
              </label>
              <input
                className=" rounded-sm w-full focus:ring-0 focus:border focus:border-solid focus:border-gray-500 border border-solid border-gray-500 outline-none py-1 px-2 text-md"
                name="address"
                type="text"
                onChange={(e) => setAddress(e.target.value, "Address")}
                onFocus={() => setNotifyCheckState("")}
              />
            </div>
          </div> */}

          <div className="w-full flex items-center justify-center gap-6 mt-3">
            <div className="flex flex-col justify-center flex-1">
              <label className="mb-1 text-headingColor flex items-center gap-1">
                Reason <HiOutlinePencilAlt />
              </label>
              <input
                className=" rounded-sm w-full focus:ring-0 focus:border focus:border-solid focus:border-gray-500 border border-solid border-gray-500 outline-none py-1 px-2 text-md"
                name="reason"
                type="text"
                onChange={(e) => setReason(e.target.value, "Reason")}
                onFocus={() => setNotifyCheckState("")}
              />
            </div>
          </div>

          {/* <div className="w-full flex flex-col item-start justify-center mt-3">
            <label className="mb-1 text-headingColor flex items-center gap-1">
              Gender <HiOutlinePencilAlt />
            </label>
            <select
              className=" shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              name="gender"
              type="text"
              id="gender"
              value={gender}
              onChange={(e) => handleChangeEvent(e.target.value, "Gender")}
              onFocus={() => setNotifyCheckState("")}
            >
              <option name="gender" value="">
                Select---
              </option>
              {genderAPI?.length > 0 &&
                genderAPI?.map((e, i) => {
                  return (
                    <option key={i} name="role" value={e?.keyMap}>
                      {i18n.language === "vi" ? e?.valueVn : e?.valueEn}
                    </option>
                  );
                })}
            </select>
          </div> */}

          <div className="w-full flex item-center justify-start mt-3">
            <span className="text-red-500 font-semibold flex-1 flex items-center gap-1">
              {t("system.table.mess-1")} <HiOutlinePencilAlt />
              {t("system.table.mess-2")}
            </span>
          </div>

          <div>
            <button
              className="bg-blue-600 text-white mt-6 py-2 px-1 font-semibold rounded-md shadow backdrop-blur-md bg-opacity-80 hover:bg-opacity-100 "
              style={{ maxWidth: "15%", width: "15%" }}
              onClick={() => handleCreateBookingSchedule()}
            >
              Add New
            </button>
            <button
              className="bg-green-800 text-white mt-6 py-2 px-1 ml-3 font-semibold rounded-md shadow backdrop-blur-md bg-opacity-80 hover:bg-opacity-100"
              style={{ maxWidth: "10%", width: "10%" }}
              onClick={() => close()}
            >
              Close
            </button>
          </div>
        </div>

        <RiDeleteBack2Fill
          className="absolute top-4 right-4 text-white text-xl cursor-pointer"
          onClick={() => close()}
        />

        {/* <AiOutlineClose
              className="absolute top-1 right-2 text-lg text-gray-300 font-semibold cursor-pointer w-8 h-8 p-2 hover:rounded-full hover:bg-white hover:bg-opacity-30"
              onClick={() => isClose()}
            /> */}
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
