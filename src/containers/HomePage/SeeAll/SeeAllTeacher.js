import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import Loading from "../../../utils/Loading";
import HomeHeader from "../HomeHeader";
import { RiArrowDownSLine } from "react-icons/ri";
import { getTeacherHomePageAPI } from "../../../services/teacherService";
import convertBufferToBase64 from "../../../utils/convertBufferToBase64";
import HomeFooter from "./../HomeFooter";
import "./SeeAllTeacher.scss";
import { useNavigate } from "react-router";
import { path } from "../../../utils/constant";
const SeeAllTeacher = () => {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState([]);
  const [descriptionTeacher, setDescriptionTeacher] = useState([]);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    getTeacherHomePageAPI
      .getTeacherHomePage({ page: pageCurrent })
      .then((data) => {
        if (data.codeNumber === 0) {
          console.log(data);
          const { totalTeacher, currentPage, teacherData, markDownTeacher } =
            data;
          if (teacherData?.length > 0) {
            for (let i = 0; i < teacherData.length; i++) {
              if (teacherData[i]?.image?.data) {
                teacherData[i].image.data = convertBufferToBase64(
                  teacherData[i].image.data
                );
              }
            }
          }
          setTeacher(teacher.concat(teacherData));
          setPageCurrent(+currentPage);
          setTotalPage(+totalTeacher);
          setDescriptionTeacher(descriptionTeacher.concat(markDownTeacher));
          setLoading(false);
        } else {
          setLoading(false);
          toast.error(
            i18n.language === "en" ? data?.message_en : data?.message_vn,
            {
              autoClose: 3000,
              position: "bottom-right",
              theme: "colored",
            }
          );
        }
      });
  }, [pageCurrent]);

  const handleOnChangeSearch = (e) => {
    setSearch(e.target.value);
    console.log(e.target.value);
    if (!e.target.value) {
      setLoading(true);
      getTeacherHomePageAPI.getTeacherHomePage({ page: 1 }).then((data) => {
        if (data.codeNumber === 0) {
          console.log(data);
          const { totalTeacher, currentPage, teacherData, markDownTeacher } =
            data;
          if (teacherData?.length > 0) {
            for (let i = 0; i < teacherData.length; i++) {
              if (teacherData[i]?.image?.data) {
                teacherData[i].image.data = convertBufferToBase64(
                  teacherData[i].image.data
                );
              }
            }
          }
          setTeacher(teacherData);
          setPageCurrent(+currentPage);
          setTotalPage(+totalTeacher);
          setDescriptionTeacher(markDownTeacher);
          setLoading(false);
        } else {
          setLoading(false);
          toast.error(
            i18n.language === "en" ? data?.message_en : data?.message_vn,
            {
              autoClose: 3000,
              position: "bottom-right",
              theme: "colored",
            }
          );
        }
      });
    }
  };
  const handleSearchTeacher = () => {
    if (search) {
      setLoading(true);
      getTeacherHomePageAPI.getTeacherBySearch({ search }).then((data) => {
        if (data?.codeNumber === 0) {
          console.log(data);
          const { teacherData, markDownTeacher } = data;
          if (teacherData?.length > 0) {
            for (let i = 0; i < teacherData.length; i++) {
              if (teacherData[i]?.image?.data) {
                teacherData[i].image.data = convertBufferToBase64(
                  teacherData[i].image.data
                );
              }
            }
          }
          setTeacher(teacherData);
          setDescriptionTeacher(markDownTeacher);
          setLoading(false);
        } else {
          setLoading(false);
          toast.error(
            i18n.language === "en" ? data?.message_en : data?.message_vn,
            {
              autoClose: 3000,
              position: "bottom-right",
              theme: "colored",
            }
          );
        }
      });
    }
  };

  return (
    <div>
      <ToastContainer />
      {loading && (
        <div className="fixed loading-overlay top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25">
          <div className="absolute">
            <Loading />
          </div>
        </div>
      )}
      <HomeHeader />
      <div className="w-full h-[100px]"></div>
      <div
        className="flex items-center justify-between pb-[19px] mt-[34px] mb-[20px] py-[20px] mx-[10%] px-[30px]"
        style={{
          border: "1px solid #f2f2f2",
          borderRadius: "3px",
        }}
      >
        <div className="relative pl-[20px]">
          <h2 className="text-blurThemeColor font-semibold m-0">
            {i18n.language === "en" ? "Teacher's List" : "Danh sách giảng viên"}
          </h2>
          <div
            style={{
              position: "absolute",
              top: "4px",
              bottom: "4px",
              width: "11px",
              left: "-10px",
              backgroundColor: "#f68500",
            }}
          ></div>
        </div>
        <div className="w-[30%]">
          <label
            for="default-search"
            class="mb-2 text-md font-medium text-gray-900 sr-only dark:text-white"
          >
            {i18n.language === "en" ? "Search" : "Tìm kiếm"}
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                class="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              class="block w-full p-4 pl-10 text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={
                i18n.language === "en"
                  ? "Name of teacher..."
                  : "Tên giảng viên..."
              }
              value={search}
              onChange={(e) => handleOnChangeSearch(e)}
              required
            />
            <button
              type="submit"
              class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() => handleSearchTeacher()}
            >
              {i18n.language === "en" ? "Search" : "Tìm kiếm"}
            </button>
          </div>
        </div>
      </div>
      <div
        className="pt-[20px] mb-[20px] mx-[10%] px-[30px]"
        style={{
          border: "1px solid #f2f2f2",
          borderRadius: "3px",
          backgroundColor: "#f6f6f6",
        }}
      >
        <div className="flex flex-col items-start justify-start">
          {teacher?.length === 0
            ? ""
            : teacher.map((item, index) => {
                return (
                  <div
                    className="teacher-see-all-item w-full"
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      borderBottom: "1px dashed #e3e3e3",
                      marginBottom: "20px",
                      paddingBottom: "20px",
                    }}
                  >
                    <div className="w-[230px] h-[152px] mx-auto flex items-start justify-center">
                      <div
                        className=""
                        style={{
                          backgroundImage: `url(${item?.image?.data})`,
                          backgroundSize: "cover",
                          width: "130px",
                          height: "130px",
                          backgroundRepeat: "no-repeat",
                          borderRadius: "50%",
                        }}
                      ></div>
                    </div>
                    <div className="flex-1">
                      <p
                        className=""
                        style={{
                          fontWeight: "500",
                          fontSize: "20px",
                          color: "black",
                          lineHeight: "1.5",
                        }}
                      >
                        {`${item?.positionData?.valueVn}
                          ,
                          ${item?.fullName}
                        `}
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          lineHeight: "1.2",
                          color: "#555",
                        }}
                      >
                        {descriptionTeacher[index]}
                      </p>
                      <div className="w-full flex items-start justify-start gap-4 mt-[10px]">
                        <button
                          class="px-5 py-1.5 flex cursor-pointer transition-all ease-in duration-150 items-center justify-center overflow-hidden text-sm font-semibold border border-backColor text-white  rounded-md bg-backColor hover:text-backColor hover:bg-white"
                          onClick={() =>
                            navigate(
                              `${path.HOMEPAGE}/${item?.code_url}/ids-role/R5`
                            )
                          }
                        >
                          <span class="">
                            {i18n.language === "en" ? "Detail" : "Chi tiết"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
      {teacher?.length < totalPage && !search && (
        <div className="flex items-center justify-center mb-[20px]">
          <div
            className="see_more_teacher  bg-blurThemeColor opacity-90 hover:opacity-100 transition-all duration-300"
            style={{
              display: "flex",
              borderRadius: "30px",
              width: "168px",
              height: "40px",
              justifyContent: "center",
              alignItems: "center",
              borderColor: "#1d5193",
              cursor: "pointer",
            }}
            onClick={() => setPageCurrent(pageCurrent + 1)}
          >
            <span
              style={{
                lineHeight: "1.45",
                fontSize: "15px",
                color: "#fff",
              }}
            >
              {i18n.language === "en" ? "See more" : "Xem thêm"}
            </span>
            <RiArrowDownSLine className="text-2xl text-white ml-[8px]" />
          </div>
        </div>
      )}
      <HomeFooter />
    </div>
  );
};

export default SeeAllTeacher;
