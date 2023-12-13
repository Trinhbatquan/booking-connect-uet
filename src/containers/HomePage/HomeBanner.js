import React,{ useEffect,useRef,useState } from "react";

import { FaSearch } from "react-icons/fa";
import { BsHouses,BsDatabase } from "react-icons/bs";
import { RiHeartsLine } from "react-icons/ri";
import { GiMedicalPackAlt } from "react-icons/gi";
import { HiOutlineBookOpen } from "react-icons/hi";
import { useTranslation } from "react-i18next";

// HỆ THỐNG ĐẶT LỊCH ONLINE

import "./HomeBanner.scss";
import { Link,NavLink,useLocation,useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import filterSearchInputHomePage from "../../utils/filterSearchHomePage";
import { setSearchText } from "../../redux/searchSlice";
import { path } from "../../utils/constant";

const HomeBanner = () => {
  const { t,i18n } = useTranslation();
  const dispatch = useDispatch();
  const [inputValue,setInputValue] = useState("");
  const navigate = useNavigate();
  const searchInput = useRef();
  const dropDownSearch = useRef();
  const searchText = useSelector((state) => state.searchHomePageReducer.search);
  const listSearchBanner = useSelector((state) => state.listSearchBannerReducer)

  const { department,faculty,teacher,healthStudent } = listSearchBanner;

  let dataSearch = [

    {
      label_en: "Department",
      label_vn: "Phòng ban",
      data: department?.length === 0 ? [] : department.map((item) => {
        return {
          url: `${path.HOMEPAGE}/${item?.code_url}/ids-role/${item?.roleManager}`,
          label: item?.fullName
        }
      })
    },

    {
      label_en: "Faculties",
      label_vn: "Khoa Viện",
      // data: [
      //   {
      //     url: `${path.HOMEPAGE}/detail/khoa-cong-nghe-thong-tin/ids-role/R4`,
      //     label: "Khoa Công nghệ Thông tin",
      //     code: "khoa cong nghe thong tin",
      //   },
      //   {
      //     url: `${path.HOMEPAGE}/detail/khoa-dien-tu-vien-thong/ids-role/R4`,
      //     label: "Khoa Điện tử Viễn Thông",
      //     code: "khoa dien tu vien thong",
      //   },
      //   {
      //     url: `${path.HOMEPAGE}/detail/khoa-vat-ly-ki-thuat-va-cong-nghe-nano/ids-role/R4`,
      //     label: "Khoa Vật lý Kĩ thuật và Công nghệ Nano",
      //     code: "khoa vat ly ki thuat va cong nghe nano",
      //   },
      //   {
      //     url: `${path.HOMEPAGE}/detail/khoa-co-ki-thuat-va-tu-dong-hoa/ids-role/R4`,
      //     label: "Khoa Cơ học Kỹ thuật và Tự động hoá",
      //     code: "khoa co ky thuat va tu dong hoa",
      //   },
      //   {
      //     url: `${path.HOMEPAGE}/detail/khoa-cong-nghe-nong-nghiep/ids-role/R4`,
      //     label: "Khoa Công nghệ Nông nghiệp",
      //     code: "khoa cong nghe nong nghiep",
      //   },
      //   {
      //     url: `${path.HOMEPAGE}/detail/khoa-cong-nghe-xay-dung-va-giao-thong/ids-role/R4`,
      //     label: "Khoa Công nghệ Xây dựng và Giao Thông",
      //     code: "khoa cong nghe xay dung va giao thong",
      //   },
      //   {
      //     url: `${path.HOMEPAGE}/detail/vien-cong-nghe-hang-khong-vu-tru 	/ids-role/R4`,
      //     label: "Viện Công nghệ Hàng không Vũ trụ",
      //     code: "vien cong nghe hang khong vu tru",
      //   },
      //   {
      //     url: `${path.HOMEPAGE}/detail/vien-tri-tue-nhan-taog/ids-role/R4`,
      //     label: "Viện Trí tuệ Nhân tạo",
      //     code: "vien tri tue nhan tao",
      //   },
      // ],
      data: faculty?.length === 0 ? [] : faculty.map((item) => {
        return {
          url: `${path.HOMEPAGE}/${path.detail_id}/${item?.code_url}/ids-role/${item?.roleManager}`,
          label: item?.fullName
        }
      })
    },
    {
      label_en: "Student Health Department",
      label_vn: "Ban sức khoẻ sinh viên",
      // data: [
      //   {
      //     url: `${path.HOMEPAGE}/ban-quan-ly-suc-khoe-sinh-vien/ids-role/R6`,
      //     label: "Ban quản lý sức khoẻ sinh viên",
      //     code: "ban quan ly suc khoe sinh vien",
      //   },
      //   {
      //     url: `${path.HOMEPAGE}/ban-ho-tro-tam-ly-sinh-vien/ids-role/R6`,
      //     label: "Ban Hỗ trợ Tâm lý sinh viên",
      //     code: "ban ho tro tam ly sinh vien",
      //   },
      // ],
      data: healthStudent?.length === 0 ? [] : healthStudent.map((item) => {
        return {
          url: `${path.HOMEPAGE}/${item?.code_url}/ids-role/${item?.roleManager}`,
          label: item?.fullName
        }
      })
    },
    {
      label_en: "Teacher",
      label_vn: "Giảng viên",
      data: teacher?.length === 0 ? [] : teacher.map((item) => {
        return {
          url: `${path.HOMEPAGE}/${item?.code_url}/ids-role/${item?.roleManager}`,
          label: item?.fullName
        }
      })
    },
  ];

  if (searchText) {
    dataSearch = filterSearchInputHomePage(searchText,dataSearch);
  }

  const handleNavigateSearch = (subItem) => {
    navigate(subItem?.url);
  };

  useEffect(() => {
    searchInput.current.addEventListener("focus",() => {
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

    document.addEventListener("click",handleClick);

    // Xóa sự kiện khi component bị unmounted
    return () => {
      document.removeEventListener("click",handleClick);
    };
  },[]);

  const removeHashFromURL = (event) => {
    // console.log(event);
    event.preventDefault();
    // Prevent the default link behavior

    // Get the hash from the href attribute of the clicked link
    const hash = event.target;
    const hashParent = hash.parentElement.getAttribute("href");
    // console.log(hashParent);

    if (hashParent) {
      const element = document.getElementById(hashParent.slice(1));
      // console.log(element);

      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

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
              dataSearch.map((item,index) => {
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
        <a
          className="topic flex flex-col justify-start items-center"
          href="#department-container"
          alt=""
          onClick={removeHashFromURL}
        >
          <BsHouses className="topic-icon text-gray-600 cursor-pointer py-3 rounded-full shadow-md backdrop-blur-md border border-blurColor" />
          <span className="topic-content  cursor-pointer text-xl">
            {t("banner.department")}
          </span>
        </a>
        <a
          className="topic flex flex-col justify-start items-center"
          href="#faculty-container"
          alt=""
          onClick={removeHashFromURL}
        >
          <BsDatabase className="topic-icon text-gray-600 cursor-pointer py-3 rounded-full shadow-md backdrop-blur-md border border-blurColor" />
          <span className="topic-content  cursor-pointer text-xl">
            {t("banner.faculty")}
          </span>
        </a>
        <div
          className="topic flex flex-col justify-start items-center"
          onClick={() => navigate(`${path.HOMEPAGE}/${path.teacher}`)}
        >
          <HiOutlineBookOpen className="topic-icon text-gray-600 cursor-pointer py-3 rounded-full shadow-md backdrop-blur-md border border-blurColor" />
          <span className="topic-content  cursor-pointer text-xl">
            {t("banner.teacher")}
          </span>
        </div>
        <NavLink
          className="topic flex flex-col justify-start items-center"
          to={`${path.HOMEPAGE}/${path.health}`}
        // onClick={removeHashFromURL}
        >
          <GiMedicalPackAlt className="topic-icon text-gray-600 cursor-pointer py-3 rounded-full shadow-md backdrop-blur-md border border-blurColor" />
          <span className="topic-content  cursor-pointer text-xl">
            {i18n.language === "en" ? "Student Health" : "Sức khoẻ sinh viên"}
          </span>
        </NavLink>
        {/* <a
          className="topic flex flex-col justify-start items-center"
          href="#health-container"
          alt=""
          onClick={removeHashFromURL}
        >
          <RiHeartsLine className="topic-icon text-gray-600 cursor-pointer py-3 rounded-full shadow-md backdrop-blur-md border border-blurColor" />
          <span className="topic-content  cursor-pointer text-xl">
            {t("banner.mental")}
          </span>
        </a> */}
      </div>
    </div>
  );
};

export default HomeBanner;
