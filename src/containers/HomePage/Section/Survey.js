import React,{ useState,useEffect } from "react";
import Slider from "react-slick";
import lozad from "lozad";
import { useTranslation } from "react-i18next";
import { NextArrow,PrevArrow } from "./ArrowCustom";
import { getFeedback } from "../../../services/student_feedback";
import convertBufferToBase64 from "../../../utils/convertBufferToBase64";
import SurveySkeleton from "./SkeletonSection/SurveySkeleton";

const Survey = ({ settings }) => {
  const { t,i18n } = useTranslation();
  const [feelingStudent,setFeelingStudent] = useState([]);

  const [currentSlice,setCurrentSlice] = useState(1);

  useEffect(() => {
    getFeedback({}).then((data) => {
      if (data?.codeNumber === 0) {
        const feedback = data?.feedback;
        if (feedback?.length > 0) {
          for (let i = 0; i < feedback.length; i++) {
            if (feedback[i]?.studentData_FeedBack?.image?.data) {
              const img = convertBufferToBase64(
                feedback[i]?.studentData_FeedBack?.image?.data
              );
              feedback[i].studentData_FeedBack.image.data = img;
            }
          }
        }
        setFeelingStudent(feedback);
      }
    });
  },[]);

  useEffect(() => {
    const lazyLoadImg = () => {
      lozad(".lozad",{
        load: function (el) {
          el.src = el.dataset.src;
          el.onload = function () {
            el.classList.add("fade");
          };
        },
      }).observe();
    };
    lazyLoadImg();
  },[feelingStudent]);

  const studentSetting = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
          // nextArrow: <NextArrow />,
          // prevArrow: <PrevArrow />,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
          // nextArrow: <NextArrow />,
          // prevArrow: <PrevArrow />,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
          // nextArrow: <NextArrow />,
          // prevArrow: <PrevArrow />,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
          // nextArrow: <NextArrow type="disable" />,
          // prevArrow: <PrevArrow type="disable" />,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          // nextArrow: <NextArrow type="disable" />,
          // prevArrow: <PrevArrow type="disable" />,
        },
      },
    ],
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: function (currentSlide,nextSlide) {
      // console.log("before change",currentSlide,nextSlide);
      setCurrentSlice(
        nextSlide + 1 > (feelingStudent?.length ? feelingStudent.length - 1 : 0)
          ? 0
          : nextSlide + 1
      );
    },
  };
  return (
    <div className="section-container contact-container w-full h-auto">
      <div className="section-content">
        <div className="section-header flex items-center justify-between">
          <div className="section-header-text">
            {i18n.language === "en" ? "Student Opinion" : "Ý kiến sinh viên"}
          </div>
          {/* <button
            className="section-header-button outline-none border-none bg-blurColor text-headingColor bg-opacity-30 shadow-sm 
          backdrop-blur-sm hover:bg-blue-800 hover:text-white transition-all duration-300"
          >
            {t("header.see-all")}
          </button> */}
        </div>
        <div className="w-full">
          {feelingStudent?.length > 2 ? (
            <Slider {...studentSetting}>
              {feelingStudent.map((item,index) => {
                return (
                  <div key={index} className={`section-item-contact w-[391px]`}>
                    <div
                      className={`feedback_item w-full ${index === currentSlice ? "" : "pt-[60px]"
                        }`}
                      style={{
                        transition: "all 0.3s ease",
                        textAlign: "center",
                      }}
                    >
                      <div
                        className={`feedback_item-content ${index === currentSlice
                          ? "px-[32px] text-white minHeight-[224px] -mx-[30px] relative"
                          : "px-[52px] text-gray-400 minHeight-[201px]"
                          }`}
                        style={{
                          borderRadius: "15px",
                          paddingTop: "65px",
                          paddingBottom: "52px",
                          background: `${index === currentSlice
                            ? "url('https://i-vn2.joboko.com/okoimg/resource.joboko.com/xurl/images/common/quote.png') no-repeat center top, #1d5193"
                            : "url('https://i-vn2.joboko.com/okoimg/resource.joboko.com/xurl/images/common/quote.png') no-repeat center top, #f8f8f8"
                            }`,
                        }}
                      >
                        <p
                          style={{
                            display: "-webkit-box",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.54,
                            fontSize: "13px",
                          }}
                        >
                          {item?.school_activities}
                        </p>
                      </div>

                      <div
                        className={`feedback_item-detail ${index === currentSlice
                          ? "relative mt-[43px] pt-0 px-0"
                          : "-mt-[39px] py-0 px-[30px]"
                          }`}
                        style={{
                          zIndex: 5,
                        }}
                      >
                        <div
                          className={`feedback_avatar ${index === currentSlice
                            ? "absolute w-[144px] h-[144px] inset-0 -top-[85px] p-[8px]"
                            : "w-[90px] h-[90px] border-spacing-2 border-white"
                            }`}
                          style={
                            index === currentSlice
                              ? {
                                borderRadius: "50%",
                                margin: "0 auto 4px",
                                backgroundColor: "#fff",
                                border: "1px solid rgb(249, 221, 221)",
                              }
                              : {
                                borderRadius: "50%",
                                margin: "0 auto 4px",
                                backgroundColor: "#fff",
                              }
                          }
                        >
                          <img
                            alt=""
                            className="lozad"
                            style={{
                              display: "block",
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "50%",
                            }}
                            data-src={
                              item?.studentData_FeedBack?.image?.data
                                ? item.studentData_FeedBack.image.data
                                : "https://i-vn2.joboko.com/okoimg/vieclam.uet.vnu.edu.vn/xurl/images/logo-dhcn.png"
                            }
                          />
                        </div>
                        <p
                          className={`font-semibold ${index === currentSlice ? "pt-[72px]" : ""
                            }`}
                          style={{
                            fontSize: "14px",
                            margin: "0 0 2px",
                            lineHeight: "1.5",
                          }}
                        >
                          {`${item?.studentData_FeedBack?.fullName}`}
                        </p>
                        <p
                          className=""
                          style={{
                            lineHeight: "1.36",
                            fontSize: "12px",
                            color: "#555",
                          }}
                        >
                          {`${item?.studentData_FeedBack?.classroom}, ${item?.studentData_FeedBack?.faculty}`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          ) : (
            <SurveySkeleton />
          )}
        </div>
      </div>
    </div>
  );
};

export default Survey;
