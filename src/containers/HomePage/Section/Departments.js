import React from "react";
import Slider from "react-slick";

const Departments = ({ settings }) => {
  return (
    <div className="section-container department-container w-full h-auto">
      <div className="section-content">
        <div className="section-header flex items-center justify-between">
          <div className="section-header-text">Liên hệ tới các phòng ban</div>
          <button
            className="section-header-button outline-none border-none bg-blurColor text-headingColor bg-opacity-30 shadow-sm 
          backdrop-blur-sm hover:bg-blue-800 hover:text-white"
          >
            XEM THÊM
          </button>
        </div>
        <div className="section-body">
          <Slider {...settings}>
            <div className="section-item">
              <div className="section-item-img rounded-md shadow-sm shadow-cyan-600"></div>
              <div className="section-item-text text-headingColor">
                Tester 1
              </div>
            </div>
            <div className="section-item">
              <div className="section-item-img rounded-md shadow-sm shadow-cyan-600"></div>
              <div className="section-item-text text-headingColor">
                Tester 2
              </div>
            </div>
            <div className="section-item">
              <div className="section-item-img rounded-md shadow-sm shadow-cyan-600"></div>
              <div className="section-item-text text-headingColor">
                Tester 3
              </div>
            </div>
            <div className="section-item">
              <div className="section-item-img rounded-md shadow-sm shadow-cyan-600"></div>
              <div className="section-item-text text-headingColor">
                Tester 4
              </div>
            </div>
            <div className="section-item">
              <div className="section-item-img rounded-md shadow-sm shadow-cyan-600"></div>
              <div className="section-item-text text-headingColor">
                Tester 5
              </div>
            </div>
            <div className="section-item">
              <div className="section-item-img rounded-md shadow-sm shadow-cyan-600"></div>
              <div className="section-item-text text-headingColor">
                Tester 6
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Departments;
