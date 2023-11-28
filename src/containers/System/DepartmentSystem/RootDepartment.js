import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DepartmentManager from "./DepartmentManager";
import DepartmentDescription from "./DepartmentDescription";

const RootDepartment = () => {
  const { i18n, t } = useTranslation();
  const [option, setOption] = useState("O1");
  return (
    <>
      <div className="w-full h-[60px]"></div>

      <div
        className="relative mt-[34px] pt-[20px] mb-[20px] mx-[10%]"
        style={{
          // border: "1px solid rgb(242, 242, 242)",
          minHeight: "300px",
        }}
      >
        <div className="mb-[30px] flex items-center justify-center">
          <h2 className="text-blurThemeColor font-semibold">
            {i18n.language === "en" ? "Department" : "Phòng ban"}
          </h2>
          {/* <div
            style={{
              position: "absolute",
              top: "4px",
              bottom: "4px",
              width: "11px",
              left: "-31px",
              backgroundColor: "rgb(246, 133, 0)",
            }}
          ></div> */}
        </div>
        <div className="pb-[30px] mx-auto flex flex-col items-start justify-start gap-1">
          <div
            className="px-5 h-[60px] w-full rounded-lg flex items-center justify-center"
            style={{
              border: "1px solid rgb(242, 242, 242)",
            }}
          >
            <div className="flex items-center justify-center gap-8">
              <button
                class={`px-5 py-1.5 flex transition-all ease-in duration-150 items-center justify-center overflow-hidden text-md font-semibold border border-blurThemeColor rounded-2xl hover:text-white hover:bg-blurThemeColor hover:opacity-100 ${
                  option === "O1"
                    ? "text-white bg-blurThemeColor"
                    : "text-blurThemeColor bg-white opacity-50"
                }`}
                onClick={() => setOption("O1")}
              >
                <span class="">
                  {i18n.language === "en"
                    ? "Department Management"
                    : "Quản lý phòng ban"}
                </span>
              </button>
              <button
                class={`px-5 py-1.5 flex transition-all ease-in duration-150 items-center justify-center overflow-hidden text-md font-semibold border border-blurThemeColor rounded-2xl hover:text-white hover:bg-blurThemeColor hover:opacity-100 ${
                  option === "O2"
                    ? "text-white bg-blurThemeColor"
                    : "text-blurThemeColor bg-white opacity-50"
                }`}
                onClick={() => setOption("O2")}
              >
                <span class="">
                  {i18n.language === "en"
                    ? "Create description of department"
                    : "Tạo thông tin phòng ban"}
                </span>
              </button>
            </div>
          </div>
          <div className="w-full">
            {option === "O1" ? (
              <DepartmentManager />
            ) : (
              <DepartmentDescription />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RootDepartment;
