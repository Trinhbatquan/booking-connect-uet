import React from "react";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";

import { useState,useEffect } from "react";
import lozad from "lozad";
import { BsArrowRight } from "react-icons/bs";
import "./News.scss";
import { news } from "../../../services/newsService";
import convertBufferToBase64 from "../../../utils/convertBufferToBase64";
import NewsSkeleton from "./SkeletonSection/NewsSkeleton";
import { useNavigate } from "react-router";
import { path } from "../../../utils/constant";

const News = ({ settings }) => {
  const [newsData,setNewsData] = useState([]);
  const { t,i18n } = useTranslation();
  const [loading,setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    // getNotiFy.getHomePageLimited({}).then((data) => {
    //   if (data.codeNumber === 0) {
    //     const notifyLimited = data?.notifyHomePageLimited;
    //     if (notifyLimited?.length > 0) {
    //       for (let i = 0; i < notifyLimited?.length; i++) {
    //         if (notifyLimited[i]?.image?.data) {
    //           notifyLimited[i].image.data = convertBufferToBase64(
    //             notifyLimited[i].image.data
    //           );
    //         }
    //       }
    //     }
    //     setNotificationData(notifyLimited);
    //   }
    // });
    news.get_limited({}).then((data) => {
      if (data?.codeNumber === 0) {
        const res = data?.news;
        if (res?.length > 0) {
          // console.log(res);
          for (let i = 0; i < res?.length; i++) {
            if (res[i]?.avatarNew?.data) {
              res[i].avatarNew.data = convertBufferToBase64(
                res[i].avatarNew.data
              );
            }
          }
          setNewsData(res);
          setLoading(false);
        }
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
  },[newsData]);

  return (
    <div className="section-container notification-container w-full h-auto">
      <div className="section-content">
        <div className="section-header flex items-center justify-between">
          <div className="section-header-text">
            {i18n.language === "en" ? "News" : "Tin Tức"}
          </div>
          <button
            className="section-header-button outline-none border-none bg-blurColor text-headingColor bg-opacity-30 shadow-sm
          backdrop-blur-sm hover:bg-blue-800 hover:text-white transition-all duration-300"
            onClick={() => navigate(`${path.HOMEPAGE}/${path.news}`)}
          >
            {t("header.see-all")}
          </button>
        </div>
        <div className="section-body-notification">
          {loading ? (
            <NewsSkeleton />
          ) : newsData?.length < 1 ? (
            ""
          ) : (
            <div className="grid grid-cols-2 gap-12" style={{}}>
              <div
                className="relative h-[375px] rounded-lg overflow-hidden cursor-pointer"
                onClick={() =>
                  navigate(
                    `${path.HOMEPAGE}/${path.detail_news}/${newsData[0]?.code_url}`
                  )
                }
              >
                <img
                  className="lozad"
                  data-src={
                    newsData[0]?.avatarNew?.data
                      ? newsData[0].avatarNew.data
                      : "https://uet.vnu.edu.vn/wp-content/uploads/2018/01/GetArticleImage.jpg"
                  }
                  alt=""
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: "4",
                  }}
                />
                <div
                  className="title-news"
                  style={{
                    position: "absolute",
                    top: "auto",
                    right: "20px",
                    bottom: "19px",
                    left: "20px",
                    zIndex: "5",
                    display: "block",
                    width: "auto",
                    height: "15%",
                  }}
                >
                  <p
                    style={{
                      display: "-webkit-box",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      lineHeight: 1.4,
                      color: "#fff",
                      height: "100%",
                      fontSize: "20px",
                      fontWeight: "700",
                      textShadow: "rgb(42, 29, 58) 0px 0.5px 0px",
                    }}
                  >
                    {newsData[0]?.title}
                  </p>
                </div>
              </div>
              <div className="h-[375px] overflow-hidden flex flex-col items-start justify-between">
                {newsData.slice(1,newsData.length).map((item,index) => {
                  return (
                    <div
                      key={index}
                      className="flex items-start justify-start flex-1 w-full gap-8 mb-[20px] pb-[15px]
        "
                      style={{ borderBottom: "1px dashed #b1b1b1" }}
                    >
                      <img
                        className="lozad"
                        data-src={item?.avatarNew?.data}
                        alt=""
                        style={{
                          overflow: "hidden",
                          borderRadius: "10px",
                          width: "150px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="flex-1">
                        <p
                          style={{
                            display: "-webkit-box",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.6,
                            color: "#000",
                            fontSize: "15px",
                            fontWeight: "450",
                            margin: "0 0 10px",
                          }}
                        >
                          {item?.title}
                        </p>
                        <p
                          className="cursor-pointer detail-news flex items-start justify-start w-full gap-1"
                          style={{
                            color: "#f68500",
                            fontWeight: "600",
                            lineHeight: "1.5",
                          }}
                          onClick={() =>
                            navigate(
                              `${path.HOMEPAGE}/${path.detail_news}/${item?.code_url}`
                            )
                          }
                        >
                          <span>
                            {i18n.language === "en" ? "See more" : "Xem thêm"}
                          </span>
                          <BsArrowRight
                            className="button-news text-xl"
                            style={{ color: "#f68500" }}
                          />
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
