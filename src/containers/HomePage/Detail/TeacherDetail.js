import React, { useEffect, useState } from "react";
import moment from "moment";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import "./Detail.scss";
import HomeHeader from "../HomeHeader";
import HomeFooter from "../HomeFooter";
import Loading from "../../../utils/Loading";

import { getTeacherHomePageAPI } from "../../../services/teacherService";
import convertBufferToBase64 from "../../../utils/convertBufferToBase64";
import Schedule from "../Schedule/Schedule";
import { getScheduleByIdAndDate } from "../../../services/scheduleService";
import { dateFormat, path } from "../../../utils/constant";
import checkRealTime from "../../../utils/checkRealTime";
import Navigate from "../NavigateCustom";
import avatar from "../../../assets/image/uet.png";
import BookingModal from "./BookingModal";
import { updateStudent } from "../../../services/studentService";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { logOutHomePageApi } from "../../../services/userService";
import { logOutUser } from "../../../redux/studentSlice";
import {
  createBookingScheduleService,
  getBookingSchedule,
} from "../../../services/bookingService";
import checkBookedSchedule from "../../../utils/checkBookedSchedule";

const TeacherDetail = () => {
  const [loading, setLoading] = useState(false);
  const [teacherId, setTeacherId] = useState({});
  const [timeDataApi, setTimeDataApi] = useState(null);

  const [openModalSchedule, setOpenModalSchedule] = useState(false);
  const [dataModalSchedule, setDataModalSchedule] = useState({});

  const { id } = useParams();
  const date_now = moment(new Date()).format(dateFormat.SEND_TO_SERVER);

  const navigate = useSelector((state) => state.navigateReducer.navigate);
  const currentStudent = useSelector((state) => state.studentReducer);
  console.log({ timeDataApi });

  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigateHomePage = useNavigate();

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
      studentId,
      date,
      actionId,
    });
    if (bookingSelected.codeNumber === 0) {
      console.log(bookingSelected.bookingSchedule);
      if (bookingSelected?.bookingSchedule?.length > 0) {
        bookingSelected.bookingSchedule.forEach((item) => {
          bookingScheduleData.push(item?.timeDataBooking?.valueVn);
        });
        getTime = checkBookedSchedule(getTime, bookingScheduleData);
      }
    }
    return getTime;
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(async () => {
      const res = await getTeacherHomePageAPI.getTeacherById({ id: +id });
      let managerId;
      if (res?.codeNumber === 0) {
        const { data } = res;
        managerId = data?.id;
        const image = data?.image?.data;
        if (image) {
          data.image = convertBufferToBase64(data?.image?.data);
        }
        setTeacherId(data);
      }
      const data = await getScheduleByIdAndDate.get({
        userId: +id,
        date: date_now,
      });
      if (data?.codeNumber === 0) {
        if (data?.schedule?.length === 0) {
          setTimeDataApi(
            "Giảng viên không có lịch ngày hôm nay, vui lòng chọn thời gian khác."
          );
        } else {
          let getTime = [];
          data?.schedule.forEach((item) => {
            getTime.push({
              timeType: item?.timeType,
              valueTime: item?.timeData?.valueVn,
            });
          });
          getTime = checkRealTime(getTime);
          // let bookingScheduleData = [];
          // const bookingSelected = await getBookingSchedule.get({
          //   departmentId,
          //   studentId: currentStudent?.id,
          //   date: date_now,
          // });
          // if (bookingSelected.codeNumber === 0) {
          //   console.log(bookingSelected.bookingSchedule);
          //   if (bookingSelected?.bookingSchedule?.length > 0) {
          //     bookingSelected.bookingSchedule.forEach((item) => {
          //       bookingScheduleData.push(item?.timeDataBooking?.valueVn);
          //     });
          //     getTime = checkBookedSchedule(getTime, bookingScheduleData);
          //   }
          // }
          getTime = getBookingScheduleNotSelected(
            getTime,
            managerId,
            "R5",
            currentStudent?.id,
            date_now,
            "A1"
          );

          setTimeDataApi(getTime);
        }
      }

      setLoading(false);
    }, 1000);
  }, []);

  const loadTimeOfDate = async (value) => {
    const userId = +id;
    const date = value;
    const data = await getScheduleByIdAndDate.get({ userId, date });
    if (data?.codeNumber === 0) {
      if (data?.schedule?.length === 0) {
        setTimeDataApi(
          "Giảng viên không có lịch ngày hôm nay, vui lòng chọn thời gian khác."
        );
      } else {
        console.log("check res\n" + JSON.stringify(data));

        let getTime = [];
        data?.schedule.forEach((item) => {
          getTime.push({
            timeType: item?.timeType,
            valueTime: item?.timeData?.valueVn,
          });
        });
        if (date === date_now) {
          getTime = checkRealTime(getTime);
        }
        // let bookingScheduleData = [];
        // const bookingSelected = await getBookingSchedule.get({
        //   departmentId: teacherId?.id,
        //   studentId: currentStudent?.id,
        //   date,
        // });
        // if (bookingSelected.codeNumber === 0) {
        //   if (bookingSelected?.bookingSchedule?.length > 0) {
        //     bookingSelected.bookingSchedule.forEach((item) => {
        //       bookingScheduleData.push(item?.timeDataBooking?.valueVn);
        //     });
        //     getTime = checkBookedSchedule(getTime, bookingScheduleData);
        //   }
        // }
        getTime = getBookingScheduleNotSelected(
          getTime,
          teacherId?.id,
          "R5",
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
    const {
      email,
      phoneNumber,
      managerId,
      roleManager,
      studentId,
      date,
      timeType,
      reason,
    } = data;
    updateStudent
      .update(
        {},
        {
          email,
          phoneNumber,
        }
      )
      .then((data) => {
        console.log(data);
        if (data?.codeNumber === -1) {
          toast.error(`${t("system.notification.fail")}`, {
            autoClose: 2000,
            position: "bottom-right",
            theme: "colored",
          });
          setLoading(false);
        } else if (data?.codeNumber === -2) {
          toast.error(`${t("system.token.mess")}`, {
            autoClose: 3000,
            position: "bottom-right",
            theme: "colored",
          });
          setTimeout(() => {
            logOutHomePageApi.logoutUser({}).then((data) => {
              if (data?.codeNumber === 0) {
                dispatch(logOutUser());
                navigateHomePage(
                  `${path.HOMEPAGE}/${path.login_homepage}?redirect=/homepage`
                );
              } else {
              }
            });
          }, 3000);
        } else if (data?.codeNumber === 1) {
          toast.error(data?.message, {
            autoClose: 2000,
            position: "bottom-right",
            theme: "colored",
          });
          setLoading(false);
        } else {
          createBookingScheduleService
            .create(
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
            )
            .then(async (res) => {
              if (res?.codeNumber === 0) {
                setOpenModalSchedule(false);
                if (res?.type === "create") {
                  toast.success(res?.message, {
                    autoClose: 2000,
                    position: "bottom-right",
                    theme: "colored",
                  });
                } else {
                  toast.error(res?.message, {
                    autoClose: 2000,
                    position: "bottom-right",
                    theme: "colored",
                  });
                }

                let filterSchedule = [];
                // let bookingScheduleData = [];
                // const bookingSelected = await getBookingSchedule.get({
                //   managerId,
                //   studentId: currentStudent?.id,
                //   date,
                // });
                // if (bookingSelected.codeNumber === 0) {
                //   if (bookingSelected?.bookingSchedule?.length > 0) {
                //     bookingSelected.bookingSchedule.forEach((item) => {
                //       bookingScheduleData.push(item?.timeDataBooking?.valueVn);
                //     });
                //     filterSchedule = checkBookedSchedule(
                //       timeDataApi,
                //       bookingScheduleData
                //     );
                //   }
                // }

                filterSchedule = getBookingScheduleNotSelected(
                  timeDataApi,
                  managerId,
                  "R5",
                  currentStudent?.id,
                  date,
                  "A1"
                );

                setTimeDataApi(filterSchedule);
                setLoading(false);
              } else if (res?.codeNumber === 1) {
                toast.error(res?.message, {
                  autoClose: 2000,
                  position: "bottom-right",
                  theme: "colored",
                });
                setLoading(false);

                //  getUserApi.getUserByRole({ role: "R2" }).then((data) => {
                //    if (data?.codeNumber === 0) {
                //      setUsers(data.user);
                //      setLoading(false);
                //      setDataUserDelete("");
                //      setIsDeleteUser(false);
                //      toast.success(`${t("system.notification.delete")}`, {
                //        autoClose: 2000,
                //        position: "bottom-right",
                //        theme: "colored",
                //      });
                //    }
                //  });
              }
            });
        }
      });
  };

  // 1685246400000;
  return (
    <>
      {loading ? (
        <Loading type="loading-schedule" />
      ) : (
        <div style={{ width: "100vw", height: "100vh", overflow: "scroll" }}>
          <HomeHeader />
          <ToastContainer />
          <div className="detail-container detail-teacher-container">
            <div className="detail-navbar w-full">
              <Navigate texts={navigate} />
            </div>
            <div className="detail-teacher">
              <div
                className="detail-teacher-avatar flex-3"
                style={{
                  backgroundImage: `url(${
                    teacherId?.image ? teacherId?.image : avatar
                  })`,
                }}
              ></div>
              <div className="detail-teacher-content flex-1">
                <p className="detail-teacher-content-name">
                  {teacherId?.positionData?.valueVn}, {teacherId?.fullName}
                </p>
                <p>{teacherId?.markdownData_teacher?.description}</p>
              </div>
            </div>
            <Schedule
              change={loadTimeOfDate}
              timeData={timeDataApi}
              teacher={teacherId}
              handleSchedule={handleSchedule}
            />
            <div
              className="description-teacher"
              dangerouslySetInnerHTML={{
                __html: teacherId?.markdownData_teacher?.markdownHtml,
              }}
            ></div>
            {/* <div className="comment-teacher w-full h-4 py-2 mb-3 flex items-center justify-center">
              Comment
            </div> */}
          </div>
          <HomeFooter />
        </div>
      )}
      {openModalSchedule && (
        <BookingModal
          close={closeModalSchedule}
          dataModalSchedule={dataModalSchedule}
          teacherId={teacherId}
          create={createBookingSchedule}
        />
      )}

      {openModalSchedule && (
        <div className="modal-schedule-overplay fixed top-0 bottom-0 left-0 right-0 w-full max-h-full bg-black bg-opacity-25"></div>
      )}
    </>
  );
};

export default TeacherDetail;
