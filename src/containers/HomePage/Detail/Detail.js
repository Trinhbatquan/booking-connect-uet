import React, { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/vi";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import "./Detail.scss";
import HomeHeader from "../HomeHeader";
import HomeFooter from "../HomeFooter";
import Loading from "../../../utils/Loading";

import { getTeacherHomePageAPI } from "../../../services/teacherService";
import convertBufferToBase64 from "../../../utils/convertBufferToBase64";
import Schedule from "../Schedule/Schedule";
import { getScheduleByIdAndDate } from "../../../services/scheduleService";
import { dateFormat, path } from "../../../utils/constant";
import avatar from "../../../assets/image/uet.png";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  getUserApi,
  logOutApi,
  logOutHomePageApi,
} from "../../../services/userService";
import {
  createBookingScheduleService,
  createQuestionService,
  getBookingSchedule,
} from "../../../services/bookingService";
import checkBookedSchedule from "../../../utils/checkBookedSchedule";
import QuestionForm from "../QuestionForm/QuestionForm";
import { emitter } from "../../../utils/emitter";
import BookingModal from "../BookingForm/BookingModal";
import DetailSkeleton from "./DetailSkeleton";

//socket
import { emit_create_booking } from "../../../utils/socket_client";
import { handleMessageFromBackend } from "../../../utils/handleMessageFromBackend";
import { logOutUser } from "../../../redux/studentSlice";

