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
import DepartmentSkeleton from "./SkeletonSection/DepartmentSkeleton";
import lozad from "lozad";

const Departments = ({ settings }) => {
  const [departmentData, setDepartmentData] = useState([]);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserApi.getUserByRole({ role: "R2" }).then((data) => {
      if (data?.codeNumber === 0) {
        setDepartmentData(data.user);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
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
  }, [departmentData]);

  const handleDepartmentDetail = (data) => {
    navigate(`${data?.code_url}/ids-role/R2`);
    // dispatch(setNavigate("detail"));
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
            {loading
              ? new Array(5).fill(0).map((item, index) => {
                  return (
                    <div key={index} className="section-item-department">
                      <DepartmentSkeleton />
                    </div>
                  );
                })
              : departmentData?.length > 0 &&
                departmentData.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="section-item-department"
                      onClick={() => handleDepartmentDetail(item)}
                    >
                      <div className="section-item-img-department">
                        <img
                          className="img lozad"
                          data-src={
                            dataDepartments[index]
                              ? dataDepartments[index]
                              : dataDepartments[index - 6]
                          }
                          alt=""
                        />
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
