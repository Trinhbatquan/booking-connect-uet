import React from "react";
import Slider from "react-slick";

import "./Department.scss";

const Departments = ({ settings }) => {
  return (
    <div className="section-container department-container w-full h-auto">
      <div className="section-content">
        <div className="section-header flex items-center justify-between">
          <div className="section-header-text">Liên hệ tới các phòng ban</div>
          <button
            className="section-header-button outline-none border-none bg-blurColor text-headingColor bg-opacity-30 shadow-sm 
          backdrop-blur-sm hover:bg-blue-800 hover:text-white transition-all duration-300"
          >
            XEM THÊM
          </button>
        </div>
        <div className="section-body">
          <Slider {...settings}>
            <div className="section-item-department">
              <div className="section-item-img-department">
                <div className="img"></div>
              </div>
              <div className="section-item-text-department text-headingColor">
                Ban Tư Vấn Tuyển Sinh
              </div>
            </div>
            <div className="section-item-department">
              <div className="section-item-img-department">
                <div className="img"></div>
              </div>
              <div className="section-item-text-department text-headingColor">
                Ban Tư Vấn Tuyển Sinh
              </div>
            </div>
            <div className="section-item-department">
              <div className="section-item-img-department">
                <div className="img"></div>
              </div>
              <div className="section-item-text-department text-headingColor">
                Ban Tư Vấn Tuyển Sinh
              </div>
            </div>
            <div className="section-item-department">
              <div className="section-item-img-department">
                <div className="img"></div>
              </div>
              <div className="section-item-text-department text-headingColor">
                Ban Tư Vấn Tuyển Sinh
              </div>
            </div>
            <div className="section-item-department">
              <div className="section-item-img-department">
                <div className="img"></div>
              </div>
              <div className="section-item-text-department text-headingColor">
                Ban Tư Vấn Tuyển Sinh
              </div>
            </div>
            <div className="section-item-department">
              <div className="section-item-img-department">
                <div className="img"></div>
              </div>
              <div className="section-item-text-department text-headingColor">
                Ban Tư Vấn Tuyển Sinh
              </div>
            </div>
            <div className="section-item-department">
              <div className="section-item-img-department">
                <div className="img"></div>
              </div>
              <div className="section-item-text-department text-headingColor">
                Ban Tư Vấn Tuyển Sinh
              </div>
            </div>
            <div className="section-item-department">
              <div className="section-item-img-department">
                <div className="img"></div>
              </div>
              <div className="section-item-text-department text-headingColor">
                Ban Tư Vấn Tuyển Sinh
              </div>
            </div>
            <div className="section-item-department">
              <div className="section-item-img-department">
                <div className="img"></div>
              </div>
              <div className="section-item-text-department text-headingColor">
                Ban Tư Vấn Tuyển Sinh
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Departments;
