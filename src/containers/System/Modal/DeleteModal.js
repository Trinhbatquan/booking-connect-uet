import React from "react";
import { motion, AnimatePresence } from "framer-motion";

import { RiDeleteBack2Fill } from "react-icons/ri";
import moment from "moment";
import { dateFormat } from "../../../utils/constant";

const DeleteModal = ({ dataUserDelete, isClose, deleteUser }) => {
  console.log(dataUserDelete);
  const handleDeleteUser = (type) => {
    if (type === "cancel") {
      isClose();
    } else if (type === "delete") {
      if (dataUserDelete?.fullName) {
        deleteUser(dataUserDelete?.id);
      } else {
        deleteUser(
          dataUserDelete[0]?.userId,
          moment(dataUserDelete[0]?.date).format(dateFormat.SEND_TO_SERVER)
        );
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
        className="z-50 fixed top-6 w-1/5 max-w-[1/5] flex flex-col h-auto bg-white rounded-lg shadow backdrop-blur-md mx-auto mt-16 pb-3 overflow-hidden"
        style={{ left: "40%" }}
      >
        <div className="bg-blue-600 px-3 py-2 w-full">
          <span className="text-white font-semibold">Delete user</span>
        </div>
        <div className="pt-1 pb-4 px-3 flex flex-col justify-center items-center w-full">
          <span>{`Do you want to delete ${
            dataUserDelete?.fullName
              ? dataUserDelete?.fullName
              : moment(dataUserDelete[0]?.date).format(
                  dateFormat.SEND_TO_SERVER
                )
          }?`}</span>
          <div className="mx-auto flex items-center justify-center gap-10 mt-4">
            <button
              className="outline-none py-1 px-3 w-1/2 flex items-center justify-center focus:outline-none border-none bg-red-500 text-white rounded-lg overflow-hidden shadow-sm backdrop-blur-sm"
              onClick={() => handleDeleteUser("delete")}
            >
              Yes
            </button>
            <button
              className="outline-none py-1 px-3 w-1/2 flex items-center justify-center focus:outline-none border-none bg-blue-500 text-white rounded-lg overflow-hidden shadow-sm backdrop-blur-sm"
              onClick={() => handleDeleteUser("cancel")}
            >
              Cancel
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
