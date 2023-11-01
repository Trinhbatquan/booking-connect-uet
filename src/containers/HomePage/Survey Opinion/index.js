import React, { useState, useEffect } from "react";
import HomeHeader from "../HomeHeader";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import {
  getFeedback,
  getPreviousFeedback,
  saveFeedback,
} from "../../../services/student_feedback";
import { handleMessageFromBackend } from "../../../utils/handleMessageFromBackend";
import { logOutApi } from "../../../services/userService";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logOutUser } from "../../../redux/studentSlice";
import { path } from "../../../utils/constant";
import { RiDeleteBack2Fill } from "react-icons/ri";
import Loading from "../../../utils/Loading";

import { HiOutlinePencilAlt } from "react-icons/hi";
import { BsHouseGear } from "react-icons/bs";
import { TbApps } from "react-icons/tb";
import { BiBookAlt, BiMicrochip, BiMicrophone } from "react-icons/bi";
import { FaMicrophone, FaStreetView } from "react-icons/fa";

const SurveyOpinion = () => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state) => state.studentReducer);

  const [totalFeedBack, setTotalFeedback] = useState(0);
  //handle student survey
  const [system, setSystem] = useState("");
  const [infrastructure, setInfrastructure] = useState("");
  const [educationQuality, setEducationQuality] = useState("");
  const [schoolActivities, setSchoolActivities] = useState("");

  //student survey

  useEffect(() => {
    getFeedback().then((data) => {
      if (data?.codeNumber === 0) {
        setTotalFeedback(data?.count);
      } else {
        toast.error(
          i18n.language === "en" ? data?.message_en : data?.message_vn,
          {
            autoClose: 3000,
            theme: "colored",
            position: "bottom-right",
          }
        );
      }
      setLoading(false);
    });
  }, []);

  const handleClearFeedback = () => {
    setSystem("");
    setInfrastructure("");
    setEducationQuality("");
    setSchoolActivities("");
  };

  const getPreviousFeedBack = () => {
    setLoading(true);
    getPreviousFeedback({}).then((data) => {
      if (data?.codeNumber === 0) {
        const { system, infrastructure, education_quality, school_activities } =
          data?.feedback;
        setSystem(system);
        setInfrastructure(infrastructure);
        setEducationQuality(education_quality);
        setSchoolActivities(school_activities);
        setLoading(false);
      } else {
        const response = handleMessageFromBackend(data, i18n.language);
        if (data?.codeNumber === 1) {
          setLoading(false);

          toast.info(response, {
            autoClose: 3000,
            theme: "colored",
            position: "bottom-right",
          });
        } else {
          setLoading(false);

          toast.error(response, {
            autoClose: 3000,
            theme: "colored",
            position: "bottom-right",
          });
        }
        if (data?.codeNumber === -2) {
          setTimeout(() => {
            logOutApi.logoutUser({}).then((data) => {
              if (data?.codeNumber === 0) {
                dispatch(logOutUser());
                navigate(
                  `${path.SYSTEM}/${path.LOGIN_SYSTEM}?redirect=/system`
                );
              }
            });
          }, 5000);
        }
      }
    });
  };

  const handleStudentSurvey = () => {
    if (!system || !infrastructure || !educationQuality || !schoolActivities) {
      toast.info(
        i18n.language === "en"
          ? "You need enter all fields"
          : "Bạn cần nhập tất cả các trường.",
        {
          autoClose: 3000,
          theme: "colored",
          position: "bottom-right",
        }
      );
      return;
    } else {
      setLoading(true);

      saveFeedback(
        {},
        {
          email: currentUser?.email,
          system,
          infrastructure,
          educationQuality,
          schoolActivities,
        }
      ).then((data) => {
        if (data?.codeNumber === 0) {
          setLoading(false);

          setSystem("");
          setInfrastructure("");
          setEducationQuality("");
          setSchoolActivities("");

          toast.success(
            i18n.language === "en" ? data?.message_en : data?.message_vn,
            {
              autoClose: 3000,
              theme: "colored",
              position: "bottom-right",
            }
          );
        } else {
          const response = handleMessageFromBackend(data, i18n.language);
          setLoading(false);

          toast.error(response, {
            autoClose: 3000,
            theme: "colored",
            position: "bottom-right",
          });
          if (data?.codeNumber === -2) {
            setTimeout(() => {
              logOutApi.logoutUser({}).then((data) => {
                if (data?.codeNumber === 0) {
                  dispatch(logOutUser());
                  navigate(
                    `${path.SYSTEM}/${path.LOGIN_SYSTEM}?redirect=/system`
                  );
                }
              });
            }, 5000);
          }
        }
      });
    }
  };

  return (
    <div>
      {loading && (
        <div className="fixed loading-overlay top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25">
          <div className="absolute">
            <Loading />
          </div>
        </div>
      )}
      <ToastContainer />
      <HomeHeader />
      <div className="w-full h-[100px]"></div>
      <div className="content-inform py-[20px] my-[5px] px-[10%] mx-auto flex items-start justify-center gap-6">
        <div className="mx-auto w-[70%]">
          <h2 className="text-blurThemeColor font-semibold text-3xl pb-[19px] border-b-2 border-gray-300">
            {t("header.survey")}
          </h2>
          <div className=" pb-6 flex flex-col bg-white rounded-lg  mx-auto mt-4 py-3">
            <span className=" text-blurThemeColor my-2 text-lg flex items-start justify-start gap-1">
              <HiOutlinePencilAlt className="text-blurThemeColor text-3xl" />
              {i18n.language === "en"
                ? "Your feedback will be collected and evaluated to improve system's experience and educational quality of school."
                : "Phản hồi của bạn sẽ được thu thập và đánh giá nhằm nâng cao trải nghiệm hệ thống và chất lượng giảng dạy của nhà trường"}
            </span>
            <div className="feedback_system mt-4 w-full flex flex-col items-start justify-start gap-2 py-2 relative">
              <label className="w-[280px] font-semibold text-headingColor max-w-[280px] flex items-start justify-start gap-1.5">
                <TbApps className="text-xl" />{" "}
                {i18n.language === "en" ? "About system:" : "Về hệ thống:"}
              </label>
              <textarea
                autoComplete="false"
                className={` flex-1 shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light
                                      `}
                value={system}
                rows="4"
                name="feedback"
                placeholder={
                  i18n.language === "en"
                    ? "How do you feel when using this system? Does it bring lots of values for you? Which are those?"
                    : "Bạn cảm thấy như thế nào khi sử dụng hệ thống? Nó có mang lại nhiều giá trị cho bạn không? Những giá trị đó là gì?"
                }
                onChange={(e) => setSystem(e.target.value)}
              />
            </div>
            <div className="feedback_system mt-4 w-full flex flex-col items-start justify-start gap-2 py-2 relative">
              <label className="w-[280px] font-semibold text-headingColor max-w-[280px] flex items-start justify-start gap-1.5">
                <BsHouseGear className="text-xl" />{" "}
                {i18n.language === "en"
                  ? "About infrastructure of school:"
                  : "Về cơ sở vật chất của nhà trường:"}
              </label>
              <textarea
                autoComplete="false"
                className={` flex-1 shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light
                                      `}
                value={infrastructure}
                rows="4"
                name="feedback_infrastructure"
                placeholder={
                  i18n.language === "en"
                    ? "About infrastructure of school? Do those meet your needs for education?"
                    : "Về cơ sở vật chất của nhà trường? Chúng có đáp ứng được các yêu cầu học tập của bạn?"
                }
                onChange={(e) => setInfrastructure(e.target.value)}
              />
            </div>
            <div className="feedback_system mt-4 w-full flex flex-col items-start justify-start gap-2 py-2 relative">
              <label className="w-[280px] font-semibold text-headingColor max-w-[280px] flex items-start justify-start gap-1.5">
                <BiBookAlt className="text-xl" />{" "}
                {i18n.language === "en"
                  ? "Educational quality of school:"
                  : "Chất lượng giáo dục của nhà trường:"}
              </label>
              <textarea
                autoComplete="false"
                className={` flex-1 shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light
                                      `}
                value={educationQuality}
                rows="4"
                name="feedback_quality_education"
                placeholder={
                  i18n.language === "en"
                    ? "Your feeling about courses system, educational quality and supported platform for your study?"
                    : "Cảm nhận của bạn về hệ thống các môn học, chất lượng giảng dạy và các nền tảng hỗ trợ việc học của bạn?"
                }
                onChange={(e) => setEducationQuality(e.target.value)}
              />
            </div>
            <div className="feedback_system mt-4 w-full flex flex-col items-start justify-start gap-2 py-2 relative">
              <label className="w-[280px] font-semibold text-headingColor max-w-[280px] flex items-start justify-start gap-1.5">
                <BiMicrophone className="text-xl" />{" "}
                {i18n.language === "en"
                  ? "Your common feeling about UET:"
                  : "Cảm nhận chung của bạn về UET:"}
              </label>
              <textarea
                autoComplete="false"
                className={` flex-1 shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light
                                      `}
                value={schoolActivities}
                rows="4"
                name="feedback_school"
                placeholder={
                  i18n.language === "en"
                    ? "Your personal feeling when you are a student of UET? This session will be shown into 'Student Opinion' of system."
                    : "Cảm nghĩ của bản thân bạn khi là sinh viên UET? Phần này sẽ được hiển thị trong phần 'Ý kiến sinh viên' của hệ thống đó."
                }
                onChange={(e) => setSchoolActivities(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className={`bg-orange-500 text-white mt-6 py-2 px-1 font-semibold rounded-md shadow backdrop-blur-md bg-opacity-80 hover:bg-opacity-100`}
                style={{ maxWidth: "40%", width: "40%" }}
                onClick={() => getPreviousFeedBack()}
              >
                {i18n.language === "en"
                  ? "Do you want get your previous feedback?"
                  : "Bạn muốn lấy lại bản đánh giá trước đó?"}
              </button>
              <div className="flex items-center justify-end gap-6 w-[50%]">
                <button
                  className={`bg-blurThemeColor text-white mt-6 py-2 px-1 font-semibold rounded-md shadow backdrop-blur-md bg-opacity-80 hover:bg-opacity-100`}
                  style={{ maxWidth: "30%", width: "30%" }}
                  onClick={() => handleStudentSurvey()}
                >
                  {t("system.teacher.save")}
                </button>
                <button
                  className={` text-white mt-6 py-2 px-1 font-semibold rounded-md shadow backdrop-blur-md bg-opacity-80 hover:bg-opacity-100 bg-green-600`}
                  style={{ maxWidth: "20%", width: "20%" }}
                  onClick={() => handleClearFeedback()}
                >
                  {i18n.language === "en" ? "Clear" : "Đặt lại"}
                </button>
              </div>
            </div>
            {/* <RiDeleteBack2Fill
                className="absolute top-4 right-2 text-blurThemeColor text-3xl cursor-pointer opacity-80 hover:opacity-100 transition-all duration-300"
              /> */}
          </div>
        </div>
        <div className="w-[20%] bg-blurThemeColor font-semibold text-white rounded-lg py-[8px] px-[12px] mt-4">
          <p className="text-white text-md flex items-center justify-start gap-1.5">
            <FaStreetView className="text-white text-xl" />
            {`${
              i18n.language === "en" ? "Total of opinion:" : "Tổng số ý kiến:"
            } ${totalFeedBack}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SurveyOpinion;
