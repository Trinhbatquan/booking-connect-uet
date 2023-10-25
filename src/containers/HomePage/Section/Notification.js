import React from "react";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";

import { useState, useEffect } from "react";

import "./Notification.scss";
import { path } from "../../../utils/constant";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setNavigate } from "../../../redux/navigateSlice";
import { getNotiFy } from "../../../services/notificationService";
import convertBufferToBase64 from "../../../utils/convertBufferToBase64";

const Notification = ({ settings }) => {
  const [notificationData, setNotificationData] = useState([]);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    getNotiFy.getHomePageLimited({}).then((data) => {
      if (data.codeNumber === 0) {
        const notifyLimited = data?.notifyHomePageLimited;
        if (notifyLimited?.length > 0) {
          for (let i = 0; i < notifyLimited?.length; i++) {
            if (notifyLimited[i]?.image?.data) {
              notifyLimited[i].image.data = convertBufferToBase64(
                notifyLimited[i].image.data
              );
            }
          }
        }
        setNotificationData(notifyLimited);
      }
    });
  }, []);
  const handleNotificationSelected = (id) => {};
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
        <div className="section-body-notification">
          <Slider {...settings}>
            {notificationData?.length > 0 &&
              notificationData.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="section-item-notification"
                    onClick={() => handleNotificationSelected(item)}
                  >
                    <div className="section-item-img-notification">
                      <div
                        className="img"
                        style={{
                          backgroundImage: `url(${
                            item?.image?.data
                              ? item.image.data
                              : "https://uet.vnu.edu.vn/wp-content/uploads/2018/01/GetArticleImage.jpg"
                          })`,
                        }}
                      ></div>
                    </div>
                    <div className="section-item-text-notification text-headingColor">
                      {item?.title}
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

export default Notification;
