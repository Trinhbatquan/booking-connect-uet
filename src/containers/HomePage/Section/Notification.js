import React from "react";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";
const Notification = ({ settings }) => {
  const { t } = useTranslation();
  return (
    <div className="section-container notification-container w-full h-auto">
      <div className="section-content">
        <div className="section-header flex items-center justify-between">
          <div className="section-header-text">{t("header.notification")}</div>
          <button
            className="section-header-button outline-none border-none bg-blurColor text-headingColor bg-opacity-30 shadow-sm 
          backdrop-blur-sm hover:bg-blue-800 hover:text-white transition-all duration-300"
          >
            {t("header.see-all")}
          </button>
        </div>
        <div className="section-body">
          <Slider {...settings}>
            <div className="section-item notification-item">
              <div className="section-item-img rounded-md shadow-sm shadow-cyan-600"></div>
              <div className="section-item-text text-headingColor">
                Tester 1
              </div>
            </div>
            <div className="section-item notification-item">
              <div className="section-item-img rounded-md shadow-sm shadow-cyan-600"></div>
              <div className="section-item-text text-headingColor">
                Tester 2
              </div>
            </div>
            <div className="section-item notification-item">
              <div className="section-item-img rounded-md shadow-sm shadow-cyan-600"></div>
              <div className="section-item-text text-headingColor">
                Tester 3
              </div>
            </div>
            <div className="section-item notification-item">
              <div className="section-item-img rounded-md shadow-sm shadow-cyan-600"></div>
              <div className="section-item-text text-headingColor">
                Tester 4
              </div>
            </div>
            <div className="section-item notification-item">
              <div className="section-item-img rounded-md shadow-sm shadow-cyan-600"></div>
              <div className="section-item-text text-headingColor">
                Tester 5
              </div>
            </div>
            <div className="section-item notification-item">
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

export default Notification;
