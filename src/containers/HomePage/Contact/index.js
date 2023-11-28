import React from "react";
import HomeHeader from "../HomeHeader";
import { useTranslation } from "react-i18next";

import { FaLocationArrow, FaFax } from "react-icons/fa";
import { MdPhonelinkRing, MdEmail, MdNavigateNext } from "react-icons/md";
import HomeFooter from "../HomeFooter";

const Contact = () => {
  const { i18n, t } = useTranslation();

  return (
    <div>
      <div className="content-inform py-[20px] my-[5px] px-[10%] mx-auto min-h-[600px] h-[600px]">
        <h2 className="text-blurThemeColor font-semibold text-3xl pb-[19px] border-b-2 border-gray-300">
          {i18n.language === "en" ? "Contact" : "Liên hệ"}
        </h2>
        <div className="flex items-center justify-start gap-8 pt-12">
          <img
            src="https://i-vn2.joboko.com/okoimg/vieclam.uet.vnu.edu.vn/xurl/images/logo-dhcn.png"
            alt=""
            style={{
              width: "200px",
              height: "200px",
              objectFit: "cover",
            }}
          />
          <div className="flex flex-col items-start justify-start gap-1">
            <p
              className="font-semibold py-2 text-headingColor text-lg"
              style={{ lineHeight: 1.65 }}
            >
              {`${t("header.UET")}, ${t("header.VNU")}`}
            </p>
            <p className="flex items-center text-headingColor justify-start gap-3">
              <FaLocationArrow className="text-xl" />
              <span>
                {i18n.language === "en"
                  ? "Address: E3, 144 Xuan Thuy, Cau Giay, Ha Noi"
                  : "Địa chỉ: E3, 144 Xuân Thủy, Cầu Giấy, Hà Nội"}
              </span>
            </p>
            <p className="flex items-center text-headingColor justify-start gap-3">
              <MdPhonelinkRing className="text-xl" />
              <span>
                {i18n.language === "en" ? "Phone: " : "Điện thoại: "}
                <a
                  className="text-headingColor"
                  href="tel:+02437548864"
                  target="_blank"
                >
                  024.37548.864
                </a>
              </span>
            </p>
            <p className="flex items-center text-headingColor justify-start gap-3">
              <FaFax className="text-xl" />
              <span>Fax: 024.37548.864</span>
            </p>
            <p className="flex items-center justify-start gap-3">
              <MdEmail className="text-xl" />
              <span>
                <a
                  className="text-headingColor"
                  href="mailto:uet@vnu.edu.vn"
                  target="_blank"
                >
                  Email: uet@vnu.edu.vn
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>
      <HomeFooter />
    </div>
  );
};

export default Contact;
