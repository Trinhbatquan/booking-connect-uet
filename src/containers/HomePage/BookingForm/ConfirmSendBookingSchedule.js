import React from "react";
import { motion, AnimatePresence } from "framer-motion";

import { RiDeleteBack2Fill } from "react-icons/ri";
import moment from "moment";
import { dateFormat } from "../../../utils/constant";
import { useTranslation } from "react-i18next";

const ConfirmSendBookingSchedule = ({ closeConfirm, create }) => {
  const { i18n } = useTranslation();
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, translateY: -50 }}
        animate={{ opacity: 1, translateY: 0 }}
        exit={{ opacity: 0, translateY: -50 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="modal-confirm-schedule-container fixed top-[25%] w-[30%] flex flex-col h-auto bg-white rounded-lg shadow backdrop-blur-md mx-auto mt-16 pb-3 overflow-hidden"
        style={{ left: "35%" }}
      >
        <div className="bg-blue-600 px-3 py-2 w-full">
          <span className="text-white font-semibold">
            {i18n.language === "en"
              ? "Confirm Making Appointment"
              : "Xác nhận đặt lịch hẹn"}
          </span>
        </div>
        <div className="pt-1 pb-4 px-3 flex flex-col justify-center items-center w-full">
          <span>{`${
            i18n.language === "en"
              ? `Are you sure to confirm make this appointment?`
              : `Bạn có chắc chắn đặt lịch hẹn này không?`
          }`}</span>
          <div className="mx-auto flex items-center justify-center gap-10 mt-4">
            <button
              className="outline-none py-1 px-5 w-fit  flex items-center justify-center focus:outline-none border-none bg-red-500 text-white rounded-lg overflow-hidden shadow-sm backdrop-blur-sm"
              onClick={create}
            >
              {i18n.language === "en" ? "Approve" : "Chấp nhận"}
            </button>
            <button
              className="outline-none py-1  w-fit px-5 flex items-center justify-center focus:outline-none border-none bg-blue-500 text-white rounded-lg overflow-hidden shadow-sm backdrop-blur-sm"
              onClick={() => closeConfirm()}
            >
              {i18n.language === "en" ? "Cancel" : "Huỷ bỏ"}
            </button>
          </div>
        </div>
        <RiDeleteBack2Fill
          className="absolute top-2 right-2 text-white text-xl cursor-pointer"
          onClick={() => closeConfirm()}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmSendBookingSchedule;
