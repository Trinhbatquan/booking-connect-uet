import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import HealthStudentManager from "./HealthStudentManager";
import HealthStudentDescription from "./HealthStudentDescription";

const RootHealthStudent = () => {
  const { i18n, t } = useTranslation();
  const [option, setOption] = useState("O1");
  return (
    <>
      <div className="w-full h-[60px]"></div>

      <div
        className="relative mt-[34px] pt-[20px] mb-[20px] mx-[10%] pr-[30px] pl-[65px]"
        style={{
          border: "1px solid rgb(242, 242, 242)",
          minHeight: "300px",
        }}
      >
        <div className="mb-[30px] relative">
          <h2 className="text-blurThemeColor font-semibold">
            {i18n.language === "en" ? "Health Student" : "Sức khoẻ sinh viên"}
          </h2>
          <div
            style={{
              position: "absolute",
              top: "4px",
              bottom: "4px",
              width: "11px",
              left: "-31px",
              backgroundColor: "rgb(246, 133, 0)",
            }}
          ></div>
        </div>
        <div className="pb-[30px] mx-auto flex flex-col items-start justify-start gap-1">
          <div
            className="px-5 h-[60px] w-full rounded-lg flex items-center justify-between"
            style={{
              border: "1px solid rgb(242, 242, 242)",
            }}
          >
            <div className="flex items-center justify-start gap-8">
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
                    ? "Health Student Management"
                    : "Quản lý ban sức khoẻ sinh viên"}
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
                    ? "Create description of health student"
                    : "Tạo thông tin ban sức khoẻ sinh viên"}
                </span>
              </button>
            </div>
          </div>
          {option === "O1" ? (
            <HealthStudentManager />
          ) : (
            <HealthStudentDescription />
          )}
        </div>
      </div>
    </>
  );
};

export default RootHealthStudent;