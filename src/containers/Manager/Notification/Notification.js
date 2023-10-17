import React, { Fragment, useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { getAllCodeApi } from "../../../services/userService";
import Loading from "../../../utils/Loading";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getNotiFy } from "../../../services/notificationService";
import { getAllNotify } from "../../../redux/notificationManagerSlice";
import Pagination from "../../../utils/Pagination";

import moment from "moment";
import contentNotify from "../../../utils/contentNotification";
import { useNavigate } from "react-router";
import { path } from "../../../utils/constant";

const Notification = () => {
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("");
  const [typeNotificationData, setTypeNotificationData] = useState([]);
  const { i18n } = useTranslation();
  const [page, setPage] = useState(1);

  const currentUser = useSelector((state) => state.authReducer);
  const dataNotify = useSelector((state) => state.notificationReducer);
  const { notify, pageCurrent, pageTotal } = dataNotify;

  console.log(dataNotify);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getNotiFy
      .get({ managerId: currentUser?.id, roleManager: currentUser?.role, page })
      .then((res) => {
        console.log(res);

        if (res?.codeNumber === 0) {
          dispatch(
            getAllNotify({
              notify: res?.notify,
              pageCurrent: res?.pageCurrent,
              pageTotal: res?.pageTotal,
            })
          );
        }
        setLoading(false);
      });
  }, [page]);

  const handleNavigatePage = (pageSelect) => {
    setPage(pageSelect);
  };

  return (
    <div>
      <Fragment>
        <ToastContainer />
        <div
          className="mt-3 flex flex-col items-start mx-auto gap-8 pb-[30px]"
          style={{ maxWidth: "70%", width: "70%" }}
        >
          {loading ? (
            <div className="fixed z-50 top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25">
              <div className="absolute top-[50%] left-[50%]">
                <Loading />
              </div>
            </div>
          ) : (
            <>
              <p className="text-2xl text-blurThemeColor font-semibold pb-2 relative">
                <span>{`Tổng số thông báo (${notify?.length})`}</span>
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "120px",
                    height: "5px",
                    backgroundColor: "rgb(29, 81, 147)",
                  }}
                ></span>
              </p>

              <div className="notify w-full mx-auto flex flex-col items-start justify-start gap-8">
                {notify?.length > 0 &&
                  notify.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="notify-item w-full relative flex items-center justify-start gap-6"
                      >
                        <div className="relative">
                          <img
                            src="https://uet.vnu.edu.vn/wp-content/uploads/2018/01/GetArticleImage.jpg"
                            className="w-[360px] h-[240px]"
                            title={item?.notificationType?.valueVn}
                            alt={item?.notificationType?.valueVn}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: "-50px",
                              width: "50px",
                              height: "50px",
                            }}
                          >
                            <div
                              className="text-md"
                              style={{
                                padding: "10px 10px",
                                fontSize: "12px",
                                lineHeight: "18px",
                                minWidth: "30px",
                                backgroundColor: "#17376e",
                                borderRadius: "5px",
                              }}
                            >
                              <div className="month text-white text-md text-center">
                                {`Th${
                                  new Date(item?.createdAt).getMonth() + 1
                                }`}
                              </div>
                              <div
                                className="day text-white text-lg text-center"
                                style={{
                                  lineHeight: "18px",
                                }}
                              >
                                {`${new Date(item?.createdAt).getDate() + 1}`}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="flex-1"
                          style={{
                            borderTop: "1px solid #eaeaea",
                            margin: "17px 70px 0",
                          }}
                        >
                          <h3
                            style={{
                              marginBottom: "9px",
                              color: "#343434",
                            }}
                          >
                            {i18n.language === "en"
                              ? item?.notificationType?.valueEn
                              : item?.notificationType?.valueVn}
                          </h3>
                          <div
                            className="text-md"
                            style={{
                              marginTop: "25px",
                              marginBottom: "22px",
                              color: "#015198",
                            }}
                          >
                            {i18n.language === "en"
                              ? contentNotify(
                                  item?.type_notification,
                                  item
                                ).en()
                              : contentNotify(
                                  item?.type_notification,
                                  item
                                ).vn()}
                          </div>
                          <div
                            className="text-sm flex items-center justify-start"
                            style={{
                              textTransform: "uppercase",
                              marginBottom: " 10px",
                              paddingTop: 0,
                              color: "#015198",
                            }}
                          >
                            <span>
                              Bởi hệ thống{" "}
                              <span
                                style={{
                                  lineHeight: "1px",
                                  margin: "0 5px",
                                  color: "#eaeaea",
                                }}
                              >
                                |
                              </span>
                            </span>
                            <span>
                              Tin sinh viên
                              <span
                                style={{
                                  lineHeight: "1px",
                                  margin: "0 5px",
                                  color: "#eaeaea",
                                }}
                              >
                                |
                              </span>
                            </span>
                          </div>
                          <button
                            class="px-5 py-1.5 flex transition-all ease-in duration-150 items-center justify-center overflow-hidden text-sm font-semibold border border-red-500 text-white  rounded-md bg-red-500 hover:text-red-500 hover:bg-white"
                            onClick={() =>
                              item?.type_notification !== "system"
                                ? navigate(
                                    `${path.MANAGER}/${path.student}${item?.type_notification}`
                                  )
                                : ""
                            }
                          >
                            <span class="">
                              {i18n.language === "en" ? "Detail" : "Chi tiết"}
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}

                <Pagination
                  numberOfPage={pageCurrent}
                  pages={pageTotal}
                  handleNavigatePage={handleNavigatePage}
                />
              </div>
            </>
          )}
        </div>
      </Fragment>
    </div>
  );
};

export default Notification;
