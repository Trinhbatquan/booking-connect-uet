import React,{ useEffect,useState } from "react";
import moment from "moment";
import "moment/locale/vi";
import { useParams } from "react-router";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import "./Detail.scss";
import HomeHeader from "../HomeHeader";
import HomeFooter from "../HomeFooter";
import Loading from "../../../utils/Loading";
import { FaListAlt } from "react-icons/fa";
import {
  getTeacherFaculty,
  getTeacherHomePageAPI,
} from "../../../services/teacherService";
import convertBufferToBase64 from "../../../utils/convertBufferToBase64";
import Schedule from "../Schedule/Schedule";
import { getScheduleByIdAndDate } from "../../../services/scheduleService";
import { dateFormat,path } from "../../../utils/constant";
import avatar from "../../../assets/image/uet.png";
import { updateStudent } from "../../../services/studentService";
import { ToastContainer,toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  getUserApi,
  logOutApi,
  logOutHomePageApi,
} from "../../../services/userService";
import { logOutUser } from "../../../redux/studentSlice";
import {
  createBookingScheduleService,
  createQuestionService,
  getBookingSchedule,
} from "../../../services/bookingService";
import checkBookedSchedule from "../../../utils/checkBookedSchedule";
import QuestionForm from "../QuestionForm/QuestionForm";
import { emitter } from "../../../utils/emitter";
import BookingModal from "../BookingForm/BookingModal";
import { emit_create_booking } from "../../../utils/socket_client";
import { RiArrowDownSLine } from "react-icons/ri";

import Detail from "./Detail";
import { handleMessageFromBackend } from "../../../utils/handleMessageFromBackend";
import nodata from "../../../assets/image/nodata.png"



