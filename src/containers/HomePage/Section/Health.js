import React from "react";
import "./Health.scss";

import { useTranslation } from "react-i18next";

import bgFour from "../../../assets/image/other.jpg";
import bgThree from "../../../assets/image/test.jpg";

const Health = () => {
  const { t } = useTranslation();

  const data = [
    "https://i-vn.joboko.com/okoimg/vieclam.uet.vnu.edu.vn/xurl/images/image-1.png",
    "https://i-vn.joboko.com/okoimg/vieclam.uet.vnu.edu.vn/xurl/images/image-4.png",
  ];
  return (
    <div className="section-container health-container w-full h-auto">
      <div className="section-content">
        <div className="section-header flex items-center justify-between">
          <div className="section-header-text">
            {t("header.health-student")}
          </div>
        </div>

        <div className="flex items-center justify-center gap-5 mx-auto">
          <div className="section-item-health">
            <div className="item">
              <div
                className="section-item-img-health"
                style={{ backgroundImage: `url(${data[0]})` }}
              ></div>
              <div className="section-item-text-health">
                Tư vấn, hỏi đáp và đặt lịch khám sức khoẻ
              </div>
            </div>
          </div>

          <div className="section-item-health">
            <div className="item">
              <div
                className="section-item-img-health "
                style={{ backgroundImage: `url(${data[1]})` }}
              ></div>
              <div className="section-item-text-health">
                Tư vấn, hỏi đáp và đặt lịch về vấn đề tâm lý
              </div>
            </div>
          </div>
          <div className="section-item-health">
            <div className="item">
              <div
                className="section-item-img-health"
                style={{ backgroundImage: `url(${bgThree})` }}
              ></div>
              <div className="section-item-text-health">
                Trắc nghiệm khách quan về tâm lý
              </div>
            </div>
          </div>
          <div className="section-item-health">
            <div className="item">
              <div
                className="section-item-img-health"
                style={{ backgroundImage: `url(${bgFour})` }}
              ></div>
              <div className="section-item-text-health">Khác</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Health;
