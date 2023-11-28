import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router";

import { getTeacherHomePageAPI } from "../../../services/teacherService";
import convertBufferToBase64 from "../../../utils/convertBufferToBase64";

import { useTranslation } from "react-i18next";
import TeacherSkeleton from "./SkeletonSection/TeacherSkeleton";
import lozad from "lozad";
import { path } from "../../../utils/constant";

const Teacher = ({ settings }) => {
  const [loading, setLoading] = useState(true);
  const [topTeacher, setTopTeacher] = useState([]);

  const { t } = useTranslation();

  const navigate = useNavigate();

  useEffect(() => {
    const getAPI = () => {
      console.log(2);

      getTeacherHomePageAPI.getTeacherHomePage({}).then((data) => {
        if (data?.codeNumber !== 0) {
        } else {
          // dispatch(getTopTenTeacherSucceed(data?.teacher));
          console.log({ data });
          const teacherData = data?.teacherData;
          if (teacherData?.length > 0) {
            for (let i = 0; i < teacherData.length; i++) {
              if (teacherData[i]?.image?.data) {
                teacherData[i].image.data = convertBufferToBase64(
                  teacherData[i].image.data
                );
              }
            }
          }
          setTopTeacher(teacherData);
          setLoading(false);
        }
      });
    };

    getAPI();
  }, []);

  useEffect(() => {
    console.log(1);
    const lazyLoadImg = () => {
      lozad(".lozad", {
        load: function (el) {
          el.src = el.dataset.src;
          el.onload = function () {
            el.classList.add("fade");
          };
        },
      }).observe();
    };
    lazyLoadImg();
  }, [topTeacher]);

  const handleDetailTeacher = (data) => {
    navigate(`${data?.code_url}/ids-role/R5`);
    // dispatch(setNavigate("detail"));
  };

  const handleSeeAllTeacher = () => {
    navigate(`${path.HOMEPAGE}/${path.teacher}`);
  };

  return (
    <div className="section-container teacher-container w-full h-auto">
      <div className="section-content">
        <div className="section-header flex items-center justify-between">
          <div className="section-header-text">
            {t("header.contact-teacher")}
          </div>
          <button
            className="section-header-button outline-none border-none bg-blurColor text-headingColor bg-opacity-30 shadow-sm
          backdrop-blur-sm hover:bg-blue-800 hover:text-white transition-all duration-300"
            onClick={handleSeeAllTeacher}
          >
            {t("header.see-all")}
          </button>
        </div>
        <div className="section-body">
          <Slider {...settings}>
            {loading
              ? new Array(5).fill(0).map((item, index) => {
                  return (
                    <div key={index} className="section-item">
                      <TeacherSkeleton />
                    </div>
                  );
                })
              : topTeacher?.length > 0 &&
                topTeacher?.map((teacher, index) => {
                  return (
                    <div
                      className="section-item"
                      key={index}
                      onClick={() => handleDetailTeacher(teacher)}
                    >
                      <div className="section-item-teacher">
                        <div className="section-item-img section-item-img-teacher shadow-sm shadow-cyan-600">
                          <img
                            className="lozad"
                            data-src={teacher?.image?.data}
                            alt=""
                          />
                        </div>
                        <div className="section-item-text section-item-text-teacher text-headingColor">
                          {teacher?.positionData?.valueVn}, {teacher?.fullName}
                          <p className="mx-auto mt-1">
                            {teacher?.facultyData?.fullName}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Teacher;
