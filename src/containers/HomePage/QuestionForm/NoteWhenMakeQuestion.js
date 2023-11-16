import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BiNotepad } from "react-icons/bi";
import { RiDeleteBack2Fill } from "react-icons/ri";
const NoteWhenMakeQuestion = ({ close, type, option, top }) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, translateY: -50 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -50 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          id="toast-default"
          className={`note-make-question flex absolute ${
            top ? top : "-top-12"
          } right-0 items-center w-fit p-4 text-gray-500 bg-gray-100 shadow dark:text-gray-400 dark:bg-gray-800`}
          role="alert"
        >
          <div
            className="bg-gray-100"
            style={{
              position: "absolute",
              bottom: "-4px",
              left: "5px",
              transform: "rotate(45deg)",
              width: "12px",
              height: "12px",
            }}
          ></div>
          <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
            <svg
              class="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.147 15.085a7.159 7.159 0 0 1-6.189 3.307A6.713 6.713 0 0 1 3.1 15.444c-2.679-4.513.287-8.737.888-9.548A4.373 4.373 0 0 0 5 1.608c1.287.953 6.445 3.218 5.537 10.5 1.5-1.122 2.706-3.01 2.853-6.14 1.433 1.049 3.993 5.395 1.757 9.117Z"
              />
            </svg>
            <span class="sr-only">Fire icon</span>
          </div>
          <div class="ms-3 text-md font-normal pr-4">{type}</div>
          <button
            type="button"
            class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            data-dismiss-target="#toast-default"
            aria-label="Close"
            onClick={() => close(option)}
          >
            <span class="sr-only">Close</span>
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default NoteWhenMakeQuestion;
