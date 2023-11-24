import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Loading from "../../../utils/Loading";
import HomeHeader from "../HomeHeader";
import { useNavigate } from "react-router";
import { news } from "../../../services/newsService";
import convertBufferToBase64 from "../../../utils/convertBufferToBase64";
import { useTranslation } from "react-i18next";
import { path } from "../../../utils/constant";
import { RiArrowDownSLine } from "react-icons/ri";
import { FaLongArrowAltUp } from "react-icons/fa";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import HomeFooter from "../HomeFooter";
import {
  deleteNotifyStudentAndManager,
  getNotiFy,
  updateNotifyToOld,
} from "../../../services/notificationService";
import { BsThreeDots } from "react-icons/bs";
import "./SeeAllTeacher.scss";
import { MdViewDay } from "react-icons/md";
import { BsTrash3Fill } from "react-icons/bs";
import avatarNotify from "../../../assets/image/notify.jpg";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import contentNotify from "./../../../utils/contentNotification";
import ConfirmSeeAll from "./ConfirmSeeAll";
import { handleMessageFromBackend } from "../../../utils/handleMessageFromBackend";
import {
  logOutApi,
  logOutHomePageApi,
  loginHomePageApi,
} from "../../../services/userService";
import { logOutUser } from "../../../redux/studentSlice";
import { socket } from "../../..";
import { setCountNewNotifyHomePage } from "../../../redux/countNewNotifySlice";
import nodata from "../../../assets/image/nodata.png";

