import React from "react";
import "./Health.scss";

import bgOne from "../../../assets/image/6824625.jpg";
import bgTwo from "../../../assets/image/6774827.jpg";

const Health = () => {
  return (
    <div className="section-container health-container w-full h-auto">
      <div className="section-content">
        <div className="section-header flex items-center justify-between">
          <div className="section-header-text">Về sức khoẻ sinh viên</div>
        </div>

        <div className="section-body health-body flex items-center gap-3">
          <div className="section-item-health flex-1">
            <div className="item">
              <div
                className="section-item-img-health"
                style={{ backgroundImage: `url(${bgOne})` }}
              ></div>
              <div className="section-item-text-health">
                Tư vấn, hỏi đáp và đặt lịch khám sức khoẻ
              </div>
            </div>
          </div>

          <div className="section-item-health flex-1">
            <div className="item">
              <div className="section-item-text-health">
                <span>Tư vấn, hỏi đáp và đặt lịch về vấn đề tâm lý</span>
              </div>
              <div
                className="section-item-img-health "
                style={{ backgroundImage: `url(${bgTwo})` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Health;
