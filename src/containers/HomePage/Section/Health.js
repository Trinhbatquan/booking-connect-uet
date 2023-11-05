import React, { useEffect, useState } from "react";
import "./Health.scss";
import lozad from "lozad";

import { useTranslation } from "react-i18next";

import bgFour from "../../../assets/image/other.jpg";
import bgThree from "../../../assets/image/test.jpg";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { getUserApi } from "../../../services/userService";
import HealthStudentSkeleton from "./SkeletonSection/HealthStudentSkeleton";
import { Link } from "react-router-dom";
import Instruction from "./Instruction";

const Health = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUserApi.getUserByRole({ role: "R6" }).then((data) => {
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
    navigate(`${data?.code_url}/ids-role/R6`);
    // dispatch(setNavigate("detail"));
  };

  const data = [
    "https://i-vn.joboko.com/okoimg/vieclam.uet.vnu.edu.vn/xurl/images/image-1.png",
    "https://i-vn.joboko.com/okoimg/vieclam.uet.vnu.edu.vn/xurl/images/image-4.png",
  ];
  return (
    <div
      id="health-container"
      className="section-container health-container w-full h-auto"
    >
      <div className="section-content">
        <div className="section-header flex items-center justify-between">
          <div className="section-header-text">
            {t("header.health-student")}
          </div>
        </div>

        <div className="flex items-center justify-center gap-5 mx-auto">
          {loading ? (
            new Array(4).fill(0).map((item, index) => {
              return <HealthStudentSkeleton key={index} />;
            })
          ) : (
            <>
              <div
                className="section-item-health"
                onClick={() => handleHealthDetail(healthData[0])}
              >
                <div className="item">
                  <img
                    alt=""
                    data-src={data[0]}
                    className="section-item-img-health lozad"
                  ></img>
                  <div className="section-item-text-health">
                    {healthData[0]?.fullName}
                  </div>
                </div>
              </div>
              <div
                className="section-item-health"
                onClick={() => handleHealthDetail(healthData[1])}
              >
                <div className="item">
                  <img
                    alt=""
                    data-src={data[1]}
                    className="section-item-img-health lozad"
                  ></img>
                  <div className="section-item-text-health">
                    {healthData[1]?.fullName}
                  </div>
                </div>
              </div>
              <Link
                className="section-item-health"
                to="https://vieclam.ptithcm.edu.vn/trac-nghiem-huong-nghiep-news4541"
                target="_blank"
              >
                <div className="item">
                  <img
                    alt=""
                    data-src={bgThree}
                    className="section-item-img-health lozad"
                  ></img>
                  <div className="section-item-text-health">
                    Trắc nghiệm khách quan về tâm lý và hướng nghiệp
                  </div>
                </div>
              </Link>
              <div className="section-item-health">
                <div className="item">
                  <img
                    alt=""
                    data-src={bgFour}
                    className="section-item-img-health lozad"
                  ></img>
                  <div className="section-item-text-health">Khác</div>
                </div>
              </div>
            </>
          )}
        </div>

        <Instruction type="question" />
      </div>
    </div>
  );
};

export default Health;
