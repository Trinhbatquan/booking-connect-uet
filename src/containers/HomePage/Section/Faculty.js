import React from "react";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";

import { useState, useEffect } from "react";
import { getUserApi } from "../../../services/userService";

import "./Faculty.scss";

const Faculties = ({ settings }) => {
  const imageData = [
    "https://i-vn.joboko.com/okoimg/vieclam.uet.vnu.edu.vn/xurl/images/cate-6.svg",
    "https://i-vn.joboko.com/okoimg/vieclam.uet.vnu.edu.vn/xurl/images/cate-5.svg",
    "https://i-vn.joboko.com/okoimg/vieclam.uet.vnu.edu.vn/xurl/images/cate-4.svg",
    // "https://i-vn.joboko.com/okoimg/vieclam.uet.vnu.edu.vn/xurl/images/cate-1.svg",
    "https://i-vn.joboko.com/okoimg/vieclam.uet.vnu.edu.vn/xurl/images/cate-2.svg",
  ];

  const [facultyData, setFacultyData] = useState([]);

  const { t } = useTranslation();

  useEffect(() => {
    getUserApi.getUserByRole({ role: "R4" }).then((data) => {
      if (data?.codeNumber === 0) {
        console.log(data.user);
        setFacultyData(data.user);
      }
    });
  }, []);

  return (
    <div className="section-container faculty-container w-full h-auto">
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
            {facultyData?.length > 0 &&
              facultyData.map((faculty, index) => {
                return (
                  <div key={index} className="section-item-faculty">
                    <div className="section-item-img-faculty">
                      <div
                        className="img"
                        style={{
                          backgroundImage: `url(${
                            imageData[index]
                              ? imageData[index]
                              : imageData[index - 4]
                          })`,
                        }}
                      ></div>
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
