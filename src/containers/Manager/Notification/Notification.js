import React, { Fragment, useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { getAllCodeApi } from "../../../services/userService";
import Loading from "../../../utils/Loading";
import { useTranslation } from "react-i18next";
import NotificationItem from "./NotificationItem";
import { useSelector } from "react-redux";

const Notification = () => {
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("");
  const [typeNotificationData, setTypeNotificationData] = useState([]);
  const { i18n } = useTranslation();

  const currentUser = useSelector((state) => state.authReducer);
  const notify = useSelector((state) => state.notificationReducer.notify);

  let newNotify = [];
  let systemNotify = [];
  let countNewNotifyNoRead = 0;
  let countSystemNotifyNoRead = 0;
  if (notify?.length > 0) {
    notify.forEach((item) => {
      if (item?.type_notification === "N") {
        newNotify.push(item);
      } else {
        systemNotify.push(item);
      }
    });
  }

  if (newNotify?.length > 0) {
    newNotify.forEach((item) => {
      if (item?.status === "NR") {
        countNewNotifyNoRead++;
      }
    });
  }

  if (systemNotify?.length > 0) {
    systemNotify.forEach((item) => {
      if (item?.status === "NR") {
        countSystemNotifyNoRead++;
      }
    });
  }

  useEffect(() => {
    getAllCodeApi.getByType({ type: "Notification" }).then((data) => {
      if (data?.codeNumber === 0) {
        let { allCode } = data;
        setTypeNotificationData(allCode);
        setLoading(false);
      }
    });
  }, []);

  return (
    <div>
      <Fragment>
        <ToastContainer />
        <div
          className="mt-3 flex flex-col items-start mx-auto pb-5 gap-8"
          style={{ maxWidth: "80%", width: "80%" }}
        >
          {loading ? (
            <Loading />
          ) : (
            <>
              <p className="mx-auto text-2xl text-blue-600 font-semibold">
                Quản lý thông báo
              </p>

              <div className="flex items-center justify-between gap-10 w-full">
                <button
                  type="button"
                  class={` hover:bg-blue-800 transition-all flex items-center justify-center gap-1 duration-500 flex-1 hover:text-white rounded-lg focus:ring-4 focus:ring-blue-300 font-medium  text-md px-5 py-2.5  mb-2 focus:outline-none
                ${
                  type === "new"
                    ? "text-white bg-blue-800"
                    : "text-gray-400 bg-white border border-gray-600"
                }`}
                  onClick={() => setType("new")}
                >
                  <span>
                    {i18n.language === "en"
                      ? typeNotificationData[0]?.valueEn
                      : typeNotificationData[0]?.valueVn}
                  </span>
                  <span>{`(${countNewNotifyNoRead})`}</span>
                </button>
                <button
                  type="button"
                  class={`w-[50%] hover:bg-blue-800 transition-all flex items-center justify-center gap-1 duration-500  hover:text-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5  mb-2 focus:outline-none
                ${
                  type === "system"
                    ? "text-white bg-blue-800"
                    : "text-gray-400 bg-white border border-gray-600"
                }`}
                  onClick={() => setType("system")}
                >
                  <span>
                    {i18n.language === "en"
                      ? typeNotificationData[1]?.valueEn
                      : typeNotificationData[1]?.valueVn}
                  </span>
                  <span>{`(${countSystemNotifyNoRead})`}</span>
                </button>
              </div>

              {type && (
                <NotificationItem
                  type={type}
                  roleManager={currentUser?.role}
                  managerId={currentUser?.id}
                  dataNotify={type === "new" ? newNotify : systemNotify}
                />
              )}
            </>
          )}
        </div>
      </Fragment>
    </div>
  );
};

export default Notification;
