import React, { lazy, Suspense, useEffect } from "react";
import { useNavigate } from "react-router";
import "./Section/Section.scss";

import { NextArrow, PrevArrow } from "./Section/ArrowCustom";
// import HomeHeader from './HomeHeader'
// import HomeBanner from './HomeBanner'
// import Departments from './Section/Departments'
// import Faculties from '';
// import Health from '';
// import Notification from './Section/Notification';
// import Contact from '';
// import HomeFooter from './HomeFooter';
// import Teacher from './Section/Teacher';

import Loading from "./../../utils/Loading";
import { path } from "../../utils/constant";
import Skeleton from "../../utils/Skeleton";

const HomeHeader = lazy(() => import("./HomeHeader"));
const HomeBanner = lazy(() => import("./HomeBanner"));
const Departments = lazy(() => import("./Section/Departments"));
const Faculties = lazy(() => import("./Section/Faculty"));
const Teacher = lazy(() => import("./Section/Teacher"));
const Health = lazy(() => import("./Section/Health"));
const News = lazy(() => import("./Section/News"));
const Survey = lazy(() => import("./Section/Survey"));
const HomeFooter = lazy(() => import("./HomeFooter"));

const HomePage = () => {
  const settingReactSlick = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
          nextArrow: <NextArrow />,
          prevArrow: <PrevArrow />,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
          nextArrow: <NextArrow />,
          prevArrow: <PrevArrow />,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
          nextArrow: <NextArrow />,
          prevArrow: <PrevArrow />,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
          nextArrow: <NextArrow type="disable" />,
          prevArrow: <PrevArrow type="disable" />,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          nextArrow: <NextArrow type="disable" />,
          prevArrow: <PrevArrow type="disable" />,
        },
      },
    ],
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const settingReactSlick_faculty = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
          nextArrow: <NextArrow />,
          prevArrow: <PrevArrow />,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
          nextArrow: <NextArrow />,
          prevArrow: <PrevArrow />,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
          nextArrow: <NextArrow />,
          prevArrow: <PrevArrow />,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
          nextArrow: <NextArrow type="disable" />,
          prevArrow: <PrevArrow type="disable" />,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          nextArrow: <NextArrow type="disable" />,
          prevArrow: <PrevArrow type="disable" />,
        },
      },
    ],
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const notificationSectionSettingSlick = {
    // dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    // autoplay: true,
    // autoplaySpeed: 3000,
    // pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: function (currentSlide, nextSlide) {
      console.log("before change", currentSlide, nextSlide);
    },
    afterChange: function (currentSlide) {
      console.log("after change", currentSlide);
    },
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("auth-bookingCare-UET_student"))) {
      navigate(`${path.HOMEPAGE}/${path.login_homepage}redirect=/homepage`);
    }
  }, []);

  return (
    <Suspense
      fallback={
        <div className="fixed loading-overlay top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25">
          <div className="absolute">
            <Loading />
          </div>
        </div>
      }
    >
      <div
      // style={{ width: "100vw",height: "100vh",overflow: "scroll" }}
      >
        <HomeHeader />

        <HomeBanner />

        <Departments settings={settingReactSlick} />
        <Faculties settings={settingReactSlick_faculty} />
        <Teacher settings={settingReactSlick} />
        <Health />
        <Survey />
        <News />
        <HomeFooter />
      </div>
    </Suspense>
  );
};

export default HomePage;
