import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { getTeacherHomePageAPI } from "../../../services/teacherService";
import Loading from "./../../../utils/Loading";
import {
  getTopTenTeacherFailed,
  getTopTenTeacherSucceed,
} from "../../../redux/teacherSlice";
import convertBufferToBase64 from "../../../utils/convertBufferToBase64";
import { path } from "../../../utils/constant";
import { setNavigate } from "../../../redux/navigateSlice";

import { useTranslation } from "react-i18next";

const Teacher = ({ settings }) => {
  const [loading, setLoading] = useState(false);
  const [topTeacher, setTopTeacher] = useState([]);

  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const teachers = useSelector((state) => state.teacherReducer.topTenTeachers);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      getTeacherHomePageAPI.getTeacher({ limit: 10 }).then((data) => {
        if (data?.codeNumber !== 0) {
          alert(data?.message);
          // dispatch(getTopTenTeacherFailed());
        } else {
          // dispatch(getTopTenTeacherSucceed(data?.teacher));
          console.log({ data });
          setTopTeacher(data?.teacher);
          setLoading(false);
        }
      });
    }, 1000);
  }, []);

  const handleDetailTeacher = (id) => {
    navigate(`${path.detail_teacher_id}/${id}`);
    dispatch(setNavigate("navigate.teacher"));
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
          >
            {t("header.see-all")}
          </button>
        </div>
        <div className="section-body">
          {loading && <Loading />}
          <Slider {...settings}>
            {topTeacher?.length > 0 &&
              topTeacher?.map((teacher, index) => {
                return (
                  <div
                    className="section-item"
                    key={index}
                    onClick={() => handleDetailTeacher(teacher?.id)}
                  >
                    <div className="section-item-teacher">
                      <div className="section-item-img section-item-img-teacher shadow-sm shadow-cyan-600">
                        <img
                          src={
                            teacher?.image?.data
                              ? convertBufferToBase64(teacher?.image?.data)
                              : null
                          }
                          alt="None"
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