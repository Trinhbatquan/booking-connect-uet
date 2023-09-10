import React from "react";
import { useState, useEffect } from "react";

import { BsBox } from "react-icons/bs";
import { AiOutlineFileDone } from "react-icons/ai";
import { FaRunning } from "react-icons/fa";
import { GrRefresh } from "react-icons/gr";
import { getAllBooking } from "../../../services/bookingService";
import Loading from "../../../utils/Loading";

import { useTranslation } from "react-i18next";
import moment from "moment";
import { dateFormat } from "../../../utils/constant";

import "../DepartmentManager/DepartmentManager.scss";

import { motion, AnimatePresence } from "framer-motion";

const ActionItem = ({ action, managerId, roleManager }) => {
  const [loading, setLoading] = useState(false);
  const [dataBookingFilter, setDataBookingFilter] = useState([]);
  const [dataBookingTotal, setDataBookingTotal] = useState([]);

  const [status, setStatus] = useState("total");

  const [detail, setDetail] = useState(false);
  const [dataBookingSelect, setDataBookingSelect] = useState();
  const [answer, setAnswer] = useState(false);
  const [dataAnswer, setDataAnswer] = useState("");

  console.log(answer);

  const { t, i18n } = useTranslation();

  console.log(dataBookingSelect);

  let countProcess = 0;
  let countDone = 0;
  if (dataBookingTotal?.length > 0) {
    dataBookingTotal.forEach((item) => {
      if (item?.statusId === "S2") {
        countProcess += 1;
      } else {
        countDone += 1;
      }
    });
  }

  useEffect(() => {
    let statusId = [];
    if (status === "total") {
      statusId = ["S2", "S3"];
    } else if (status === "process") {
      statusId = ["S2"];
    } else {
      statusId = ["S3"];
    }
    const params = {
      managerId,
      roleManager,
      actionId: action === "schedule" ? "A1" : "A2",
      statusId,
    };
    const paramTotals = {
      managerId,
      roleManager,
      actionId: action === "schedule" ? "A1" : "A2",
      statusId: ["S2", "S3"],
    };
    setLoading(true);
    setTimeout(async () => {
      await getAllBooking.getByManagerAndAction(params).then((res) => {
        if (res?.codeNumber === 0) {
          setDataBookingFilter(res?.allBooking);
        }
      });
      await getAllBooking.getByManagerAndAction(paramTotals).then((res) => {
        if (res?.codeNumber === 0) {
          setDataBookingTotal(res?.allBooking);
        }
      });
      setLoading(false);
    }, 1000);
  }, [action, status]);

  const handleRefresh = () => {
    setStatus("total");
    const params = {
      managerId,
      roleManager,
      actionId: action === "schedule" ? "A1" : "A2",
      statusId: ["S2", "S3"],
    };
    setLoading(true);
    setTimeout(() => {
      getAllBooking.getByManagerAndAction(params).then((res) => {
        if (res?.codeNumber === 0) {
          setDataBookingFilter(res?.allBooking);
          setDataBookingTotal(res?.allBooking);
          setLoading(false);
        }
      });
    }, 1000);
  };

  const HandleDetailBooking = (data) => {
    setDetail(true);
    setDataBookingSelect(data);
    setAnswer(false);
  };

  const handleAnswerQuestion = () => {
    setAnswer(true);
  };

  return (
    <div className="w-full">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="status-item flex items-center justify-start gap-6 pt-4">
            <button
              type="button"
              class={`hover:bg-blue-800 flex items-center justify-center gap-1 transition-all duration-500 flex-1 hover:text-white rounded-lg focus:ring-4 focus:ring-blue-300 font-medium  text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
                ${
                  status === "total"
                    ? "text-white bg-blue-800"
                    : "text-gray-400 bg-white border border-gray-600"
                }`}
              onClick={() => setStatus("total")}
            >
              <BsBox />
              {`${
                action === "schedule"
                  ? "Total of schedule:"
                  : "Total of question:"
              }`}{" "}
              <span className="text">
                {dataBookingTotal?.length ? dataBookingTotal.length : 0}
              </span>
            </button>
            <button
              type="button"
              class={`hover:bg-blue-800 flex items-center justify-center gap-1 transition-all duration-500 flex-1 hover:text-white rounded-lg focus:ring-4 focus:ring-blue-300 font-medium  text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
               ${
                 status === "process"
                   ? "text-white bg-blue-800"
                   : "text-gray-400 bg-white border border-gray-600"
               }`}
              onClick={() => setStatus("process")}
            >
              <FaRunning /> In process:
              <span className="text">{countProcess ? countProcess : 0}</span>
            </button>
            <button
              type="button"
              class={`hover:bg-blue-800 flex items-center justify-center gap-1 transition-all duration-500 flex-1 hover:text-white rounded-lg focus:ring-4 focus:ring-blue-300 font-medium  text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
               ${
                 status === "done"
                   ? "text-white bg-blue-800"
                   : "text-gray-400 bg-white border border-gray-600"
               }`}
              onClick={() => setStatus("done")}
            >
              <AiOutlineFileDone /> Out process:
              <span className="text">{countDone ? countDone : 0}</span>
            </button>
            <button
              type="button"
              onClick={() => handleRefresh()}
              class={`hover:bg-blue-800 border border-gray-300 flex items-center justify-center gap-1 transition-all duration-500 flex-1 hover:text-white rounded-lg focus:ring-4 focus:ring-blue-300 font-medium  text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
                `}
            >
              <GrRefresh />
              Refresh
            </button>
          </div>

          {dataBookingFilter?.length === 0 ? null : (
            <table className="mt-5">
              <thead>
                <tr>
                  <th className="text-center">{t("system.table.name")}</th>
                  <th className="text-center">{t("system.table.email")}</th>
                  <th className="text-center">{t("system.header.faculty")}</th>
                  {action === "question" && (
                    <th className="text-center">Time</th>
                  )}
                  {action === "schedule" && (
                    <th className="text-center">Date</th>
                  )}
                  {action === "schedule" && (
                    <th className="text-center">Time</th>
                  )}
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dataBookingFilter?.map((user, index) => {
                  return (
                    <tr key={index}>
                      <td className="text-center">
                        {user?.studentData?.fullName}
                      </td>
                      <td className="text-center">
                        {user?.studentData?.email}
                      </td>
                      <td className="text-center">
                        {user?.studentData?.faculty}
                      </td>
                      {action === "question" && (
                        <td className="text-center">
                          {moment(user?.updatedAt).format(
                            dateFormat.LABEL_SCHEDULE
                          )}
                        </td>
                      )}
                      {action === "schedule" && (
                        <td className="text-center">
                          {moment(user?.date).format(dateFormat.LABEL_SCHEDULE)}
                        </td>
                      )}
                      {action === "schedule" && (
                        <td className="text-center">
                          {user?.timeDataBooking?.valueEn}
                        </td>
                      )}
                      <td className="text-center">
                        {`${user?.statusId === "S2" ? "In Process" : "Done"}`}
                      </td>
                      <td className="flex items-center justify-center">
                        {" "}
                        <button
                          type="button"
                          class={`hover:bg-blue-800 border border-gray-300 flex items-center justify-center gap-1 transition-all duration-500 flex-1 hover:text-white rounded-lg focus:ring-4 focus:ring-blue-300 font-medium  text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
                `}
                          onClick={() => HandleDetailBooking(user)}
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          <AnimatePresence>
            {detail && (
              <motion.div
                className="mt-5"
                initial={{ opacity: 0, translateX: -50 }}
                animate={{ opacity: 1, translateX: 0 }}
                exit={{ opacity: 0, translateX: -50 }}
              >
                {action === "schedule" ? (
                  <div className="rounded-sm shadow-sm px-4 py-5 bg-gray-200 flex flex-col items-start justify-center gap-5">
                    <div className="flex items-center justify-start gap-5 w-full">
                      <div className="flex-1">
                        <label
                          htmlFor="helper-text"
                          class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                        >
                          FullName
                        </label>
                        <input
                          type="text"
                          id="helper-text"
                          disabled
                          value={dataBookingSelect?.studentData?.fullName}
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor="helper-text"
                          class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                        >
                          Email
                        </label>
                        <input
                          type="text"
                          id="helper-text"
                          disabled
                          value={dataBookingSelect?.studentData?.email}
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor="helper-text"
                          class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                        >
                          Faculty
                        </label>
                        <input
                          type="text"
                          id="helper-text"
                          disabled
                          value={dataBookingSelect?.studentData?.faculty}
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-start gap-5 w-full">
                      <div className="flex-1">
                        <label
                          htmlFor="helper-text"
                          class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                        >
                          Date
                        </label>
                        <input
                          type="text"
                          id="helper-text"
                          disabled
                          value={moment(dataBookingSelect?.date).format(
                            dateFormat.LABEL_SCHEDULE
                          )}
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor="helper-text"
                          class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                        >
                          Time
                        </label>
                        <input
                          type="text"
                          id="helper-text"
                          disabled
                          value={dataBookingSelect?.timeDataBooking?.valueEn}
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor="helper-text"
                          class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                        >
                          PhoneNumber
                        </label>
                        <input
                          type="text"
                          id="helper-text"
                          disabled
                          value={dataBookingSelect?.studentData?.phoneNumber}
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="helper-text"
                        class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                      >
                        Reason
                      </label>
                      <input
                        type="text"
                        id="helper-text"
                        value={dataBookingSelect?.reason}
                        disabled
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                    </div>

                    <div className="flex items-center justify-start gap-6 py-4 w-full">
                      <button
                        type="submit"
                        class={`border border-gray-600 hover:bg-blue-800 hover:text-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
                `}
                      >
                        Confirm completion
                      </button>
                      <button
                        type="text"
                        class={`border border-gray-600 hover:bg-blue-800 hover:text-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
                `}
                        onClick={() => setDetail(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-sm shadow-sm px-4 py-5 bg-gray-200 flex flex-col items-start justify-center gap-5">
                    <div className="flex items-center justify-start gap-5 w-full">
                      <div className="flex-1">
                        <label
                          htmlFor="helper-text"
                          class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                        >
                          FullName
                        </label>
                        <input
                          type="text"
                          id="helper-text"
                          disabled
                          value={dataBookingSelect?.studentData?.fullName}
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor="helper-text"
                          class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                        >
                          Email
                        </label>
                        <input
                          type="text"
                          id="helper-text"
                          disabled
                          value={dataBookingSelect?.studentData?.email}
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-start gap-5 w-full">
                      <div className="flex-1">
                        <label
                          htmlFor="helper-text"
                          class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                        >
                          Faculty
                        </label>
                        <input
                          type="text"
                          id="helper-text"
                          disabled
                          value={dataBookingSelect?.studentData?.faculty}
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor="helper-text"
                          class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                        >
                          Time
                        </label>
                        <input
                          type="text"
                          id="helper-text"
                          disabled
                          value={moment(dataBookingSelect?.updatedAt).format(
                            dateFormat.LABEL_SCHEDULE
                          )}
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="helper-text"
                        class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        id="helper-text"
                        value={dataBookingSelect?.subject}
                        disabled
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="helper-text"
                        class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                      >
                        Question
                      </label>
                      <textarea
                        type="text"
                        id="helper-text"
                        value={dataBookingSelect?.question}
                        disabled
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                    </div>
                    {answer && (
                      <div className="w-full">
                        <label
                          htmlFor="helper-text"
                          class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                        >
                          Answer question
                        </label>
                        <textarea
                          type="text"
                          id="helper-text"
                          row="7"
                          autoFocus
                          value={dataAnswer}
                          onChange={(e) => setDataAnswer(e.target.value)}
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-start gap-6 py-4 w-full">
                      <button
                        type="submit"
                        class={`border border-gray-600  hover:text-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
                        ${
                          answer
                            ? "bg-backColor text-white"
                            : "hover:bg-blue-800"
                        } 
                `}
                        onClick={!answer && handleAnswerQuestion}
                      >
                        {answer ? "Confirm Answer" : "Answer"}
                      </button>
                      <button
                        type="text"
                        class={`border border-gray-600 hover:bg-blue-800 hover:text-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
                `}
                        onClick={() => setDetail(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default ActionItem;