const NotificationSeeAll = () => {
  const [loading, setLoading] = useState(false);
  const [notifyData, setNotifyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [appearButtonRefresh, setAppearButtonRefresh] = useState(false);
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const mdParser = new MarkdownIt(/* Markdown-it options */);
  const [typeNotification, setTypeNotification] = useState("booking");
  const [isOpenConfirmNotify, setIsOpenConfirmNotify] = useState(false);
  const [actionDeleteNotify, setActionDeleteNotify] = useState("");
  const currentUser = useSelector((state) => state.studentReducer);
  const countNewNotificationRedux = useSelector(
    (state) => state.countNewNotifyReducer.countNewNotifyHomePage
  );

  const dispatch = useDispatch();

  const fetchDataNotify = ({ option, page, action }) => {
    setLoading(true);
    getNotiFy
      .getHomePageLimited({
        page: page ? page : currentPage,
        studentId: currentUser?.id,
        typeNotification: option ? option : typeNotification,
      })
      .then((data) => {
        if (data?.codeNumber === 0) {
          console.log(data);
          const { notify, pageCurrent, countsNotify } = data;
          if (notify?.length > 0) {
            for (let i = 0; i < notify.length; i++) {
              if (notify[i]?.image?.data) {
                notify[i].image.data = convertBufferToBase64(
                  notify[i].image.data
                );
              }
            }
          }
          if (action && action === "changePage") {
            setNotifyData(notifyData.concat(notify));
          } else {
            setTypeNotification(option);
            setNotifyData(notify);
          }
          setCurrentPage(+pageCurrent);
          setTotalPage(+countsNotify);
          setLoading(false);
        } else {
          setLoading(false);
          toast.error(
            i18n.language === "en" ? data?.message_en : data?.message_vn,
            {
              autoClose: 3000,
              theme: "colored",
              position: "bottom-right",
            }
          );
        }
      });
  };
  useEffect(() => {
    setLoading(true);
    getNotiFy
      .getHomePageLimited({
        page: currentPage,
        studentId: currentUser?.id,
        typeNotification,
      })
      .then((data) => {
        if (data?.codeNumber === 0) {
          console.log(data);
          const { notify, pageCurrent, countsNotify } = data;
          if (notify?.length > 0) {
            for (let i = 0; i < notify.length; i++) {
              if (notify[i]?.image?.data) {
                notify[i].image.data = convertBufferToBase64(
                  notify[i].image.data
                );
              }
            }
          }
          setNotifyData(notify);
          setCurrentPage(+pageCurrent);
          setTotalPage(+countsNotify);
          setLoading(false);
        } else {
          setLoading(false);
          toast.error(
            i18n.language === "en" ? data?.message_en : data?.message_vn,
            {
              autoClose: 3000,
              theme: "colored",
              position: "bottom-right",
            }
          );
        }
      });
  }, []);

  useEffect(() => {
    const listenNewUpdateBookingFromBackend = (data) => {
      const { studentId, type, actionId } = data;
      if (studentId === currentUser?.id) {
        if (actionId === "A2") {
          if (type === "done") {
            toast.info(
              i18n.language === "en"
                ? `A question has recently answered. Check now! (${moment(
                    new Date()
                  ).calendar()})`
                : `Một câu hỏi của bạn vừa được trả lời. Kiểm tra ngay! (${moment(
                    new Date()
                  ).calendar()})`,
              {
                autoClose: 5000,
                theme: "colored",
                position: "bottom-right",
              }
            );
          }
        } else if (actionId === "A1") {
          if (type === "process") {
            toast.info(
              i18n.language === "en"
                ? `A appointment has recently approved. Check now! (${moment(
                    new Date()
                  ).calendar()})`
                : `Một lịch hẹn của bạn vừa được chấp nhận. Kiểm tra ngay! (${moment(
                    new Date()
                  ).calendar()})`,
              {
                autoClose: 5000,
                theme: "colored",
                position: "bottom-right",
              }
            );
          } else if (type === "done") {
            toast.info(
              i18n.language === "en"
                ? `A appointment has recently finished. Thanks for your using! (${moment(
                    new Date()
                  ).calendar()})`
                : `Một lịch hẹn của bạn vừa được xác nhận hoàn thành. Cảm ơn vì đã sử dụng dịch vụ! (${moment(
                    new Date()
                  ).calendar()})`,
              {
                autoClose: 5000,
                theme: "colored",
                position: "bottom-right",
              }
            );
          } else if (type === "cancel") {
            toast.info(
              i18n.language === "en"
                ? `Ohhh! A appointment has recently canceled. Please find the reason of the cancelation. (${moment(
                    new Date()
                  ).calendar()})`
                : `Ohhh! Một lịch hẹn của bạn vừa bị huỷ. Vui lòng tìm hiểu lý do huỷ. (${moment(
                    new Date()
                  ).calendar()})`,
              {
                autoClose: 5000,
                theme: "colored",
                position: "bottom-right",
              }
            );
          }
        }
        setAppearButtonRefresh(true);
        dispatch(setCountNewNotifyHomePage(countNewNotificationRedux + 1));
      }
    };
    socket.on("new_notification_for_student_about_update_booking", (data) =>
      listenNewUpdateBookingFromBackend(data)
    );

    return () => {
      socket.off(
        "new_notification_for_student_about_update_booking",
        listenNewUpdateBookingFromBackend
      );
    };
  }, []);

  const handleCallAPIWhenChangePage = (page) => {
    fetchDataNotify({
      page,
      action: "changePage",
    });
  };

  const handleCallApiWhenChangeAction = (option) => {
    fetchDataNotify({
      option,
      page: 1,
      action: "changeObject",
    });
  };

  const handleDetailNotify = (data) => {
    if (typeNotification === "system") {
      navigate(`${path.HOMEPAGE}/${path.detail_notify}/${data?.code_url}`);
    } else {
      navigate(
        `${path.HOMEPAGE}/${path.processBooking}?${data?.bookingData?.actionId}`
      );
    }
  };

  const handledOpenConfirmDeleteNotify = ({ action, id }) => {
    setIsOpenConfirmNotify(true);
    setActionDeleteNotify(action);
  };

  const closeConfirm = () => {
    setIsOpenConfirmNotify(false);
    setActionDeleteNotify("");
  };

  const deleteNotify = () => {
    setLoading(true);
    deleteNotifyStudentAndManager(
      {},
      {
        type: "student",
        studentId: currentUser?.id,
        email: currentUser?.email,
        action: actionDeleteNotify === "all" ? "all" : "",
        notifyId: actionDeleteNotify === "all" ? "" : +actionDeleteNotify,
      }
    ).then(async (data) => {
      if (data?.codeNumber === 0) {
        setIsOpenConfirmNotify(false);
        setActionDeleteNotify("");
        await handleCallApiWhenChangeAction("booking");
        toast.success(
          i18n.language === "en" ? data?.message_en : data?.message_vn,
          {
            autoClose: 3000,
            theme: "colored",
            position: "bottom-right",
          }
        );
      } else {
        setLoading(false);
        const response = handleMessageFromBackend(data, i18n.language);
        toast.error(response, {
          autoClose: 3000,
          theme: "colored",
          position: "bottom-right",
        });
        if (data?.codeNumber === -2) {
          setTimeout(() => {
            logOutHomePageApi.logoutUser({}).then((data) => {
              if (data?.codeNumber === 0) {
                dispatch(logOutUser());
                navigate(
                  `${path.HOMEPAGE}/${path.login_homepage}redirect=/homepage`
                );
              }
            });
          }, 5000);
        }
      }
    });
  };

  const handleRefreshNotification = async () => {
    setAppearButtonRefresh(false);
    dispatch(setCountNewNotifyHomePage(0));
    await fetchDataNotify({ option: "booking", page: +1 });
    if (countNewNotificationRedux > 0) {
      updateNotifyToOld({
        type: "student",
        studentId: currentUser?.id,
      }).then((data) => {});
    }
  };

  return (
    <div style={{}}>
      <ToastContainer />
      {loading && (
        <div className="fixed loading-overlay top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25">
          <div className="absolute">
            <Loading />
          </div>
        </div>
      )}
      <HomeHeader />
      <div className="w-full h-[100px]"></div>
      <div
        className="relative mt-[34px] pt-[20px] mb-[20px] mx-[10%] pr-[30px] pl-[65px]"
        style={{
          border: "1px solid rgb(242, 242, 242)",
          minHeight: "300px",
        }}
      >
        <div className="mb-[30px] relative">
          <h2 className="text-blurThemeColor font-semibold">
            {i18n.language === "en" ? "Notification" : "Thông báo"}
          </h2>
          <div
            style={{
              position: "absolute",
              top: "4px",
              bottom: "4px",
              width: "11px",
              left: "-31px",
              backgroundColor: "rgb(246, 133, 0)",
            }}
          ></div>
        </div>
        <div className="pb-[30px] mx-auto flex flex-col items-start justify-start gap-5">
          <div
            className="px-5 h-[60px] w-full rounded-lg flex items-center justify-between"
            style={{
              border: "1px solid rgb(242, 242, 242)",
            }}
          >
            <div className="flex items-center justify-start gap-8">
              <button
                class={`px-5 py-1.5 flex transition-all ease-in duration-150 items-center justify-center overflow-hidden text-md font-semibold border border-blue-500 rounded-2xl hover:text-white hover:bg-blue-500 hover:opacity-100 ${
                  typeNotification === "system"
                    ? "text-white bg-blue-500"
                    : "text-blue-500 bg-white opacity-50"
                }`}
                onClick={() => handleCallApiWhenChangeAction("system")}
              >
                <span class="">
                  {i18n.language === "en"
                    ? "From School and System"
                    : "Từ nhà trường và hệ thống"}
                </span>
              </button>
              <button
                class={`px-5 py-1.5 flex transition-all ease-in duration-150 items-center justify-center overflow-hidden text-md font-semibold border border-blue-500 rounded-2xl hover:text-white hover:bg-blue-500 hover:opacity-100 ${
                  typeNotification === "booking"
                    ? "text-white bg-blue-500"
                    : "text-blue-500 bg-white opacity-50"
                }`}
                onClick={() => handleCallApiWhenChangeAction("booking")}
              >
                <span class="">
                  {i18n.language === "en"
                    ? "About Your Booking Process"
                    : "Về tiến trình đặt của bạn"}
                </span>
              </button>
            </div>
            {typeNotification !== "system" && notifyData?.length > 0 && (
              <button
                class={`px-5 py-1.5 flex  items-center justify-center overflow-hidden text-sm bg-gray-200 text-headingColor hover:text-white hover:bg-blue-500 transition-all duration-200 rounded-2xl
                 `}
                onClick={() =>
                  handledOpenConfirmDeleteNotify({
                    action: "all",
                  })
                }
              >
                <span class="">
                  {i18n.language === "en"
                    ? "Remove all notification"
                    : "Xoá tất cả thông báo"}
                </span>
              </button>
            )}
          </div>
          {notifyData?.length === 0 ? (
            <img
              src={nodata}
              alt=""
              style={{
                height: "300px",
                width: "70%",
                objectFit: "cover",
                margin: "0 auto",
              }}
            />
          ) : (
            <div
              className="rounded-lg w-full"
              style={{
                border: "1px solid rgb(242, 242, 242)",
              }}
            >
              <div className="flex flex-col items-start justify-start w-full">
                {notifyData.map((item, index) => {
                  return (
                    <div
                      className="teacher-see-all-item w-full gap-8 hover:bg-gray-200 px-5"
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px dashed #e3e3e3",
                        // marginBottom: "5px",
                      }}
                    >
                      <div
                        className={`relative ${
                          typeNotification === "system"
                            ? "w-[100px] h-[100px]"
                            : "w-[120px] h-[120px]"
                        } mx-auto flex items-center justify-center`}
                      >
                        <div
                          className={`${
                            typeNotification === "system"
                              ? "w-[80px] h-[80px]"
                              : "w-[120px] h-[96px]"
                          }`}
                          style={{
                            backgroundImage: `url(${
                              item?.image?.data
                                ? item.image.data
                                : typeNotification === "system"
                                ? "https://uet.vnu.edu.vn/wp-content/uploads/2018/01/GetArticleImage.jpg"
                                : avatarNotify
                            })`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            borderRadius: "4px",
                          }}
                        ></div>
                        {/* <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: "-53px",
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
                                  {`${new Date(item?.createdAt).getDate()}`}
                                </div>
                              </div>
                            </div> */}
                      </div>
                      <div className="flex-1 flex items-center justify-start">
                        {typeNotification === "system" ? (
                          <div className="flex flex-col items-start justify-center">
                            <h4
                              style={{
                                margin: "8px 0 0 0",
                                color: "rgb(126, 105, 105)",
                                fontSize: "17px",
                              }}
                            >
                              {item?.title}
                            </h4>
                            <div
                              className="text-sm"
                              style={{
                                marginBottom: "14px",
                                color: "#015198",
                                height: "65px",
                                maxHeight: "45px",
                                lineHeight: "20px",
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 2,
                              }}
                              dangerouslySetInnerHTML={{
                                __html: item?.contentHtml,
                              }}
                            ></div>{" "}
                          </div>
                        ) : (
                          <div className="flex flex-col items-start justify-center">
                            <h3
                              style={{
                                margin: "8px 0 0 0",
                                color: "rgb(126, 105, 105)",
                              }}
                            >
                              {i18n.language === "en"
                                ? item?.notificationType?.valueEn
                                : item?.notificationType?.valueVn}
                            </h3>
                            <p
                              className=""
                              style={{
                                // marginTop: "25px",
                                // marginBottom: "22px",
                                fontSize: "13px",
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
                            </p>
                          </div>
                        )}
                        {/* <div
                              className="text-md"
                              style={{
                                marginTop: "10px",
                                marginBottom: "22px",
                                color: "#015198",
                                height: "150px",
                                maxHeight: "150px",
                                lineHeight: "30px",
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 5,
                              }}
                              dangerouslySetInnerHTML={{
                                __html: item?.contentHtml,
                              }}
                            ></div> */}
                        {/* <div className="w-full flex items-start justify-start gap-4">
                              <button
                                class="px-5 py-1.5 flex cursor-pointer transition-all ease-in duration-150 items-center justify-center overflow-hidden text-sm font-semibold border border-backColor text-white  rounded-md bg-backColor hover:text-backColor hover:bg-white"
                                onClick={() =>
                                  navigate(
                                    `${path.HOMEPAGE}/${path.detail_notify}/${item?.code_url}`
                                  )
                                }
                              >
                                <span class="">
                                  {i18n.language === "en"
                                    ? "Detail"
                                    : "Chi tiết"}
                                </span>
                              </button>
                            </div> */}
                      </div>
                      <div className="cursor-pointer relative flex items-center flex-col">
                        <p className="text-headingColor opacity-80 text-md">
                          {i18n.language === "en"
                            ? moment(item?.createdAt).locale("en").fromNow()
                            : moment(item?.createdAt).fromNow()}
                        </p>
                        <div className="notification-option relative">
                          <BsThreeDots className="text-blurThemeColor text-2xl w-full" />
                          <ul
                            className="drop_down_notify rounded-lg w-[200px] bg-white"
                            style={{
                              position: "absolute",
                              zIndex: 5,
                              top: "20px",
                              right: "1px",
                              cursor: "pointer",
                              boxShadow: "rgba(0, 0, 0, 0.25) 0px 1px 5px",
                              border: "1px solid rgb(201, 151, 151)",
                            }}
                          >
                            <div className="absolute h-[15px] w-[200px] -top-[10px] right-0 left-0 bg-transparent"></div>
                            <li className="">
                              <div
                                className={`flex items-center text-headingColor opacity-80 justify-start gap-2 rounded-sm py-[8px] mx-[6px] px-[5px] ${
                                  typeNotification === "system"
                                    ? "my-[6px]"
                                    : "mt-[6px]"
                                } hover:bg-gray-300 `}
                                onClick={() => handleDetailNotify(item)}
                              >
                                <MdViewDay className="text-lg" />
                                <span className="text-sm">
                                  {i18n.language === "en"
                                    ? "Detail"
                                    : "Chi tiết"}
                                </span>
                              </div>
                            </li>
                            {typeNotification !== "system" && (
                              <li className="mt-1">
                                <div
                                  className={`flex items-center text-headingColor opacity-80 justify-start gap-2 rounded-sm py-[8px] mx-[6px] px-[5px] mb-[6px] hover:bg-gray-300 `}
                                  onClick={() =>
                                    handledOpenConfirmDeleteNotify({
                                      action: item?.id,
                                    })
                                  }
                                >
                                  <BsTrash3Fill className="text-lg" />
                                  <span className="text-sm">
                                    {i18n.language === "en"
                                      ? "Remove this notification"
                                      : "Xoá thông báo này"}
                                  </span>
                                </div>
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {notifyData?.length < totalPage && (
                <div className="flex items-center justify-center my-[20px]">
                  <div
                    className="see_more_teacher  bg-blurThemeColor opacity-90 hover:opacity-100 transition-all duration-300"
                    style={{
                      display: "flex",
                      borderRadius: "30px",
                      width: "168px",
                      height: "40px",
                      justifyContent: "center",
                      alignItems: "center",
                      borderColor: "#1d5193",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCallAPIWhenChangePage(currentPage + 1)}
                  >
                    <span
                      style={{
                        lineHeight: "1.45",
                        fontSize: "15px",
                        color: "#fff",
                      }}
                    >
                      {i18n.language === "en" ? "See more" : "Xem thêm"}
                    </span>
                    <RiArrowDownSLine className="text-2xl text-white ml-[8px]" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <HomeFooter />
      {isOpenConfirmNotify && (
        <div className="fixed modal-confirm-schedule-overplay top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25"></div>
      )}
      {isOpenConfirmNotify && (
        <ConfirmSeeAll
          action={actionDeleteNotify}
          closeConfirm={closeConfirm}
          confirmDeleteNotify={deleteNotify}
        />
      )}
      {appearButtonRefresh && (
        <button
          class={`fixed modal-confirm-schedule-overplay flex gap-1 top-44 px-5 py-1.5 left-[50%] -translate-x-[50%]  transition-all ease-in duration-150 items-center justify-center overflow-hidden text-md font-semibold border border-blue-500 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 
            `}
          onClick={() => handleRefreshNotification()}
        >
          <FaLongArrowAltUp className="text-2xl text-white" />
          <span class="">
            {i18n.language === "en" ? "New notifications" : "Thông báo mới"}
          </span>
        </button>
      )}
    </div>
  );
};

export default NotificationSeeAll;
