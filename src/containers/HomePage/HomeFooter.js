import React from "react";
import { AiOutlineMail, AiFillHeart } from "react-icons/ai";
import { FaLocationArrow, FaFax } from "react-icons/fa";
import { MdPhonelinkRing, MdEmail, MdNavigateNext } from "react-icons/md";
import "./HomeFooter.scss";
import { useTranslation } from "react-i18next";
import FooterAvatar from "../../assets/image/footer.jpg";

const HomeFooter = () => {
  const { i18n, t } = useTranslation();
  return (
    <div
      className="homeFooter-container w-full h-auto flex items-start justify-between relative pt-[30px]"
      style={{
        backgroundImage: `url(${FooterAvatar})`,
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "350px",
        minHeight: "350px",
      }}
    >
      <div
        className="homeFooter-content text-white py-5 flex items-center justify-between"
        style={{ fontSize: "16px" }}
      >
        <div className="flex flex-col items-start justify-start gap-1">
          <p
            className="font-semibold py-2 text-lg"
            style={{ lineHeight: 1.65 }}
          >
            {`${t("header.UET")}, ${t("header.VNU")}`}
          </p>
          <p className="flex items-center justify-start gap-3">
            <FaLocationArrow className="text-xl" />
            <span>
              {i18n.language === "en"
                ? "Address: E3, 144 Xuan Thuy, Cau Giay, Ha Noi"
                : "Địa chỉ: E3, 144 Xuân Thủy, Cầu Giấy, Hà Nội"}
            </span>
          </p>
          <p className="flex items-center justify-start gap-3">
            <MdPhonelinkRing className="text-xl" />
            <span>
              {i18n.language === "en" ? "Phone: " : "Điện thoại: "}
              <a className="text-white" href="tel:+02437547460" target="_blank">
                024.37547.460
              </a>
            </span>
          </p>
          <p className="flex items-center justify-start gap-3">
            <FaFax className="text-xl" />
            <span>Fax: 024.37547.460</span>
          </p>
          <p className="flex items-center justify-start gap-3">
            <MdEmail className="text-xl" />
            <span>
              <a
                className="text-white"
                href="mailto:uet@vnu.edu.vn"
                target="_blank"
              >
                Email: uet@vnu.edu.vn
              </a>
            </span>
          </p>
        </div>
        <div className="flex flex-col items-start justify-start gap-1">
          <p
            className="font-semibold py-2 text-lg"
            style={{ lineHeight: 1.65 }}
          >
            {i18n.language === "en" ? "Category" : "Danh mục"}
          </p>
          <p className="flex items-center justify-start gap-3">
            <MdNavigateNext className="text-xl" />
            <span>{t("header.inform")}</span>
          </p>
          <p className="flex items-center justify-start gap-3">
            <MdNavigateNext className="text-xl" />
            <span>{t("header.Action")}</span>
          </p>
          <p className="flex items-center justify-start gap-3">
            <MdNavigateNext className="text-xl" />

            <span>{i18n.language === "en" ? "Notification" : "Thông báo"}</span>
          </p>
          <p className="flex items-center justify-start gap-3">
            <MdNavigateNext className="text-xl" />
            <span>{t("header.handbook")}</span>
          </p>
        </div>
        <div className="flex flex-col items-start justify-start gap-1">
          <p
            className="font-semibold py-2 text-lg"
            style={{ lineHeight: 1.65 }}
          >
            {i18n.language === "en" ? "Contact" : "Kết nối"}
          </p>
          <p className="flex items-center justify-start gap-3">
            <MdNavigateNext className="text-xl" />
            <a
              className="text-white"
              href="https://vieclam.uet.vnu.edu.vn"
              target="_blank"
            >
              {i18n.language === "en"
                ? "UET Employment Website"
                : "Trang việc làm UET"}
            </a>
          </p>
          <p className="flex items-center justify-start gap-3">
            <MdNavigateNext className="text-xl" />
            <a
              className="text-white"
              href="https://vieclam.uet.vnu.edu.vn"
              target="_blank"
            >
              {i18n.language === "en" ? "Student HandBook" : "Sổ tay sinh viên"}
            </a>
          </p>
          <p className="flex items-center justify-start gap-3">
            <MdNavigateNext className="text-xl" />
            <a
              className="text-white"
              href="https://uet.vnu.edu.vn"
              target="_blank"
            >
              {i18n.language === "en" ? "UET Website" : "Trang chủ UET"}
            </a>
          </p>
          <p className="flex items-center justify-start gap-3">
            <MdNavigateNext className="text-xl" />
            <a
              className="text-white"
              href="https://uet.vnu.edu.vn"
              target="_blank"
            >
              {i18n.language === "en" ? "UET Website" : "Trang chủ UET"}
            </a>
          </p>
        </div>
      </div>

      <div
        className="absolute bottom-0 right-0 left-0 text-white px-[10%] mx-auto flex items-center justify-center"
        style={{
          backgroundColor: "rgb(9, 90, 99)",
          fontSize: "16px",
          height: "50px",
        }}
      >
        <p className="flex items-center justify-center gap-1">
          <span>
            © VNU University of Engineering and Technology - VNU UET - Office of
            Student Affairs All rights reserved.
          </span>
          <AiFillHeart className="text-orange-400 text-xl" />
        </p>
      </div>
    </div>
  );
};

export default HomeFooter;
