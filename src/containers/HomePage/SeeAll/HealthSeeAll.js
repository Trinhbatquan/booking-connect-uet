import React, { useEffect, useState } from "react";
import HomeHeader from "../HomeHeader";
import { useTranslation } from "react-i18next";
import HomeFooter from "../HomeFooter";
import lozad from "lozad";
import { getUserApi } from "../../../services/userService";
import { useNavigate } from "react-router";
import Loading from "./../../../utils/Loading";
import "./SeeAllTeacher.scss";
import { Link } from "react-router-dom";
import bgThree from "../../../assets/image/test.jpg";
import { path } from "../../../utils/constant";
import { BsArrowRight } from "react-icons/bs";

const HealthSeeAll = () => {
  const { i18n, t } = useTranslation();
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const data = [
    "https://i-vn.joboko.com/okoimg/vieclam.uet.vnu.edu.vn/xurl/images/image-1.png",
    "https://i-vn.joboko.com/okoimg/vieclam.uet.vnu.edu.vn/xurl/images/image-4.png",
  ];

  useEffect(() => {
    getUserApi.getUserByRole({ role: "R6" }).then((data) => {
      console.log(data);
      if (data?.codeNumber === 0) {
        setHealthData(data.user);
        setLoading(false);
      }
    });
  }, []);
  useEffect(() => {
    const lazyLoadImg = () => {
      lozad(".lozad", {
        load: function (el) {
          el.src = el.dataset.src;
          el.onload = function () {
            el.classList.add("fade");
          };
        },
      }).observe();
    };
    lazyLoadImg();
  }, [healthData]);

  const handleHealthDetail = (data) => {
    navigate(`${path.HOMEPAGE}/${data?.code_url}/ids-role/R6`);
  };

  return (
    <div>
      {loading && (
        <div className="fixed loading-overlay top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25">
          <div className="absolute">
            <Loading />
          </div>
        </div>
      )}
      <HomeHeader />
      <div className="w-full h-[100px]"></div>
      <div className="content-inform py-[20px] my-[5px] px-[10%] mx-auto">
        <h2 className="text-blurThemeColor font-semibold text-3xl pb-[19px] border-b-2 border-gray-300">
          {i18n.language === "en" ? "Student Health" : "Sức khoẻ sinh viên"}
        </h2>
        <div className="detail-inform text-headingColor flex flex-col gap-1">
          <p className="font-semibold" style={{ fontSize: "16px" }}>
            Đảm bảo sức khoẻ sinh viên là một trong những nhiệm vụ hàng đầu và
            cần thiết mà Trường Đại học Công Nghệ đặc biệt quan tâm. Không chỉ
            là về sức khoẻ thể chất mà còn là những vấn đề về mặt tâm lý.
          </p>
          <p className="" style={{ fontSize: "16px" }}>
            Hiểu được tầm quan trọng của vấn đề trên, một hệ thống hỗ trợ sức
            khoẻ sinh viên đã được phát triển. Tại đây, sinh viên được hỗ trợ
            một số công cụ giúp giám sát, phát hiện cũng như tư vấn về sức khoẻ
            một cách nhanh chóng, đơn giản và hiệu quả:
          </p>
          <p className="" style={{ fontSize: "16px" }}>
            1. Đặt lịch hẹn và các câu hỏi về sức khoẻ sinh viên.
          </p>
          <p className="" style={{ fontSize: "16px" }}>
            2. Phương pháp trắc nghiệm khách quan về vấn đề tâm lý cho sinh
            viên.
          </p>
          {healthData?.length > 1 ? (
            <>
              <div className="my-6 grid grid-cols-2 gap-8">
                <div
                  className="h-[174px] overflow-hidden flex items-center justify-center"
                  style={{
                    borderRadius: "15px",
                    background: "#f9f9f9",
                    color: "#000",
                    border: "1px solid #f3e9e9",
                  }}
                >
                  <div className="w-[40%] h-[100%] health-see-all-img">
                    <img
                      alt=""
                      data-src={data[0]}
                      className="lozad object-cover w-full h-full"
                    ></img>
                  </div>
                  <div className="health-see-all-text w-[60%] h-[100%] flex flex-col justify-between items-start">
                    <div className="w-full">
                      <p className="text_1">{healthData[0]?.fullName}</p>
                      <p className="text_2">
                        Kết nối, giải đáp và tư vấn về các vấn đề sức khoẻ của
                        sinh viên.
                      </p>
                    </div>
                    <p
                      className="cursor-pointer detail-news flex items-start justify-start w-full gap-1"
                      style={{
                        fontWeight: "600",
                        lineHeight: "1.5",
                      }}
                      onClick={() => handleHealthDetail(healthData[0])}
                    >
                      <span>
                        {i18n.language === "en" ? "See more" : "Xem thêm"}
                      </span>
                      <BsArrowRight className="button-news text-xl" />
                    </p>
                  </div>
                </div>
                <div
                  className="h-[174px] overflow-hidden flex items-center justify-center"
                  style={{
                    borderRadius: "15px",
                    background: "#f9f9f9",
                    color: "#000",
                    border: "1px solid #f3e9e9",
                  }}
                >
                  <div className="w-[40%] h-[100%] health-see-all-img">
                    <img
                      alt=""
                      data-src={data[1]}
                      className="lozad object-cover w-full h-full"
                    ></img>
                  </div>
                  <div className="health-see-all-text w-[60%] h-[100%] flex flex-col justify-between items-start">
                    <div className="w-full">
                      <p className="text_1">{healthData[1]?.fullName}</p>
                      <p className="text_2">
                        Cung cấp các phương pháp kết nối để giám sát sức khoẻ
                        bản thân.
                      </p>
                    </div>
                    <p
                      className="cursor-pointer detail-news flex items-start justify-start w-full gap-1"
                      style={{
                        fontWeight: "600",
                        lineHeight: "1.5",
                      }}
                      onClick={() => handleHealthDetail(healthData[1])}
                    >
                      <span>
                        {i18n.language === "en" ? "See more" : "Xem thêm"}
                      </span>
                      <BsArrowRight className="button-news text-xl" />
                    </p>
                  </div>
                </div>
                <div
                  className="h-[174px] overflow-hidden flex items-center justify-center"
                  style={{
                    borderRadius: "15px",
                    background: "#f9f9f9",
                    color: "#000",
                    border: "1px solid #f3e9e9",
                  }}
                >
                  <div className="w-[40%] h-[100%] health-see-all-img">
                    <img
                      alt=""
                      data-src={bgThree}
                      className="lozad object-cover w-full h-full"
                    ></img>
                  </div>
                  <div className="health-see-all-text w-[60%] h-[100%] flex flex-col justify-between items-start">
                    <div className="w-full">
                      <p className="text_1">Trắc nghiệm khách quan về tâm lý</p>
                      <p className="text_2">
                        Hướng dẫn về công cụ trắc nghiệm kèm theo các bản trắc
                        nghiệm được thiết kế.
                      </p>
                    </div>
                    <a
                      href="https://vieclam.ptithcm.edu.vn/trac-nghiem-huong-nghiep-news4541"
                      target="_blank"
                      alt=""
                      className="cursor-pointer detail-news flex items-start justify-start w-full gap-1"
                      style={{
                        fontWeight: "600",
                        lineHeight: "1.5",
                      }}
                    >
                      <span>
                        {i18n.language === "en" ? "See more" : "Xem thêm"}
                      </span>
                      <BsArrowRight className="button-news text-xl" />
                    </a>
                  </div>
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
      <HomeFooter />
    </div>
  );
};

export default HealthSeeAll;