const FacultyDetail = () => {
  const [loading,setLoading] = useState(false);
  const [facultyData,setFacultyData] = useState({});
  const [timeDataApi,setTimeDataApi] = useState(null);
  const [teacherFaculty,setTeacherFaculty] = useState([]);

  const [openModalSchedule,setOpenModalSchedule] = useState(false);
  const [dataModalSchedule,setDataModalSchedule] = useState({});

  const [action,setAction] = useState("schedule");

  const [idFaculty,setIdFaculty] = useState();
  const [currentPage,setCurrentPage] = useState(1);
  const [totalPage,setTotalPage] = useState(0);


  const [search,setSearch] = useState("");


  const { code_url,roleId } = useParams();
  console.log(teacherFaculty);
  const date_tomorrow = moment(new Date())
    .add(1,"days")
    .format(dateFormat.SEND_TO_SERVER);

  // const navigate = useSelector((state) => state.navigateReducer.navigate);
  const currentStudent = useSelector((state) => state.studentReducer);
  const { t,i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      bookingSelected.bookingSchedule.forEach((item) => {
        bookingScheduleData.push(item?.timeType);
      });
      getTime = checkBookedSchedule(getTime,bookingScheduleData);
      // }
    }
    return getTime;
  };

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("auth-bookingCare-UET_student"))) {
      console.log(1);
      let managerId;

      setTimeout(async () => {
        if (+currentPage === 1) {
          setLoading(true);
          let res = await getUserApi.getUser({ code_url });
          if (res?.codeNumber === 0) {
            const { data } = res;
            // console.log(data);
            managerId = data?.id;
            setIdFaculty(managerId);
            const image = data?.image?.data;
            if (image) {
              data.image = convertBufferToBase64(data?.image?.data);
            }
            setFacultyData(data);
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
                  ? "Don't have appointment at this day, please select another time."
                  : "Không có lịch ngày hôm nay, vui lòng chọn thời gian khác."
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

              // console.log(getTime);
              setTimeDataApi(getTime);
            }
          }
          setLoading(false);

        }
        await getTeacherFaculty.get({ facultyId: managerId ? managerId : +idFaculty,page: currentPage }).then((res) => {
          if (res?.codeNumber === 0) {
            setTeacherFaculty(teacherFaculty.concat(res?.teacherByFaculty));
            setTotalPage(res?.totalTeacher);
            setCurrentPage(res?.page)
          }
        });
      },0);
    }
  },[currentPage]);



  const handleOnChangeSearch = async (e) => {
    setSearch(e.target.value);
    if (!e.target.value) {
      setLoading(true);
      await getTeacherFaculty.get({ facultyId: +idFaculty,page: 1 }).then((res) => {
        if (res?.codeNumber === 0) {
          setTeacherFaculty(res?.teacherByFaculty);
          setTotalPage(res?.totalTeacher);
        }
        setLoading(false);
      });
    }
  };

  const handleSearchTeacher = () => {
    if (search) {
      setLoading(true);
      getTeacherHomePageAPI.getTeacherBySearch({ search,option: "no_markdown",facultyId: +idFaculty }).then((data) => {
        if (data?.codeNumber === 0) {
          console.log(data);
          const { teacherData } = data;
          if (teacherData?.length > 0) {
            for (let i = 0; i < teacherData.length; i++) {
              if (teacherData[i]?.image?.data) {
                teacherData[i].image.data = convertBufferToBase64(
                  teacherData[i].image.data
                );
              }
            }
          }
          setTeacherFaculty(teacherData);
          setLoading(false);
        } else {
          setLoading(false);
          toast.error(
            i18n.language === "en" ? data?.message_en : data?.message_vn,
            {
              autoClose: 3000,
              position: "bottom-right",
              theme: "colored",
            }
          );
        }
      });
    }
  };


  const loadTimeOfDate = async (value) => {
    // console.log(value);
    const managerId = +facultyData?.id;
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
            ? "Don't have appointment at this day, please select another time."
            : "Không có lịch ngày hôm nay, vui lòng chọn thời gian khác."
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
        // console.log(getTime);
        getTime = await getBookingScheduleNotSelected(
          getTime,
          facultyData?.id,
          roleId,
          currentStudent?.id,
          date,
          "A1"
        );

        setTimeDataApi(getTime);
      }
    }
  };

  const handleSchedule = ({ timeType,valueTime },date) => {
    // console.log({ timeType, valueTime }, date);
    setOpenModalSchedule(true);
    const data = {
      currentStudent,
      timeType,
      valueTime,
      date,
    };
    // console.log(data);
    setDataModalSchedule(data);
  };

  const closeModalSchedule = () => {
    setOpenModalSchedule(false);
  };

  //create booking schedule
  const createBookingSchedule = async (data) => {
    const { email,managerId,roleManager,studentId,date,timeType,reason } =
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
      emit_create_booking(managerId,roleManager,"A1");
      emitter.emit("clear_data_booking_schedule");
      setOpenModalSchedule(false);
      setLoading(false);
      if (res?.type === "create") {
        toast.success(
          i18n.language === "en" ? res?.message_en : res?.message_vn,
          {
            autoClose: 4000,
            position: "bottom-right",
            theme: "colored",
          }
        );
      } else {
        toast.info(i18n.language === "en" ? res?.message_en : res?.message_vn,{
          autoClose: 3000,
          position: "bottom-right",
          theme: "colored",
        });
      }
      loadTimeOfDate(date);
    } else {
      setLoading(false);
      const response = handleMessageFromBackend(data,i18n.language);
      toast.error(response,{
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
        },5000);
      }
    }
  };

  //questions
  const createBooking = async (data) => {
    const body = {
      email: currentStudent?.email,
      studentId: currentStudent?.id,
      managerId: +facultyData?.id,
      roleManager: roleId,
      action: "A2",
      ...data,
    };
    setLoading(true);
    await createQuestionService.create({},body).then((res) => {
      if (res?.codeNumber === 0) {
        setLoading(false);
        if (res?.type === "create" || res?.type === "sent") {
          toast.success(
            i18n.language === "en" ? res?.message_en : res?.message_vn,
            {
              autoClose: 4000,
              position: "bottom-right",
              theme: "colored",
            }
          );
          emitter.emit("EVENT_CLEAR_DATA");
          if (res?.type === "create") {
            //socket_emit_booking_create
            emit_create_booking(+facultyData?.id,roleId,"A2");
          }
        } else {
          toast.info(
            i18n.language === "en" ? res?.message_en : res?.message_vn,
            {
              autoClose: 4000,
              position: "bottom-right",
              theme: "colored",
            }
          );

          //emitter clear data component child
        }
      } else {
        setLoading(false);
        const response = handleMessageFromBackend(data,i18n.language);
        toast.error(response,{
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
          },5000);
        }
      }
    });
  };

  return (
    <>
      <div>
        <ToastContainer />
        {loading ? (
          <div className="loading-overlay fixed top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25">
            <div className="absolute">
              <Loading />
            </div>
          </div>
        ) : (
          <>
            <div
              className="detail-container detail-teacher-container"
              style={{
                minHeight: "300px",
              }}
            >
              <div className="detail-teacher">
                <div
                  className="detail-teacher-avatar flex-3"
                  style={{
                    backgroundImage: `url(${roleId === "R5"
                      ? facultyData?.image
                        ? facultyData?.image
                        : avatar
                      : avatar
                      })`,
                  }}
                ></div>
                <div className="detail-teacher-content flex-1">
                  <p className="detail-teacher-content-name">
                    {`${roleId === "R5"
                      ? `${facultyData?.positionData?.valueVn}
                          ,
                          ${facultyData?.fullName}
                        `
                      : facultyData?.fullName
                      }`}
                  </p>
                  <p>
                    {roleId === "R5"
                      ? facultyData?.markdownData_teacher?.description
                      : facultyData?.markdownData_other?.description}
                  </p>
                </div>
              </div>
              <div className="action-select">
                <button
                  type="button"
                  class={`hover:bg-blue-800 hover:text-white rounded-lg focus:ring-4 focus:ring-blue-300 font-medium  text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
                ${action === "schedule"
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
                ${action === "question"
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
                  change={loadTimeOfDate}
                  timeData={timeDataApi}
                  teacher={facultyData}
                  handleSchedule={handleSchedule}
                />
              )}
              {action === "question" && <QuestionForm create={createBooking} />}
              <div
                className="description-teacher"
                dangerouslySetInnerHTML={
                  roleId === "R5"
                    ? {
                      __html: facultyData?.markdownData_teacher?.markdownHtml,
                    }
                    : {
                      __html: facultyData?.markdownData_other?.markdownHtml,
                    }
                }
              ></div>
            </div>

            <div
              className="list-teacher flex flex-col gap-3 items-center justify-start py-[15px]"
              style={{ width: "100%",backgroundColor: "#eee" }}
            >
              <div className="w-full px-[15%] mx-auto flex flex-col items-start justify-start gap-4">
                <div className="flex items-center justify-between w-full">
                  <div
                    className="p-[10px] rounded-lg flex items-center justify-center gap-2"
                    style={{
                      color: "blue",
                      backgroundColor: "#fff",
                      border: "1px solid #d4d8dd",
                      fontSize: "17px",
                      fontWeight: "bold",
                    }}
                  >
                    <FaListAlt className="text-blue text-2xl" />
                    {i18n.language === "en"
                      ? "Teacher List"
                      : "Danh sách giảng viên"}
                  </div>
                  <div className="w-[35%]">
                    <label
                      for="default-search"
                      class="mb-2 text-md font-medium text-gray-900 sr-only dark:text-white"
                    >
                      {i18n.language === "en" ? "Search" : "Tìm kiếm"}
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          class="w-4 h-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 20"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                          />
                        </svg>
                      </div>
                      <input
                        type="search"
                        id="default-search"
                        class="block w-full p-4 pl-10 text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder={
                          i18n.language === "en"
                            ? "Teacher Name of Faculty..."
                            : "Tên giảng viên trong khoa/viện..."
                        }
                        value={search}
                        onChange={(e) => handleOnChangeSearch(e)}
                        required
                      />
                      <button
                        type="submit"
                        class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={() => handleSearchTeacher()}
                      >
                        {i18n.language === "en" ? "Search" : "Tìm kiếm"}
                      </button>
                    </div>
                  </div>
                </div>
                {teacherFaculty?.length > 0 ? (
                  teacherFaculty.map((item,index) => {
                    return (
                      <div
                        className="w-full flex items-center justify-start gap-1 flex-1 p-[15px]"
                        key={index}
                        style={{
                          backgroundColor: "#fff",
                          boxShadow: "0 1px 6px rgba(32,33,36,0.28)",
                          borderRadius: "8px",
                          borderBottom: "none",
                        }}
                      >
                        <Detail
                          codeUrlTeacher={item?.code_url}
                          roleTeacher="R5"
                          type="faculty"
                        />
                      </div>
                    );
                  })
                ) : <img
                  src={nodata}
                  alt=""
                  style={{
                    height: "300px",
                    width: "70%",
                    objectFit: "cover",
                    margin: "0 auto",
                  }}
                />}
                {teacherFaculty?.length < +totalPage && !search && (
                  <div className="flex items-center justify-center mb-[20px] mx-auto">
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
                      onClick={() => setCurrentPage(currentPage + 1)}
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
            </div>

            <HomeFooter />
          </>
        )}

      </div>
      {openModalSchedule && (
        <BookingModal
          close={closeModalSchedule}
          dataModalSchedule={dataModalSchedule}
          userData={facultyData}
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

export default FacultyDetail;
