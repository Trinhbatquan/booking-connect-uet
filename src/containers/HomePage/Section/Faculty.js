import React from "react";
import Slider from "react-slick";
import imageOne from "../../../assets/image/front.png";
import imageTwo from "../../../assets/image/mortarboard.png";
import imageThree from "../../../assets/image/ecology.png";
import imageFour from "../../../assets/image/square-root.png";

import "./Faculty.scss";

const Faculties = ({ settings }) => {
  const arr = [
    "Khoa Công nghệ thông tin",
    "Khoa Công nghệ nông nghiệp",
    "Khoa Công nghệ Xây dựng - giao thông",
    "Khoa Công Nghệ Hàng không Vũ trụ",
    "Khoa Cơ học kỹ thuật và Tự động hoá",
    "Viện Trí tuệ nhân tạo",
    "Khoa Điện tử Viễn Thông",
    "Khoa Vật lý Kĩ thuật và Công nghệ Nano",
  ];
  const imageArr = [imageOne, imageTwo, imageThree, imageFour];
  return (
    <div className="section-container faculty-container w-full h-auto">
      <div className="section-content">
        <div className="section-header flex items-center justify-between">
          <div className="section-header-text">Liên hệ tới các khoa, viện</div>
          <button
            className="section-header-button outline-none border-none bg-blurColor text-headingColor bg-opacity-30 shadow-sm 
          backdrop-blur-sm hover:bg-blue-800 hover:text-white transition-all duration-300"
          >
            XEM THÊM
          </button>
        </div>
        <div className="section-body">
          <Slider {...settings}>
            {arr.map((faculty, index) => {
              return (
                <div key={index} className="section-item-faculty">
                  <div className="section-item-img-faculty">
                    <div
                      className="img"
                      style={{
                        backgroundImage: `url(${
                          imageArr[Math.floor(Math.random() * imageArr.length)]
                        })`,
                      }}
                    ></div>
                  </div>
                  <div className="section-item-text-faculty text-headingColor">
                    {faculty}
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
