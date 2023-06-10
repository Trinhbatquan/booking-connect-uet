import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {RiDeleteBack2Fill} from 'react-icons/ri'


import { emitter } from "../../../utils/emitter";

const CreateModal = ({ isOpen, isClose, createNewUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notifyCheckState, setNotifyCheckState] = useState("");

  const emailInputRef = useRef();

  const handleChangeEvent = (value, type) => {
    const stateArr = ["Email", "Password", "FullName", "PhoneNumber"];
    const setStateArr = [setEmail, setPassword, setFullName, setPhoneNumber];
    for (let i = 0; i < stateArr.length; i++) {
      if (type === stateArr[i]) {
        setStateArr[i](value);
        break;
      }
    }
  };

  //clear data modal with emitter
  emitter.on("CLEAR_DATA_MODAL", () => {
    setEmail("");
    setFullName("");
    setPassword("");
    setPhoneNumber("");
  });

  const handleCheckNullState = () => {
    let result = true;
    const stateArr = [email, password, fullName, phoneNumber];
    const notification = ["Email", "Password", "FullName", "PhoneNumber"];
    for (let i = 0; i < stateArr.length; i++) {
      console.log(stateArr[i]);
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
    console.log(checkNullState);
    if (checkNullState) {
      const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      console.log(regexEmail.test(email));
      if (!regexEmail.test(email)) {
        setNotifyCheckState("Please enter correct format of email");
        result = false;
      }
    } else {
      result = false;
    }
    return result;
  };

  const handleCreateNewUser = () => {
    if (handleCheckValidate()) {
      createNewUser({
        email,
        password,
        fullName,
        phoneNumber,
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
        className=" z-50 fixed top-0 left-1/4 w-1/2 max-w-[1/2] flex overflow-hidden flex-col h-auto bg-white rounded-lg shadow backdrop-blur-md mx-auto mt-16"
      >
        {/* Header CreateModal */}
        <div className="bg-blue-600 px-3 py-2 w-full">
          <span className="text-white font-semibold">Create a new user</span>
        </div>

        <div className="pt-1 pb-4 px-3 flex flex-col justify-center-center w-full">
          <span
            className="mx-auto text-red-500 mb-1"
            style={notifyCheckState ? { opacity: "1" } : { opacity: "0" }}
          >
            {notifyCheckState ? notifyCheckState : "Null"}
          </span>
          <div className="w-full flex items-center justify-center gap-6">
            <div className="flex-1 flex flex-col justify-center">
              <label className="mb-1 text-headingColor">Email (*)</label>
              <input
                className=" rounded-sm w-full focus:ring-0 focus:border focus:border-solid focus:border-gray-500 border border-solid border-gray-500 outline-none py-1 px-2 text-md"
                name="email"
                type="email"
                value={email}
                onChange={(e) => handleChangeEvent(e.target.value, "Email")}
                onFocus={() => setNotifyCheckState("")}
                ref={emailInputRef}
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <label className="mb-1 text-headingColor">Password (*)</label>
              <input
                className=" rounded-sm w-full focus:ring-0 focus:border focus:border-solid focus:border-gray-500 border border-solid border-gray-500 outline-none py-1 px-2 text-md"
                name="password"
                type="password"
                value={password}
                onChange={(e) => handleChangeEvent(e.target.value, "Password")}
                onFocus={() => setNotifyCheckState("")}
              />
            </div>
          </div>

          <div className="w-full flex items-center justify-center gap-6 mt-3">
            <div className="flex-1 flex flex-col justify-center">
              <label className="mb-1 text-headingColor">FullName (*)</label>
              <input
                className=" rounded-sm w-full focus:ring-0 focus:border focus:border-solid focus:border-gray-500 border border-solid border-gray-500 outline-none py-1 px-2 text-md"
                name="name"
                type="text"
                value={fullName}
                onChange={(e) => handleChangeEvent(e.target.value, "FullName")}
                onFocus={() => setNotifyCheckState("")}
              />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <label className="mb-1 text-headingColor">PhoneNumber (*)</label>
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
          </div>

          <div className="w-full flex items-center justify-center gap-6 mt-3">
            <div className="flex-1 flex flex-col justify-center">
              <label className="mb-1 text-headingColor">Role (*)</label>
              <select
                className=" rounded-sm w-full focus:ring-0 focus:border focus:border-solid focus:border-gray-500 border border-solid border-gray-500 outline-none py-1 px-2 text-md"
                name="role"
                type="text"
              >
                <option name="role" value="0">
                  Select---
                </option>
                <option name="role" value="1">
                  Department
                </option>
                <option name="role" value="2">
                  Student
                </option>
              </select>
            </div>
            <div className="flex-1 flex-col justify-center flex">
              <label className="mb-1 text-headingColor" htmlFor="file_input">
                Avatar
              </label>
              <input
                className="text-md text-gray-900 border border-solid border-spacing-0 border-gray-500 rounded-sm cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none"
                id="file_input"
                type="file"
              />
            </div>
          </div>

          <div className="w-full flex items-center justify-center gap-6 mt-3">
            <div className="flex flex-col justify-center flex-1">
              <label className="mb-1 text-headingColor">Address (*)</label>
              <input
                className=" rounded-sm w-full focus:ring-0 focus:border focus:border-solid focus:border-gray-500 border border-solid border-gray-500 outline-none py-1 px-2 text-md"
                name="address"
                type="text"
              />
            </div>
          </div>

          <div className="w-full flex flex-col item-start justify-center mt-3">
            <label className="mb-1 text-headingColor">Gender</label>
            <div className="w-full flex items-center justify-start">
              <div className="flex items-center justify-start gap-2">
                <label>Male</label>
                <input
                  className="outline-none focus:ring-0 focus:border-transparent text-xs"
                  value="0"
                  name="gender"
                  type="radio"
                />
              </div>
              <div className="flex items-center justify-start gap-2 ml-4">
                <label>Female</label>
                <input
                  className="outline-none focus:ring-0 focus:border-transparent text-xs"
                  value="1"
                  name="gender"
                  type="radio"
                />
              </div>
            </div>
          </div>

          <div className="w-full flex item-center justify-start mt-3">
            <span className="text-red-500 font-semibold">
              All Field have (*) is required
            </span>
          </div>

          <div>
            <button
              className="bg-blue-600 text-white mt-6 py-2 px-1 font-semibold rounded-md shadow backdrop-blur-md bg-opacity-80 hover:bg-opacity-100 "
              style={{ maxWidth: "15%", width: "15%" }}
              onClick={() => handleCreateNewUser()}
            >
              Add New
            </button>
            <button
              className="bg-green-800 text-white mt-6 py-2 px-1 ml-3 font-semibold rounded-md shadow backdrop-blur-md bg-opacity-80 hover:bg-opacity-100"
              style={{ maxWidth: "10%", width: "10%" }}
              onClick={() => isClose()}
            >
              Close
            </button>
          </div>
        </div>

        <RiDeleteBack2Fill className="absolute top-2 right-2 text-white text-xl cursor-pointer"
            onClick={() => isClose()}
        />

        {/* <AiOutlineClose
              className="absolute top-1 right-2 text-lg text-gray-300 font-semibold cursor-pointer w-8 h-8 p-2 hover:rounded-full hover:bg-white hover:bg-opacity-30"
              onClick={() => isClose()}
            /> */}
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateModal;
