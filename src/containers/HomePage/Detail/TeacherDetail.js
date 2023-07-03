import React, { useEffect, useState } from "react";
import moment from "moment";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

import "./Detail.scss";
import HomeHeader from "../HomeHeader";
import HomeFooter from "../HomeFooter";
import Loading from "../../../utils/Loading";

import { getTeacherHomePageAPI } from "../../../services/teacherService";
import convertBufferToBase64 from "../../../utils/convertBufferToBase64";
import Schedule from "../Schedule/Schedule";
import { getScheduleByIdAndDate } from "../../../services/scheduleService";
import { dateFormat } from "../../../utils/constant";
import checkRealTime from "../../../utils/checkRealTime";
import Navigate from "../NavigateCustom";
import avatar from "../../../assets/image/uet.png";
import ScheduleModal from "./ScheduleModal";

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
  console.log({ teacherId });

  useEffect(() => {
    setLoading(true);
    setTimeout(async () => {
      const res = await getTeacherHomePageAPI.getTeacherById({ id: +id });
      if (res?.codeNumber === 0) {
        const { data } = res;
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
            getTime.push(item?.timeData?.valueVn);
          });
          getTime = checkRealTime(getTime);
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
        let getTime = [];
        data?.schedule.forEach((item) => {
          getTime.push(item?.timeData?.valueVn);
        });
        if (date === date_now) {
          getTime = checkRealTime(getTime);
        }
        setTimeDataApi(getTime);
      }
    }
  };

  const handleSchedule = (time, date) => {
    console.log(time, date);
    setOpenModalSchedule(true);
    const data = {
      currentStudent,
      time,
      date,
    };
    console.log(data);
    setDataModalSchedule(data);
  };

  const closeModalSchedule = () => {
    setOpenModalSchedule(false);
  };

  // 1685246400000;
  return (
    <>
      {loading ? (
        <Loading type="loading-schedule" />
      ) : (
        <div style={{ width: "100vw", height: "100vh", overflow: "scroll" }}>
          <HomeHeader />
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
        <ScheduleModal
          close={closeModalSchedule}
          dataModalSchedule={dataModalSchedule}
        />
      )}

      {openModalSchedule && (
        <div className="fixed z-40 top-0 bottom-0 left-0 right-0 w-full max-h-full bg-black bg-opacity-25"></div>
      )}
    </>
  );
};

export default TeacherDetail;
