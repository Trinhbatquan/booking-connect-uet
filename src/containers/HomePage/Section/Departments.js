import React from "react";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";

import { dataDepartments } from "../../../assets/image/index";

import { useState, useEffect } from "react";
import { getUserApi } from "../../../services/userService";

import "./Department.scss";
import { path } from "../../../utils/constant";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setNavigate } from "../../../redux/navigateSlice";

const Departments = ({ settings }) => {
  const [departmentData, setDepartmentData] = useState([]);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    getUserApi.getUserByRole({ role: "R2" }).then((data) => {
      if (data?.codeNumber === 0) {
        setDepartmentData(data.user);
      }
    });
  }, []);
  const handleDepartmentDetail = (id) => {
    navigate(`${path.detail_id}/${id}/role/R2`);
    dispatch(setNavigate("detail"));
  };
  return (
    <div className="section-container department-container w-full h-auto">
      <div className="section-content">
        <div className="section-header flex items-center justify-between">
          <div className="section-header-text">
            {t("header.contact-department")}
          </div>
          <button
            className="section-header-button outline-none border-none bg-blurColor text-headingColor bg-opacity-30 shadow-sm 
          backdrop-blur-sm hover:bg-blue-800 hover:text-white transition-all duration-300"
          >
            {t("header.see-all")}
          </button>
        </div>
        <div className="section-body-department">
          <Slider {...settings}>
            {departmentData?.length > 0 &&
              departmentData.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="section-item-department"
                    onClick={() => handleDepartmentDetail(item?.id, index)}
                  >
                    <div className="section-item-img-department">
                      <div
                        className="img"
                        style={{
                          backgroundImage: `url(${
                            dataDepartments[index]
                              ? dataDepartments[index]
                              : dataDepartments[index - 6]
                          })`,
                        }}
                      ></div>
                    </div>
                    <div className="section-item-text-department text-headingColor">
                      {item?.fullName}
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

export default Departments;
