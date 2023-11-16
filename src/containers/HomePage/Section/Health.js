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
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState([]);
  const navigate = useNavigate();

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
            {i18n.language === "en" ? "Student Health" : "Sức khoẻ sinh viên"}
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
                    <p className="text_1">{healthData[0]?.fullName}</p>
                    <p className="text_2">
                      Kết nối, giải đáp và tư vấn về các vấn đề sức khoẻ của
                      sinh viên.
                    </p>
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
                    <p className="text_1">{healthData[1]?.fullName}</p>
                    <p className="text_2">
                      Cung cấp các phương pháp kết nối để giám sát sức khoẻ bản
                      thân.
                    </p>
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
                    <p className="text_1">Trắc nghiệm khách quan về tâm lý</p>
                    <p className="text_2">
                      Hướng dẫn về công cụ trắc nghiệm kèm theo các bản trắc
                      nghiệm được thiết kế.
                    </p>
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
                  <div className="section-item-text-health">
                    <p className="text_1">Khác</p>
                    <p className="text_2">
                      Các tính năng sẽ phát triển trong tương lai.
                    </p>
                  </div>
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
