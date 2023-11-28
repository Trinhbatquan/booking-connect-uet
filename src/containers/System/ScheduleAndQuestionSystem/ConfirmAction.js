import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { RiDeleteBack2Fill } from "react-icons/ri";
import moment from "moment";
import { dateFormat } from "../../../utils/constant";
import { useTranslation } from "react-i18next";

const ConfirmAction = ({ data, isClose, confirm }) => {
  const { i18n } = useTranslation();
  const action = data?.actionId;
  const status = data?.statusId;
  const handleConfirmAction = () => {
    if (action === "A2") {
      confirm(data);
    } else {
      if (status === "S1") {
        confirm(data, "process");
      } else {
        confirm(data, "done");
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, translateY: -50 }}
        animate={{ opacity: 1, translateY: 0 }}
        exit={{ opacity: 0, translateY: -50 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="z-50 fixed top-6 w-fit mx-auto flex flex-col h-auto bg-white rounded-lg shadow backdrop-blur-md mt-16 pb-3 overflow-hidden"
      >
        <div className="bg-blue-600 px-3 py-2 w-full">
          <span className="text-white font-semibold">
            {i18n.language === "en"
              ? action === "A2"
                ? "Comfirm Answer Question"
                : status === "S1"
                ? "Confirm Schedule Approval"
                : "Confirm Schedule Completion"
              : action === "A2"
              ? "Xác nhận trả lời câu hỏi"
              : status === "S1"
              ? "Xác nhận chấp nhận lịch hẹn"
              : "Xác nhận hoàn thành lịch hẹn"}
          </span>
        </div>
        <div className="pt-1 pb-4 px-3 flex flex-col justify-center items-center w-full">
          <span>
            {i18n.language === "en"
              ? action === "A2"
                ? `Are you sure to send my answer to student: ${data?.studentData?.fullName}`
                : status === "S1"
                ? `Are you sure to confirm schedule approval to student: ${data?.studentData?.fullName}`
                : `Are you sure to confirm schedule completion to student: ${data?.studentData?.fullName}`
              : action === "A2"
              ? `Bạn có chắc chắn muốn gửi câu trả lời cho sinh viên ${data?.studentData?.fullName}`
              : status === "S1"
              ? `Bạn có chắc chắn việc chấp nhận lịch hẹn của sinh viên ${data?.studentData?.fullName}`
              : `Bạn có chắc chắn việc xác nhận đã hoàn thành lịch hẹn với sinh viên ${data?.studentData?.fullName}`}
          </span>
          <div className="mx-auto flex items-center justify-center gap-10 mt-4">
            <button
              className="outline-none py-1 px-5 w-fit  flex items-center justify-center focus:outline-none border-none bg-red-500 text-white rounded-lg overflow-hidden shadow-sm backdrop-blur-sm"
              onClick={() => handleConfirmAction()}
            >
              {i18n.language === "en" ? "Confirm" : "Xác nhận"}
            </button>
            <button
              className="outline-none py-1  w-fit px-5 flex items-center justify-center focus:outline-none border-none bg-blue-500 text-white rounded-lg overflow-hidden shadow-sm backdrop-blur-sm"
              onClick={() => isClose()}
            >
              {i18n.language === "en" ? "Cancel" : "Huỷ bỏ"}
            </button>
          </div>
        </div>
        <RiDeleteBack2Fill
          className="absolute top-2 right-2 text-white text-xl cursor-pointer"
          onClick={() => isClose()}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmAction;
