import React from "react";

const Health = () => {
  return (
    <div className="section-container health-container w-full h-auto">
      <div className="section-content">
        <div className="section-header flex items-center justify-between">
          <div className="section-header-text">Về sức khoẻ sinh viên</div>
        </div>
        <div className="section-body health-body flex items-center justify-between">
          <div className="section-item health-item">
              <div className="section-item-img rounded-md shadow-sm shadow-cyan-600"></div>
              <div className="section-item-text text-headingColor">Tư vấn, hỏi đáp và đặt lịch khám sức khoẻ</div>
          </div>
          <div className="section-item health-item">
              <div className="section-item-img  rounded-md shadow-sm shadow-cyan-600"></div>
              <div className="section-item-text text-headingColor">Tư vấn, hỏi đáp và đặt lịch về vấn đề tâm lý</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Health;
