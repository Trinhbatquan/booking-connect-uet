import React from "react";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";

import { useState, useEffect } from "react";
import { getUserApi } from "../../../services/userService";

import "./Faculty.scss";
import { useDispatch } from "react-redux";
import { path } from "../../../utils/constant";
import { useNavigate } from "react-router";
import { setNavigate } from "../../../redux/navigateSlice";
import FacultySkeleton from "./SkeletonSection/FacultySkeleton";
import lozad from "lozad";

const Faculties = ({ settings }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const imageData = [
    "https://i-vn.joboko.com/okoimg/vieclam.uet.vnu.edu.vn/xurl/images/cate-6.svg",
    "https://i-vn.joboko.com/okoimg/vieclam.uet.vnu.edu.vn/xurl/images/cate-5.svg",
    "https://i-vn.joboko.com/okoimg/vieclam.uet.vnu.edu.vn/xurl/images/cate-4.svg",
    "https://i-vn.joboko.com/okoimg/vieclam.uet.vnu.edu.vn/xurl/images/cate-2.svg",
  ];

  const [facultyData, setFacultyData] = useState([]);

  const { t } = useTranslation();

  useEffect(() => {
    getUserApi.getUserByRole({ role: "R4" }).then((data) => {
      if (data?.codeNumber === 0) {
        console.log(data.user);
        setFacultyData(data.user);
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
  }, [facultyData]);

  const handleFacultyClick = (data) => {
    navigate(`${path.detail_id}/${data?.code_url}/ids-role/R4`);
  };

  return (
    <div className="section-container faculty-container w-full">
      <div className="section-content">
        <div className="section-header flex items-center justify-between">
          <div className="section-header-text">
            {" "}
            {t("header.contact-faculty")}
          </div>
          <button
            className="section-header-button outline-none border-none bg-blurColor text-headingColor bg-opacity-30 shadow-sm 
          backdrop-blur-sm hover:bg-blue-800 hover:text-white transition-all duration-300"
          >
            {t("header.see-all")}
          </button>
        </div>
        <div className="section-body">
          <Slider {...settings}>
            {loading
              ? new Array(8).fill(0).map((item, index) => {
                  return (
                    <div key={index} className="section-item-faculty">
                      <FacultySkeleton />
                    </div>
                  );
                })
              : facultyData?.length > 0 &&
                facultyData.map((faculty, index) => {
                  return (
                    <div
                      key={index}
                      className="section-item-faculty"
                      onClick={() => handleFacultyClick(faculty)}
                    >
                      <div className="section-item-img-faculty">
                        <img
                          className="img lozad"
                          data-src={
                            imageData[index]
                              ? imageData[index]
                              : imageData[index - 4]
                          }
                          alt=""
                        />
                      </div>
                      <div className="section-item-text-faculty text-headingColor">
                        {faculty?.fullName}
                      </div>
                    </div>
                  );
                })}

            {/* <div className="section-item">
              <div className="section-item-img rounded-md shadow-sm shadow-cyan-600"></div>
              <div className="section-item-text text-headingColor">Demo 2</div>
            </div>
            <div className="section-item">
              <div className="section-item-img rounded-md shadow-sm shadow-cyan-600"></div>
              <div className="section-item-text text-headingColor">Demo 3</div>
            </div>
            <div className="section-item">
              <div className="section-item-img rounded-md shadow-sm shadow-cyan-600"></div>
              <div className="section-item-text text-headingColor">Demo 4</div>
            </div>
            <div className="section-item">
              <div className="section-item-img rounded-md shadow-sm shadow-cyan-600"></div>
              <div className="section-item-text text-headingColor">Demo 5</div>
            </div>
            <div className="section-item">
              <div className="section-item-img rounded-md shadow-sm shadow-cyan-600"></div>
              <div className="section-item-text text-headingColor">Demo 6</div>
            </div> */}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Faculties;
