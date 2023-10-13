import React from "react";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import Select from "react-select";
import Loading from "../../../utils/Loading";
import { useTranslation } from "react-i18next";
import Pagination from "../../../utils/Pagination";

const NotificationManager = () => {
  const [loading, setLoading] = useState(false);
  const [notifyCheckState, setNotifyCheckState] = useState("");
  const [user, setUser] = useState([]);
  const [detail, setDetail] = useState("");
  const [title, setTitle] = useState("");
  const [action, setAction] = useState("");
  const [notify, setNotify] = useState("");
  const pageCurrent = 1;
  const pageTotal = 2;
  const { i18n } = useTranslation();

  const userPotions = [
    { value: "R3", label: "Student" },
    { value: "R2", label: "Department" },
    { value: "R4", label: "Faculty" },
    { value: "R5", label: "Teacher" },
    { value: "R6", label: "Student Health Support" },
  ];

  const handleNavigatePage = () => {};

  return (
    <>
      <div className="w-full" style={{ height: "100px" }}></div>
      <div
        className="mt-3 flex flex-col mx-auto pb-10"
        style={{ maxWidth: "80%", width: "80%" }}
      >
        <ToastContainer />
        <p className="mx-auto text-2xl text-blue-500 font-semibold">
          {/* {t("system.department.manager-department")} */}
          Thông báo
        </p>
        {loading && <Loading />}
        <div
          className={`flex items-center justify-center mt-3 gap-1 py-2 px-1 text-white font-semibold rounded-md
            bg-blue-500
          }`}
          // type="text"
          // onClick={() => setIsCreateUser(true)}
          style={{ maxWidth: "14%", width: "14%" }}
        >
          Tạo thông báo
        </div>

        <div className="flex overflow-hidden flex-col h-auto bg-slate-200 rounded-lg shadow backdrop-blur-md shadow-gray-300 mt-2 mb-1">
          <span
            className="mx-auto text-red-500 mb-2"
            style={notifyCheckState ? { opacity: "1" } : { opacity: "0" }}
          >
            {notifyCheckState ? notifyCheckState : "Null"}
          </span>
          <div className="w-full flex items-center justify-center gap-6">
            <div className="flex-1 flex flex-col justify-center">
              <label
                for="users"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Select a user
              </label>
              <Select
                isMulti
                value={user}
                name="position"
                options={userPotions}
                className="mx-auto text-md pt-0.5 text-headingColor"
                onChange={(e) => setUser(e)}
              />
            </div>
            <div className="flex-1 flex flex-col justify-center relative">
              <label
                htmlFor="title"
                className="mb-1 text-headingColor opacity-80 flex items-center gap-1"
              >
                Title
              </label>
              <input
                className={`shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light 
                 `}
                name="title"
                id="title"
                // type={`${eye ? "text" : "password"}`}
                // value={password}
                // onChange={(e) => handleChangeEvent(e.target.value, "Password")}
                onFocus={() => setNotifyCheckState("")}
                // disabled={isUpdateUser ? true : false}
              />
            </div>
          </div>
          <div className="w-full flex items-center justify-center gap-6 mt-3">
            <div className="flex-1 flex flex-col justify-center">
              <label
                htmlFor="detail"
                className="mb-1 text-headingColor opacity-80 flex items-center gap-1"
              >
                {/* {t("system.table.detail")} <HiOutlinePencilAlt /> */}
                Detail
              </label>
              <input
                className=" shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                name="detail"
                type="text"
                id="detail"
                value={detail}
                // onChange={(e) => handleChangeEvent(e.target.value, "Gender")}
                onFocus={() => setNotifyCheckState("")}
              />
            </div>
            <div className="flex-1 flex-col justify-center flex">
              <label
                className="mb-1 text-headingColor opacity-80 flex items-center gap-1"
                htmlFor="file_input"
              >
                {/* {t("system.table.avatar")} */}
                Image
              </label>
              <input
                className="block w-full text-sm text-gray-900 border border-gray-400 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id="file_input"
                type="file"
                // onChange={(e) => handleChangeAndPreviewImage(e)}
                onFocus={() => setNotifyCheckState("")}
              />
            </div>
          </div>
        </div>

        <div
          className={`flex items-center justify-center mt-3 gap-1 py-2 px-1 text-white font-semibold rounded-md
            bg-blue-500
          }`}
          // type="text"
          // onClick={() => setIsCreateUser(true)}
          style={{ maxWidth: "14%", width: "14%" }}
        >
          Quản lý thông báo
        </div>

        <div className="w-full grid grid-cols-5 gap-5">
          <button
            type="button"
            class={`hover:bg-blue-800 transition-all duration-500  hover:text-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5  mb-2 focus:outline-none
                ${
                  action === "R3"
                    ? "text-white bg-blue-800"
                    : "text-gray-400 bg-white border border-gray-600"
                }`}
            onClick={() => setAction("R3")}
          >
            Student(10)
          </button>
          <button
            type="button"
            class={`hover:bg-blue-800 transition-all duration-500  hover:text-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5  mb-2 focus:outline-none
                ${
                  action === "R2"
                    ? "text-white bg-blue-800"
                    : "text-gray-400 bg-white border border-gray-600"
                }`}
            onClick={() => setAction("R2")}
          >
            Department(10)
          </button>
          <button
            type="button"
            class={`hover:bg-blue-800 transition-all duration-500  hover:text-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5  mb-2 focus:outline-none
                ${
                  action === "R4"
                    ? "text-white bg-blue-800"
                    : "text-gray-400 bg-white border border-gray-600"
                }`}
            onClick={() => setAction("R4")}
          >
            Faculty(10)
          </button>
          <button
            type="button"
            class={`hover:bg-blue-800 transition-all duration-500  hover:text-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5  mb-2 focus:outline-none
                ${
                  action === "R5"
                    ? "text-white bg-blue-800"
                    : "text-gray-400 bg-white border border-gray-600"
                }`}
            onClick={() => setAction("R5")}
          >
            Teacher(10)
          </button>
          <button
            type="button"
            class={`hover:bg-blue-800 transition-all duration-500  hover:text-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5  mb-2 focus:outline-none
                ${
                  action === "R6"
                    ? "text-white bg-blue-800"
                    : "text-gray-400 bg-white border border-gray-600"
                }`}
            onClick={() => setAction("R6")}
          >
            Student Health Support(10)
          </button>
        </div>
        <div className="notify w-full mx-auto flex flex-col items-start justify-start gap-8">
          {notify?.length > 0 &&
            notify.map((item, index) => {
              return (
                <div
                  key={index}
                  className="notify-item w-full relative flex items-center justify-start gap-6"
                >
                  <div className="relative">
                    <img
                      src="https://uet.vnu.edu.vn/wp-content/uploads/2018/01/GetArticleImage.jpg"
                      className="w-[360px] h-[240px]"
                      title={item?.notificationType?.valueVn}
                      alt={item?.notificationType?.valueVn}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: "-50px",
                        width: "50px",
                        height: "50px",
                      }}
                    >
                      <div
                        className="text-md"
                        style={{
                          padding: "10px 10px",
                          fontSize: "12px",
                          lineHeight: "18px",
                          minWidth: "30px",
                          backgroundColor: "#17376e",
                          borderRadius: "5px",
                        }}
                      >
                        <div className="month text-white text-md text-center">
                          {/* {`Th${new Date(item?.createdAt).getMonth() + 1}`} */}
                          Th10
                        </div>
                        <div
                          className="day text-white text-lg text-center"
                          style={{
                            lineHeight: "18px",
                          }}
                        >
                          {/* {`${new Date(item?.createdAt).getDate() + 1}`} */}
                          09
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="flex-1"
                    style={{
                      borderTop: "1px solid #eaeaea",
                      margin: "17px 70px 0",
                    }}
                  >
                    <h3
                      style={{
                        marginBottom: "9px",
                        color: "#343434",
                      }}
                    >
                      {/* {i18n.language === "en"
                        ? item?.notificationType?.valueEn
                        : item?.notificationType?.valueVn} */}
                      1234567
                    </h3>
                    <div
                      className="text-md"
                      style={{
                        marginTop: "25px",
                        marginBottom: "22px",
                        color: "#015198",
                      }}
                    >
                      {/* {i18n.language === "en"
                        ? contentNotify(item?.type_notification, item).en()
                        : contentNotify(item?.type_notification, item).vn()} */}
                      abcdefghiklm skhdfvdfjvhfvhgf dvnbdfjvbfjvbfg
                      dsvndfkvbfjbvfj sdvbjdfvbdfvbf
                    </div>
                    <div
                      className="text-sm flex items-center justify-start"
                      style={{
                        textTransform: "uppercase",
                        marginBottom: " 10px",
                        paddingTop: 0,
                        color: "#015198",
                      }}
                    >
                      <span>
                        Bởi hệ thống{" "}
                        <span
                          style={{
                            lineHeight: "1px",
                            margin: "0 5px",
                            color: "#eaeaea",
                          }}
                        >
                          |
                        </span>
                      </span>
                      <span>
                        Tin sinh viên
                        <span
                          style={{
                            lineHeight: "1px",
                            margin: "0 5px",
                            color: "#eaeaea",
                          }}
                        >
                          |
                        </span>
                      </span>
                    </div>
                    <button
                      class="px-5 py-1.5 flex transition-all ease-in duration-150 items-center justify-center overflow-hidden text-sm font-semibold border border-red-500 text-white  rounded-md bg-red-500 hover:text-red-500 hover:bg-white"
                      // onClick={() =>
                      //   item?.type_notification !== "system"
                      //     ? navigate(
                      //         `${path.MANAGER}/${path.student}${item?.type_notification}`
                      //       )
                      //     : ""
                      // }
                    >
                      <span class="">
                        {i18n.language === "en" ? "Detail" : "Chi tiết"}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}

          <Pagination
            numberOfPage={pageCurrent}
            pages={pageTotal}
            handleNavigatePage={handleNavigatePage}
          />
        </div>
      </div>
    </>
  );
};

export default NotificationManager;
