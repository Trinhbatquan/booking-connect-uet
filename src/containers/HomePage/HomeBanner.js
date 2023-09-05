import React from "react";

import { FaSearch } from "react-icons/fa";
import { BsHouses, BsDatabase } from "react-icons/bs";
import { RiHeartsLine } from "react-icons/ri";
import { GiMedicalPackAlt } from "react-icons/gi";

import { useTranslation } from "react-i18next";

// HỆ THỐNG ĐẶT LỊCH ONLINE

import "./HomeBanner.scss";

const HomeBanner = () => {
  const { t } = useTranslation();

  return (
    <div className="homepage-banner-container">
      <div class="layer"></div>
      <div className="home-page-banner-up flex flex-col items-center gap-4 pt-16">
        <div className="content-one font-semibold">
          {t("banner.contentOne")}
        </div>
        <div className="content-two">{t("banner.contentTwo")}</div>
        <div className="input flex items-center justify-center mt-8">
          <FaSearch className="text-xl mr-6 text-blue-600" />
          <input
            className="border-none bg-transparent outline-none text-blurColor"
            name="input"
            placeholder={t("banner.search")}
          />
        </div>
      </div>
      <div className="homepage-banner-down flex items-center justify-center gap-32">
        <div className="topic flex flex-col justify-start items-center">
          <BsHouses className="topic-icon text-gray-600 z-10 cursor-pointer py-3 rounded-full shadow-md backdrop-blur-md border border-blurColor" />
          <span className="topic-content  cursor-pointer text-xl">
            {t("banner.department")}
          </span>
        </div>
        <div className="topic flex flex-col justify-start items-center">
          <BsDatabase className="topic-icon text-gray-600 z-10 cursor-pointer py-3 rounded-full shadow-md backdrop-blur-md border border-blurColor" />
          <span className="topic-content  cursor-pointer text-xl">
            {t("banner.faculty")}
          </span>
        </div>
        <div className="topic flex flex-col justify-start items-center">
          <BsDatabase className="topic-icon text-gray-600 z-10 cursor-pointer py-3 rounded-full shadow-md backdrop-blur-md border border-blurColor" />
          <span className="topic-content  cursor-pointer text-xl">
            {t("banner.teacher")}
          </span>
        </div>
        <div className="topic flex flex-col justify-start items-center">
          <GiMedicalPackAlt className="topic-icon text-gray-600 z-10 cursor-pointer py-3 rounded-full shadow-md backdrop-blur-md border border-blurColor" />
          <span className="topic-content  cursor-pointer text-xl">
            {t("banner.health")}
          </span>
        </div>
        <div className="topic flex flex-col justify-start items-center">
          <RiHeartsLine className="topic-icon text-gray-600 z-10 cursor-pointer py-3 rounded-full shadow-md backdrop-blur-md border border-blurColor" />
          <span className="topic-content  cursor-pointer text-xl">
            {t("banner.mental")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