const Detail = ({ codeUrlTeacher, roleTeacher, type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingTeacher, setLoadingTeacher] = useState(false);
  const [userData, setUserData] = useState({});
  const [timeDataApi, setTimeDataApi] = useState(null);

  const [openModalSchedule, setOpenModalSchedule] = useState(false);
  const [dataModalSchedule, setDataModalSchedule] = useState({});

  const [action, setAction] = useState("schedule");

  const codeUrlParam = useParams()?.code_url;
  const roleParam = useParams()?.roleId;
  const code_url = codeUrlTeacher || codeUrlParam;
  const roleId = roleTeacher || roleParam;

  const date_tomorrow = moment(new Date())
    .add(1, "days")
    .format(dateFormat.SEND_TO_SERVER);

  // const navigate = useSelector((state) => state.navigateReducer.navigate);
  const currentStudent = useSelector((state) => state.studentReducer);
  const { t, i18n } = useTranslation();

  const getBookingScheduleNotSelected = async (
    getTime,
    managerId,
    roleManager,
    studentId,
    date,
    actionId
  ) => {
    let bookingScheduleData = [];
    const bookingSelected = await getBookingSchedule.get({
      managerId,
      roleManager,
      // studentId,
      date,
      actionId,
    });
    if (bookingSelected.codeNumber === 0) {
      console.log(bookingSelected.bookingSchedule);
      // if (bookingSelected?.bookingSchedule?.length > 0) {
      bookingSelected.bookingSchedule.forEach((item) => {
        bookingScheduleData.push(item?.timeType);
      });
      getTime = checkBookedSchedule(getTime, bookingScheduleData);
      // }
    }
    return getTime;
  };

  useEffect(() => {
    if (!type) {
      setLoading(true);
    } else {
      setLoadingTeacher(true);
    }
    setTimeout(async () => {
      let res;
      if (roleId === "R5") {
        res = await getTeacherHomePageAPI.getTeacherById({ code_url });
      } else {
        res = await getUserApi.getUser({ code_url });
      }
      let managerId;
      if (res?.codeNumber === 0) {
        const { data } = res;
        console.log(data);
        managerId = data?.id;
        const image = data?.image?.data;
        if (image) {
          data.image = convertBufferToBase64(data?.image?.data);
        }
        setUserData(data);
      }
      const data = await getScheduleByIdAndDate.get({
        managerId,
        date: date_tomorrow,
        roleManager: roleId,
      });
      if (data?.codeNumber === 0) {
        if (data?.schedule?.length === 0) {
          setTimeDataApi(
            i18n.language === "en"
              ? "Teacher don't have appointment at this day, please select another time."
              : "Giảng viên không có lịch ngày hôm nay, vui lòng chọn thời gian khác."
          );
        } else {
          let getTime = [];

          data?.schedule.forEach((item) => {
            getTime.push({
              timeType: item?.timeType,
              valueTimeVn: item?.timeData?.valueVn,
              valueTimeEn: item?.timeData?.valueEn,
            });
          });
          getTime = await getBookingScheduleNotSelected(
            getTime,
            managerId,
            roleId,
            currentStudent?.id,
            date_tomorrow,
            "A1"
          );

          console.log(getTime);
          setTimeDataApi(getTime);
        }
      }

      if (!type) {
        setLoading(false);
      } else {
        setLoadingTeacher(false);
      }
    }, 1000);
  }, []);

  const loadTimeOfDate = async (value) => {
    console.log(value);
    const managerId = +userData?.id;
    const date = value;
    const roleManager = roleId;
    const data = await getScheduleByIdAndDate.get({
      managerId,
      date,
      roleManager,
    });
    if (data?.codeNumber === 0) {
      if (data?.schedule?.length === 0) {
        setTimeDataApi(
          i18n.language === "en"
            ? "Teacher don't have appointment at this day, please select another time."
            : "Giảng viên không có lịch ngày hôm nay, vui lòng chọn thời gian khác."
        );
      } else {
        let getTime = [];
        data?.schedule.forEach((item) => {
          getTime.push({
            timeType: item?.timeType,
            valueTimeVn: item?.timeData?.valueVn,
            valueTimeEn: item?.timeData?.valueEn,
          });
        });
        console.log(getTime);
        getTime = await getBookingScheduleNotSelected(
          getTime,
          userData?.id,
          roleId,
          currentStudent?.id,
          date,
          "A1"
        );

        setTimeDataApi(getTime);
      }
    }
  };

  const handleSchedule = ({ timeType, valueTime }, date) => {
    console.log({ timeType, valueTime }, date);
    setOpenModalSchedule(true);
    const data = {
      currentStudent,
      timeType,
      valueTime,
      date,
    };
    console.log(data);
    setDataModalSchedule(data);
  };

  const closeModalSchedule = () => {
    setOpenModalSchedule(false);
  };

  //create booking schedule
  const createBookingSchedule = async (data) => {
    const { email, managerId, roleManager, studentId, date, timeType, reason } =
      data;

    setLoading(true);
    const res = await createBookingScheduleService.create(
      {},
      {
        email,
        managerId,
        roleManager,
        studentId,
        date,
        timeType,
        reason,
      }
    );

    if (res?.codeNumber === 0) {
      //socket_emit_booking_create
      emit_create_booking(managerId, roleManager, "A1");
      emitter.emit("clear_data_booking_schedule");
      setOpenModalSchedule(false);
      setLoading(false);
      if (res?.type === "create") {
        toast.success(
          i18n.language === "en" ? res?.message_en : res?.message_vn,
          {
            autoClose: 6000,
            position: "bottom-right",
            theme: "colored",
          }
        );
      } else {
        toast.info(i18n.language === "en" ? res?.message_en : res?.message_vn, {
          autoClose: 6000,
          position: "bottom-right",
          theme: "colored",
        });
      }
      loadTimeOfDate(date);
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
                `${path.HOMEPAGE}/${path.login_homepage}?redirect=/homepage`
              );
            }
          });
        }, 5000);
      }
    }
  };

  //questions
  const createBooking = async (data) => {
    const body = {
      email: currentStudent?.email,
      studentId: currentStudent?.id,
      managerId: +userData?.id,
      roleManager: roleId,
      action: "A2",
      ...data,
    };
    setLoading(true);
    await createQuestionService.create({}, body).then((res) => {
      if (res?.codeNumber === 0) {
        setLoading(false);
        if (res?.type === "create" || res?.type === "sent") {
          toast.success(
            i18n.language === "en" ? res?.message_en : res?.message_vn,
            {
              autoClose: 6000,
              position: "bottom-right",
              theme: "colored",
            }
          );
          emitter.emit("EVENT_CLEAR_DATA");
          if (res?.type === "create") {
            //socket_emit_booking_create
            emit_create_booking(+userData?.id, roleId, "A2");
          }
        } else {
          toast.info(
            i18n.language === "en" ? res?.message_en : res?.message_vn,
            {
              autoClose: 6000,
              position: "bottom-right",
              theme: "colored",
            }
          );
          //emitter clear data component child
        }
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
                  `${path.HOMEPAGE}/${path.login_homepage}?redirect=/homepage`
                );
              }
            });
          }, 5000);
        }
      }
    });
  };

  return (
    <>
      {loading && (
        <div className="loading-overlay fixed top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25">
          <div className="absolute">
            <Loading />
          </div>
        </div>
      )}
      <ToastContainer />
      {!type && <HomeHeader />}
      {!type && <div className="w-full h-[100px]"></div>}
      {loadingTeacher ? (
        <DetailSkeleton />
      ) : (
        <>
          {" "}
          <div
            className={`${
              type
                ? "detail-teacher-faculty-container"
                : "detail-teacher-container"
            }`}
          >
            <div className="detail-teacher">
              <div
                className="detail-teacher-avatar flex-3"
                style={{
                  backgroundImage: `url(${
                    roleId === "R5"
                      ? userData?.image
                        ? userData?.image
                        : avatar
                      : avatar
                  })`,
                }}
              ></div>
              <div className="detail-teacher-content flex-1">
                <p className="detail-teacher-content-name">
                  {userData?.id
                    ? roleId === "R5"
                      ? `${userData?.positionData?.valueVn}
                          ,
                          ${userData?.fullName}
                        `
                      : userData?.fullName
                    : ""}
                </p>
                <p>
                  {userData?.id
                    ? roleId === "R5"
                      ? userData?.markdownData_teacher?.description
                      : userData?.markdownData_other?.description
                    : ""}
                </p>
              </div>
            </div>
            <div className="action-teacher">
              <div className="action-select">
                <button
                  type="button"
                  class={`hover:bg-blue-800 hover:text-white rounded-lg focus:ring-4 focus:ring-blue-300 font-medium  text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
                  ${
                    action === "schedule"
                      ? "text-white bg-blue-800"
                      : "text-gray-400 bg-white border border-gray-600"
                  }`}
                  onClick={() => setAction("schedule")}
                >
                  {t("teacher.schedule.name")}
                </button>
                <button
                  type="button"
                  class={`hover:bg-blue-800 hover:text-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
                  ${
                    action === "question"
                      ? "text-white bg-blue-800"
                      : "text-gray-400 bg-white border border-gray-600"
                  }`}
                  onClick={() => setAction("question")}
                >
                  {t("teacher.question.name")}
                </button>
              </div>
              {action === "schedule" && (
                <Schedule
                  type={type}
                  change={loadTimeOfDate}
                  timeData={timeDataApi}
                  teacher={userData}
                  handleSchedule={handleSchedule}
                />
              )}
              {action === "question" && (
                <QuestionForm type={type} create={createBooking} />
              )}
              {!type && (
                <div
                  className="description-teacher"
                  dangerouslySetInnerHTML={
                    roleId === "R5"
                      ? {
                          __html: userData?.markdownData_teacher?.markdownHtml,
                        }
                      : {
                          __html: userData?.markdownData_other?.markdownHtml,
                        }
                  }
                ></div>
              )}
            </div>
          </div>
          {!type && <HomeFooter />}
        </>
      )}
      {openModalSchedule && (
        <BookingModal
          close={closeModalSchedule}
          dataModalSchedule={dataModalSchedule}
          userData={userData}
          roleManager={roleId}
          create={createBookingSchedule}
        />
      )}

      {openModalSchedule && (
        <div className="modal-schedule-overplay fixed top-0 bottom-0 left-0 right-0 w-full max-h-full bg-black bg-opacity-25"></div>
      )}
    </>
  );
};

export default Detail;
