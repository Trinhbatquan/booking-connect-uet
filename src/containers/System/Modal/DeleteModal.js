import React from "react";
import { motion, AnimatePresence } from "framer-motion";

import { RiDeleteBack2Fill } from "react-icons/ri";
import moment from "moment";
import { dateFormat } from "../../../utils/constant";
import { useTranslation } from "react-i18next";

const DeleteModal = ({ dataUserDelete, isClose, deleteUser, type }) => {
  let dataName = "";
  if (type === "user" && Array.isArray(dataUserDelete)) {
    dataUserDelete.forEach((item, index) => {
      if (index === dataUserDelete?.length - 1) {
        dataName += `${item?.fullName}`;
      } else {
        dataName += `${item?.fullName}, `;
      }
    });
  } else if (type === "user" && !Array.isArray(dataUserDelete)) {
    dataName = dataUserDelete?.fullName;
  } else {
    if (dataUserDelete[0]?.date) {
      dataName = `${moment(dataUserDelete[0]?.date).format(
        dateFormat.LABEL_SCHEDULE
      )}`;
    } else {
      dataUserDelete.forEach((item, index) => {
        if (index === dataUserDelete?.length - 1) {
          dataName += `${moment(item[0]?.date).format(
            dateFormat.LABEL_SCHEDULE
          )}`;
        } else {
          dataName += `${moment(item[0]?.date).format(
            dateFormat.LABEL_SCHEDULE
          )}, `;
        }
      });
    }
  }

  const { i18n } = useTranslation();
  const handleDeleteUser = (action) => {
    if (action === "cancel") {
      isClose();
    } else if (action === "delete") {
      if (type === "user") {
        if (dataUserDelete?.length > 0) {
          let idManyData = [];
          dataUserDelete.forEach((item) => {
            idManyData.push(item.id);
          });
          deleteUser(idManyData);
        } else {
          deleteUser(dataUserDelete?.id);
        }
      } else if (type === "schedule") {
        if (dataUserDelete[0]?.date) {
          deleteUser(
            dataUserDelete[0]?.managerId,
            moment(dataUserDelete[0]?.date).format(dateFormat.SEND_TO_SERVER),
            dataUserDelete[0]?.roleManager
          );
        } else {
          let dateData = [];
          dataUserDelete.forEach((item) => {
            dateData.push(
              moment(item[0]?.date).format(dateFormat.SEND_TO_SERVER)
            );
          });
          deleteUser(
            dataUserDelete[0][0]?.managerId,
            dateData,
            dataUserDelete[0][0]?.roleManager
          );
        }
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
        className="z-50 fixed top-10 w-[60%] flex flex-col h-auto bg-white rounded-lg shadow backdrop-blur-md mx-auto mt-16 pb-3 overflow-hidden"
        style={{ left: "20%" }}
      >
        <div className="bg-blue-600 px-3 py-2 w-full">
          <span className="text-white font-semibold">
            {i18n.language === "en" ? "Delete user" : "Xoá bỏ người dùng"}
          </span>
        </div>
        <div className="pt-1 pb-4 px-3 flex flex-col justify-center items-center w-full">
          <span>{`${
            type === "user"
              ? i18n.language === "en"
                ? `Are you sure to delete? Users that you want to delete: (${dataName}).`
                : `Bạn có chắc chắn về hành động xoá này không? Người dùng bạn muốn xoá: (${dataName}).`
              : i18n.language === "en"
              ? `Are you sure to delete? Schedules that you want to delete: (${dataName}).`
              : `Bạn có chắc chắn về hành động xoá này không? Lịch mà bạn muốn xoá: (${dataName}).`
          }`}</span>
          <div className="mx-auto flex items-center justify-center gap-10 mt-4">
            <button
              className="outline-none py-1 px-5 w-fit  flex items-center justify-center focus:outline-none border-none bg-red-500 text-white rounded-lg overflow-hidden shadow-sm backdrop-blur-sm"
              onClick={() => handleDeleteUser("delete")}
            >
              {i18n.language === "en" ? "Approve" : "Chấp nhận"}
            </button>
            <button
              className="outline-none py-1  w-fit px-5 flex items-center justify-center focus:outline-none border-none bg-blue-500 text-white rounded-lg overflow-hidden shadow-sm backdrop-blur-sm"
              onClick={() => handleDeleteUser("cancel")}
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

export default DeleteModal;
