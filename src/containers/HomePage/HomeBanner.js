import React, { useEffect, useRef, useState } from "react";

import { FaSearch } from "react-icons/fa";
import { BsHouses, BsDatabase } from "react-icons/bs";
import { RiHeartsLine } from "react-icons/ri";
import { GiMedicalPackAlt } from "react-icons/gi";

import { useTranslation } from "react-i18next";

// HỆ THỐNG ĐẶT LỊCH ONLINE

import "./HomeBanner.scss";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import filterSearchInputHomePage from "../../utils/filterSearchHomePage";
import { setSearchText } from "../../redux/searchSlice";

const HomeBanner = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const searchInput = useRef();
  const dropDownSearch = useRef();
  const searchText = useSelector((state) => state.searchHomePageReducer.search);
  let dataSearch = [
    {
      label_en: "Teacher",
      label_vn: "Giảng viên",
      data: [
        {
          url: "/homePage/dinh-thi-thai-mai/ids-role/R5",
          label: "Đinh Thị Thái Mai",
          code: "dinh thi thai mai",
        },
        {
          url: "/homePage/bui-trung-ninh/ids-role/R5",
          label: "Bùi Trung Ninh",
          code: "bui trung ninh",
        },
        {
          url: "/homePage/chu-thi-phuong-dung/ids-role/R5",
          label: "Chu Thị Phương Dung",
          code: "chu thi phuong dung",
        },
        {
          url: "/homePage/tran-nhu-chi/ids-role/R5",
          label: "Trần Như Chí",
          code: "tran nhu chi",
        },
        {
          url: "/homePage/nguyen-thu-hang/ids-role/R5",
          label: "Nguyễn Thu Hằng",
          code: "nguyen thu hang",
        },
        {
          url: "/homePage/pham-dinh-tuan/ids-role/R5",
          label: "Phạm Đình Tuân",
          code: "pham dinh tuan",
        },
        {
          url: "/homePage/hoang-gia-hung/ids-role/R5",
          label: "Hoàng Gia Hưng",
          code: "hoang gia hung",
        },
      ],
    },

    {
      label_en: "Department",
      label_vn: "Phòng ban",

      data: [
        {
          url: "/homePage/phong-dao-tao/ids-role/R2",
          label: "Phòng Đào tạo",
          code: "phong dao tao",
        },
        {
          url: "/homePage/phong-to-chuc-can-bo/ids-role/R2",
          label: "Phòng Tổ Chức Cán Bộ",
          code: "phong to chuc can bo",
        },
        {
          url: "/homePage/phong-cong-tac-sinh-vien/ids-role/R2",
          label: "Phòng Công Tác Sinh Viên",
          code: "phong cong tac sinh vien",
        },
        {
          url: "/homePage/phong-hanh-chinh-quan-tri/ids-role/R2",
          label: "Phòng Hành chính Quản trị",
          code: "phong hanh chinh quan tri",
        },
        {
          url: "/homePage/phong-ke-hoach-tai-chinh/ids-role/R2",
          label: "Phòng Kế hoạch Tài chính",
          code: "phong ke hoach tai chinh",
        },
        {
          url: "/homePage/phong-khoa-hoc-cong-nghe-va-hop-tac-phat-trien/ids-role/R2",
          label: "Phòng Khoa học Công nghệ và Hợp tác Phát triển",
          code: "phong khoa hocj cong nghe va hop tac phat trien",
        },
        {
          url: "/homePage/phong-thanh-tra-va-phap-che/ids-role/R2",
          label: "Phòng Thanh tra và Pháp chế",
          code: "phong thanh tra va phap che",
        },
        {
          url: "/homePage/trung-tam-dam-bao-chat-luong/ids-role/R2",
          label: "Trung tâm Đảm bảo chất lượng",
          code: "trung tam bao dam chat luong",
        },
      ],
    },

    {
      label_en: "Faculties",
      label_vn: "Khoa Viện",
      data: [
        {
          url: "/homePage/detail/khoa-cong-nghe-thong-tin/ids-role/R4",
          label: "Khoa Công nghệ Thông tin",
          code: "khoa cong nghe thong tin",
        },
        {
          url: "/homePage/detail/khoa-dien-tu-vien-thong/ids-role/R4",
          label: "Khoa Điện tử Viễn Thông",
          code: "khoa dien tu vien thong",
        },
        {
          url: "/homePage/detail/khoa-vat-ly-ki-thuat-va-cong-nghe-nano/ids-role/R4",
          label: "Khoa Vật lý Kĩ thuật và Công nghệ Nano",
          code: "khoa vat ly ki thuat va cong nghe nano",
        },
        {
          url: "/homePage/detail/khoa-co-ki-thuat-va-tu-dong-hoa/ids-role/R4",
          label: "Khoa Cơ học Kỹ thuật và Tự động hoá",
          code: "khoa co ky thuat va tu dong hoa",
        },
        {
          url: "/homePage/detail/khoa-cong-nghe-nong-nghiep/ids-role/R4",
          label: "Khoa Công nghệ Nông nghiệp",
          code: "khoa cong nghe nong nghiep",
        },
        {
          url: "/homePage/detail/khoa-cong-nghe-xay-dung-va-giao-thong/ids-role/R4",
          label: "Khoa Công nghệ Xây dựng và Giao Thông",
          code: "khoa cong nghe xay dung va giao thong",
        },
        {
          url: "/homePage/detail/vien-cong-nghe-hang-khong-vu-tru 	/ids-role/R4",
          label: "Viện Công nghệ Hàng không Vũ trụ",
          code: "vien cong nghe hang khong vu tru",
        },
        {
          url: "/homePage/detail/vien-tri-tue-nhan-taog/ids-role/R4",
          label: "Viện Trí tuệ Nhân tạo",
          code: "vien tri tue nhan tao",
        },
      ],
    },
    {
      label_en: "Student Health Department",
      label_vn: "Ban sức khoẻ sinh viên",
      data: [
        {
          url: "/homePage/ban-quan-ly-suc-khoe-sinh-vien/ids-role/R6",
          label: "Ban quản lý sức khoẻ sinh viên",
          code: "ban quan ly suc khoe sinh vien",
        },
        {
          url: "/homePage/ban-ho-tro-tam-ly-sinh-vien/ids-role/R6",
          label: "Ban Hỗ trợ Tâm lý sinh viên",
          code: "ban ho tro tam ly sinh vien",
        },
      ],
    },
  ];

  if (searchText) {
    dataSearch = filterSearchInputHomePage(searchText, dataSearch);
  }

  const handleNavigateSearch = (subItem) => {
    navigate(subItem?.url);
  };

  useEffect(() => {
    searchInput.current.addEventListener("focus", () => {
      dropDownSearch.current.style.display = "block";
    });

    function handleClick(event) {
      const mainDiv = document.querySelector(".input-search-homepage");
      const input = document.getElementById("mainInput");
      const itemDiv = document.querySelector(".search_common_dropdown");

      if (event.target !== mainDiv && event.target !== input) {
        itemDiv.style.display = "none";
      }
    }

    document.addEventListener("click", handleClick);

    // Xóa sự kiện khi component bị unmounted
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleReduxChangeValue = (value) => {
    setInputValue(value);
    dispatch(setSearchText(value));
  };

  return (
    <div className="homepage-banner-container">
      <div class="layer"></div>
      <div className="home-page-banner-up flex flex-col items-center gap-4 pt-16">
        <div className="content-one">{t("banner.contentOne")}</div>
        <div className="content-two">{t("banner.contentTwo")}</div>
        <div
          id="input-search-homepage"
          className="input input-search-homepage  flex items-center justify-center mt-8 relative"
        >
          <FaSearch className="text-xl mr-6 text-blue-600" />
          <input
            id="mainInput"
            className="mainInput border-none bg-transparent outline-none text-blurColor"
            name="input"
            placeholder={t("banner.search")}
            ref={searchInput}
            value={inputValue}
            onChange={(e) => handleReduxChangeValue(e.target.value)}
          />
          <div
            className="search_common_dropdown"
            style={{
              position: "absolute",
              top: "60px",
              left: 0,
              background: "#fff",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
              textAlign: "left",
              minHeight: "50px",
              maxHeight: "60vh",
              overflow: "auto",
            }}
            ref={dropDownSearch}
          >
            {dataSearch[0]?.data?.length === 0 &&
            dataSearch[1]?.data?.length === 0 &&
            dataSearch[2]?.data?.length === 0 &&
            dataSearch[3]?.data?.length === 0 ? (
              <span
                style={{
                  paddingTop: "13px",
                  paddingLeft: "20%",
                  display: "block",
                  color: "#6B7280",
                }}
              >
                {i18n.language === "en"
                  ? "There isn't any result for this text."
                  : "Không có kết quả cho từ mà bạn tìm kiếm."}
              </span>
            ) : (
              dataSearch.map((item, index) => {
                return (
                  <div key={index}>
                    {item?.data?.length === 0 ? (
                      ""
                    ) : (
                      <>
                        <h3
                          style={{
                            background: "#f5f5f5",
                            padding: "3px 10px",
                            fontWeight: "bold",
                            fontSize: "15px",
                            margin: 0,
                            color: "rgb(63, 66, 72)",
                          }}
                        >
                          {i18n.language === "en"
                            ? item.label_en
                            : item.label_vn}
                        </h3>
                        {item?.data.map((subItem) => {
                          return (
                            <div
                              style={{
                                display: "block",
                                padding: "5px 10px",
                                borderBottom: "1px solid #eee",
                                cursor: "pointer",
                                color: "#6B7280",
                              }}
                              onClick={() => handleNavigateSearch(subItem)}
                            >
                              {subItem?.label}
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                );
              })
            )}
            {/* <h3
              style={{
                background: "#f5f5f5",
                padding: "3px 10px",
                fontWeight: "bold",
                fontSize: "15px",
                margin: 0,
              }}
            >
              Teacher
            </h3>
            <Link
              style={{
                display: "block",
                padding: "5px 10px",
                borderBottom: "1px solid #eee",
              }}
            >
              Bùi Trung Ninh
            </Link>
            <Link
              style={{
                display: "block",
                padding: "5px 10px",
                borderBottom: "1px solid #eee",
              }}
            >
              Bùi Trung Ninh
            </Link>
            <Link
              style={{
                display: "block",
                padding: "5px 10px",
                borderBottom: "1px solid #eee",
              }}
            >
              Bùi Trung Ninh
            </Link> */}
          </div>
        </div>
      </div>
      <div className="homepage-banner-down flex items-center justify-center gap-32">
        <div className="topic flex flex-col justify-start items-center">
          <BsHouses className="topic-icon text-gray-600 cursor-pointer py-3 rounded-full shadow-md backdrop-blur-md border border-blurColor" />
          <span className="topic-content  cursor-pointer text-xl">
            {t("banner.department")}
          </span>
        </div>
        <div className="topic flex flex-col justify-start items-center">
          <BsDatabase className="topic-icon text-gray-600 cursor-pointer py-3 rounded-full shadow-md backdrop-blur-md border border-blurColor" />
          <span className="topic-content  cursor-pointer text-xl">
            {t("banner.faculty")}
          </span>
        </div>
        <div className="topic flex flex-col justify-start items-center">
          <BsDatabase className="topic-icon text-gray-600 cursor-pointer py-3 rounded-full shadow-md backdrop-blur-md border border-blurColor" />
          <span className="topic-content  cursor-pointer text-xl">
            {t("banner.teacher")}
          </span>
        </div>
        <div className="topic flex flex-col justify-start items-center">
          <GiMedicalPackAlt className="topic-icon text-gray-600 cursor-pointer py-3 rounded-full shadow-md backdrop-blur-md border border-blurColor" />
          <span className="topic-content  cursor-pointer text-xl">
            {t("banner.health")}
          </span>
        </div>
        <div className="topic flex flex-col justify-start items-center">
          <RiHeartsLine className="topic-icon text-gray-600 cursor-pointer py-3 rounded-full shadow-md backdrop-blur-md border border-blurColor" />
          <span className="topic-content  cursor-pointer text-xl">
            {t("banner.mental")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
