import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import Select from "react-select";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import Loading from "../../../utils/Loading";
import { useTranslation } from "react-i18next";
import Pagination from "../../../utils/Pagination";
import {
  createNotifySystem,
  deleteNotifySystem,
  getNotiFy,
  updateNotifySystem,
} from "../../../services/notificationService";
import render_code_url from "../../../utils/render_code_url";
import { useDispatch } from "react-redux";
import { getAllNotify } from "../../../redux/notificationManagerSlice";
import convertBufferToBase64 from "../../../utils/convertBufferToBase64";
import convertFileToBase64 from "../../../utils/convertFileToBase64";
import { logOutApi } from "../../../services/userService";
import { logOutUser } from "../../../redux/authSlice";
import { useNavigate } from "react-router";
import { path } from "../../../utils/constant";
import DeleteNotify from "./DeleteNotify";
import { emit_new_notification_from_system } from "../../../utils/socket_client";

const NotificationSystem = () => {
  const [loading, setLoading] = useState(true);
  const [notifyCheckState, setNotifyCheckState] = useState("");
  const [user, setUser] = useState([]);
  const [detail, setDetail] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [title, setTitle] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [image, setImage] = useState("");
  const [action, setAction] = useState("");
  const [isUpdateNotify, setIsUpdateNotify] = useState(false);
  const [dataUpdateNotify, setDataUpdateNotify] = useState();
  const [isDeleteNotify, setIsDeleteNotify] = useState(false);
  const [dataDeleteNotify, setDataDeleteNotify] = useState();
  const [notifyData, setNotifyData] = useState({});
  const [pageCurrent, setPageCurrent] = useState(1);
  const [countNotifyData, setCountNotifyData] = useState([]);
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mdParser = new MarkdownIt(/* Markdown-it options */);
  const userPotions = [
    { value: "R3", label: "Student" },
    { value: "R2", label: "Department" },
    { value: "R4", label: "Faculty" },
    { value: "R5", label: "Teacher" },
    { value: "R6", label: "Student Health Support" },
  ];

  const inputFileRef = useRef();

  useEffect(() => {
    getNotiFy
      .getAllCount({
        type: "system",
      })
      .then((res) => {
        console.log(res);

        if (res?.codeNumber === 0) {
          setCountNotifyData(res?.allNotifyCount);
          setLoading(false);
        }
      });
  }, []);

  useEffect(() => {
    if (action) {
      setLoading(true);
      console.log(1);
      getNotiFy
        .get({
          roleManager: action,
          page: pageCurrent,
          type: "system",
        })
        .then((res) => {
          console.log(res);

          if (res?.codeNumber === 0) {
            const data = res?.notify;
            if (data?.length > 0) {
              for (let i = 0; i < data.length; i++) {
                if (data[i]?.image?.data) {
                  data[i].image.data = convertBufferToBase64(
                    data[i].image.data
                  );
                }
              }
            }
            setNotifyData({
              notify: data,
              pageCurrent: res?.pageCurrent,
              pageTotal: res?.pageTotal,
            });
            setLoading(false);
          }
        });
    }
  }, [action, pageCurrent]);

  const handleNavigatePage = (page) => setPageCurrent(page);

  const handleFileImage = async (e) => {
    let data = e.target.files;
    let file = data[0];
    if (file) {
      let urlAvatar = URL.createObjectURL(file);
      setPreviewImage(urlAvatar);
      try {
        const base64File = await convertFileToBase64(file);
        setImage(base64File);
      } catch (e) {
        console.log("base64 file " + e);
      }
    }
  };

  function handleEditorChange({ html, text }) {
    setContentHtml(html);
    setDetail(text);
  }

  const handleCheckNullState = () => {
    let result = true;
    const stateArr = [user?.length, title, detail];
    const notification_en = ["User", "Title", "Detail"];
    const notification_vi = [
      "Trường người dùng",
      "Trường tiêu đề",
      "Trường nội dung",
    ];
    if (isUpdateNotify) {
      for (let i = 1; i < stateArr.length; i++) {
        if (!stateArr[i]) {
          if (i18n.language === "vi") {
            setNotifyCheckState(
              `${notification_vi[i]} ${t("system.notification.required")}`
            );
          } else {
            setNotifyCheckState(
              `${notification_en[i]} ${t("system.notification.required")}`
            );
          }
          result = false;
          break;
        } else {
          setNotifyCheckState("");
        }
      }
    } else {
      for (let i = 0; i < stateArr.length; i++) {
        if (!stateArr[i]) {
          if (i18n.language === "vi") {
            setNotifyCheckState(
              `${notification_vi[i]} ${t("system.notification.required")}`
            );
          } else {
            setNotifyCheckState(
              `${notification_en[i]} ${t("system.notification.required")}`
            );
          }
          result = false;
          break;
        } else {
          setNotifyCheckState("");
        }
      }
    }

    return result;
  };

  const handleCreateNewNotify = async () => {
    if (handleCheckNullState()) {
      setLoading(true);
      setNotifyCheckState("");
      const notifyData = [];
      for (let i = 0; i < user?.length; i++) {
        notifyData.push({
          managerId: 0,
          roleManager: user[i]?.value,
          title,
          content: detail,
          contentHtml,
          image,
          type_notification: "system",
          code_url: render_code_url(title),
        });
      }
      await createNotifySystem({}, { notifyData }).then((res) => {
        if (res?.codeNumber === -1) {
          toast.error(`${t("system.notification.fail")}`, {
            autoClose: 2000,
            position: "bottom-right",
            theme: "colored",
          });
          setLoading(false);
        } else if (res?.codeNumber === -2) {
          toast.error(`${t("system.token.mess")}`, {
            autoClose: 3000,
            position: "bottom-right",
            theme: "colored",
          });
          setTimeout(() => {
            logOutApi.logoutUser({}).then((data) => {
              if (data?.codeNumber === 0) {
                dispatch(logOutUser());
                navigate(
                  `${path.SYSTEM}/${path.LOGIN_SYSTEM}?redirect=/system`
                );
              }
            });
          }, 3000);
        } else if (res?.codeNumber === 1) {
          toast.error(res?.message, {
            autoClose: 2000,
            position: "bottom-right",
            theme: "colored",
          });
          setLoading(false);
        } else {
          //websocket notify to manager
          const dataRoleManager = [];
          for (let i = 0; i < user.length; i++) {
            if (user[i]?.value !== "R3") {
              dataRoleManager.push(user[i]?.value);
            }
          }
          console.log(dataRoleManager);
          console.log(user);
          if (dataRoleManager?.length > 0) {
            emit_new_notification_from_system({
              dataRoleManager,
              time: new Date(),
            });
          }
          getNotiFy
            .getAllCount({
              type: "system",
            })
            .then((result) => {
              console.log(result);

              if (result?.codeNumber === 0) {
                setCountNotifyData(result?.allNotifyCount);
                setAction("");
                setUser([]);
                setDetail("");
                setContentHtml("");
                setTitle("");
                setImage("");
                inputFileRef.current.value = "";
                setPreviewImage("");
                setLoading(false);
                toast.success(`${t("system.notification.create")}`, {
                  autoClose: 2000,
                  position: "bottom-right",
                  theme: "colored",
                });
              }
            });
        }
      });
    } else {
      return;
    }
  };

  const handleOpenUpdateNotify = (data) => {
    setIsUpdateNotify(true);
    setDataUpdateNotify(data);
    for (let i = 0; i < userPotions?.length; i++) {
      if (userPotions[i]?.value === data.roleManager) {
        setUser([userPotions[i]]);
        break;
      }
    }
    setTitle(data.title);
    setDetail(data.content);
    setContentHtml(data.contentHtml);

    if (data?.image?.data) {
      setPreviewImage(data?.image?.data);
    } else {
      setPreviewImage("");
    }
  };

  const handleCloseUpdateUser = () => {
    setUser([]);
    setDetail("");
    setContentHtml("");
    setTitle("");
    setImage("");
    setPreviewImage("");
    inputFileRef.current.value = "";
    setDataUpdateNotify("");
    setIsUpdateNotify(false);
  };

  const handleUpdateNotify = async () => {
    if (handleCheckNullState()) {
      setLoading(true);
      setNotifyCheckState("");
      const body = image
        ? {
            notifyId: dataUpdateNotify?.id,
            notifyData: {
              content: detail,
              contentHtml,
              title,
              image,
              roleManager: user[0]?.value ? user[0].value : user.value,
            },
          }
        : {
            notifyId: dataUpdateNotify?.id,
            notifyData: {
              content: detail,
              contentHtml,
              title,
              roleManager: user[0]?.value ? user[0].value : user.value,
            },
          };
      updateNotifySystem({}, body).then(async (res) => {
        if (res?.codeNumber === -1) {
          toast.error(`${t("system.notification.fail")}`, {
            autoClose: 2000,
            position: "bottom-right",
            theme: "colored",
          });
          setLoading(false);
        } else if (res?.codeNumber === -2) {
          toast.error(`${t("system.token.mess")}`, {
            autoClose: 3000,
            position: "bottom-right",
            theme: "colored",
          });
          setTimeout(() => {
            logOutApi.logoutUser({}).then((data) => {
              if (data?.codeNumber === 0) {
                dispatch(logOutUser());
                navigate(
                  `${path.SYSTEM}/${path.LOGIN_SYSTEM}?redirect=/system`
                );
              }
            });
          }, 3000);
        } else if (res?.codeNumber === 1) {
          toast.error(res?.message, {
            autoClose: 2000,
            position: "bottom-right",
            theme: "colored",
          });
          setLoading(false);
        } else {
          await getNotiFy
            .getAllCount({
              type: "system",
            })
            .then((result) => {
              console.log(result);

              if (result?.codeNumber === 0) {
                setCountNotifyData(result?.allNotifyCount);
              }
            });
          getNotiFy
            .get({
              roleManager: action,
              page: pageCurrent,
              type: "system",
            })
            .then((res) => {
              if (res?.codeNumber === 0) {
                const data = res?.notify;
                if (data?.length > 0) {
                  for (let i = 0; i < data.length; i++) {
                    if (data[i]?.image?.data) {
                      data[i].image.data = convertBufferToBase64(
                        data[i].image.data
                      );
                    }
                  }
                }
                setNotifyData({
                  notify: res?.notify,
                  pageCurrent: res?.pageCurrent,
                  pageTotal: res?.pageTotal,
                });
                toast.success(`${t("system.notification.update")}`, {
                  autoClose: 2000,
                  position: "bottom-right",
                  theme: "colored",
                });
                setUser([]);
                setContentHtml("");
                setDetail("");
                setTitle("");
                inputFileRef.current.value = "";
                setImage("");
                setPreviewImage("");
                setIsUpdateNotify(false);
                setDataUpdateNotify(null);
                setLoading(false);
              }
            });
        }
      });
    } else {
      return;
    }
  };

  const handleOpenDeleteNotify = (data) => {
    setIsDeleteNotify(true);
    setDataDeleteNotify(data);
  };

  const isCloseDeleteNotify = () => {
    setIsDeleteNotify(false);
    setDataDeleteNotify(null);
  };

  const deleteNotify = async () => {
    setLoading(true);
    deleteNotifySystem({
      notifyId: dataDeleteNotify?.id,
      roleManager: dataDeleteNotify?.roleManager,
    }).then(async (res) => {
      if (res?.codeNumber === -1) {
        toast.error(`${t("system.notification.fail")}`, {
          autoClose: 2000,
          position: "bottom-right",
          theme: "colored",
        });
        setLoading(false);
      } else if (res?.codeNumber === -2) {
        toast.error(`${t("system.token.mess")}`, {
          autoClose: 3000,
          position: "bottom-right",
          theme: "colored",
        });
        setTimeout(() => {
          logOutApi.logoutUser({}).then((data) => {
            if (data?.codeNumber === 0) {
              dispatch(logOutUser());
              navigate(`${path.SYSTEM}/${path.LOGIN_SYSTEM}?redirect=/system`);
            }
          });
        }, 3000);
      } else if (res?.codeNumber === 1) {
        toast.error(res?.message, {
          autoClose: 2000,
          position: "bottom-right",
          theme: "colored",
        });
        setLoading(false);
      } else {
        await getNotiFy
          .getAllCount({
            type: "system",
          })
          .then((result) => {
            console.log(result);

            if (result?.codeNumber === 0) {
              setCountNotifyData(result?.allNotifyCount);
            }
          });
        getNotiFy
          .get({
            roleManager: action,
            page: pageCurrent,
            type: "system",
          })
          .then((res) => {
            console.log(res);

            if (res?.codeNumber === 0) {
              const data = res?.notify;
              if (data?.length > 0) {
                for (let i = 0; i < data.length; i++) {
                  if (data[i]?.image?.data) {
                    data[i].image.data = convertBufferToBase64(
                      data[i].image.data
                    );
                  }
                }
              }
              setNotifyData({
                notify: res?.notify,
                pageCurrent: res?.pageCurrent,
                pageTotal: res?.pageTotal,
              });
              toast.success(`${t("system.notification.delete")}`, {
                autoClose: 2000,
                position: "bottom-right",
                theme: "colored",
              });
              setIsDeleteNotify(false);
              setDataDeleteNotify(null);
              setLoading(false);
            }
          });
      }
    });
  };

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

        <div className="flex flex-col h-auto bg-slate-200 rounded-lg shadow backdrop-blur-md shadow-gray-300 mt-2 mb-1 pb-6 px-3">
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
                class="mb-1 text-headingColor opacity-80 flex items-center gap-1"
              >
                Select a user
              </label>
              <Select
                isMulti={isUpdateNotify ? false : true}
                value={user}
                name="position"
                options={userPotions}
                className="w-full bg-gray-50 text-gray-900 text-md rounded-lg"
                onChange={(e) => setUser(e)}
                onFocus={() => setNotifyCheckState("")}
              />
            </div>
          </div>
          <div className="w-full flex items-start justify-center gap-6 mt-3">
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => setNotifyCheckState("")}
              />
            </div>
            <div className="flex-1 flex-col justify-center flex">
              <label
                className="mb-1 text-headingColor opacity-80 flex items-center gap-1"
                htmlFor="file_input"
              >
                Image
              </label>
              <input
                className="block w-full text-sm text-gray-900 border border-gray-400 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id="file_input"
                type="file"
                onFocus={() => setNotifyCheckState("")}
                onChange={(e) => handleFileImage(e)}
                ref={inputFileRef}
              />
              {previewImage && (
                <div className="w-full h-[96px] my-2">
                  <div
                    style={{
                      backgroundImage: `url(${previewImage})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "contain",
                      height: "100%",
                      width: "50%",
                      cursor: "pointer",
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full flex items-start justify-center gap-6 mt-3">
            <div className="flex-1 flex flex-col justify-center">
              <label
                htmlFor="detail"
                className="mb-1 text-headingColor opacity-80 flex items-center gap-1"
              >
                Detail
              </label>
              <MdEditor
                value={detail}
                style={{
                  width: "100%",
                  height: "400px",
                  border: "1px solid #aaa",
                }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleEditorChange}
                onFocus={() => setNotifyCheckState("")}
              />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <button
              className={`${
                isUpdateNotify ? "bg-backColor" : "bg-blue-500"
              } text-white
              } text-white mt-6 py-2 px-1 font-semibold rounded-md shadow backdrop-blur-md bg-opacity-100 hover:bg-opacity-80`}
              style={{ maxWidth: "15%", width: "15%" }}
              onClick={
                isUpdateNotify
                  ? () => handleUpdateNotify()
                  : () => handleCreateNewNotify()
              }
            >
              {isUpdateNotify
                ? t("system.department.save")
                : t("system.department.add")}
            </button>
            {isUpdateNotify && (
              <button
                className={`text-white mt-6 py-2 px-1 font-semibold rounded-md shadow backdrop-blur-md bg-opacity-100 hover:bg-opacity-80 bg-blue-500`}
                style={{ maxWidth: "10%", width: "10%" }}
                onClick={() => handleCloseUpdateUser()}
              >
                {t("system.department.close")}
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="fixed z-50 top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25">
            <div className="absolute top-[50%] left-[50%]">
              <Loading />
            </div>
          </div>
        )}
        <div
          className={`flex items-center justify-center mt-12 gap-1 py-2 px-1 text-white font-semibold rounded-md
                  bg-blue-500
                }`}
          // type="text"
          // onClick={() => setIsCreateUser(true)}
          style={{ maxWidth: "14%", width: "14%" }}
        >
          Quản lý thông báo
        </div>

        <div className="w-full grid grid-cols-5 gap-5 mt-4">
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
            {`Student (${countNotifyData[1]})`}
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
            {`Department (${countNotifyData[0]})`}
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
            {`Faculty (${countNotifyData[2]})`}
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
            {`Teacher (${countNotifyData[3]})`}
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
            {`Health Support (${countNotifyData[4]})`}
          </button>
        </div>

        {action ? (
          <div className="notify w-full py-8 mx-auto flex flex-col items-start justify-start gap-8">
            {notifyData?.notify?.length > 0 &&
              notifyData?.notify.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="notify-item w-full relative flex items-center justify-start gap-6"
                  >
                    <div className="relative">
                      <img
                        src={
                          item?.image?.data
                            ? item.image.data
                            : "https://uet.vnu.edu.vn/wp-content/uploads/2018/01/GetArticleImage.jpg"
                        }
                        className="w-[300px] h-[180px]"
                        title={item?.notificationType?.valueVn}
                        alt={item?.notificationType?.valueVn}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: "-53px",
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
                            {`Th${new Date(item?.createdAt).getMonth() + 1}`}
                          </div>
                          <div
                            className="day text-white text-lg text-center"
                            style={{
                              lineHeight: "18px",
                            }}
                          >
                            {`${new Date(item?.createdAt).getDate()}`}
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
                        {item?.title}
                      </h3>
                      <div
                        className="text-md"
                        style={{
                          marginTop: "25px",
                          marginBottom: "22px",
                          color: "#015198",
                          height: "150px",
                          maxHeight: "150px",
                          lineHeight: "30px",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 5,
                        }}
                        dangerouslySetInnerHTML={{
                          __html: item?.contentHtml,
                        }}
                      ></div>
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
                      <div className="w-full flex items-start justify-start gap-4">
                        <button
                          class="px-5 py-1.5 flex transition-all ease-in duration-150 items-center justify-center overflow-hidden text-sm font-semibold border border-backColor text-white  rounded-md bg-backColor hover:text-backColor hover:bg-white"
                          onClick={() => handleOpenUpdateNotify(item)}
                        >
                          <span class="">
                            {i18n.language === "en" ? "Update" : "Cập nhật"}
                          </span>
                        </button>
                        <button
                          class="px-5 py-1.5 flex transition-all ease-in duration-150 items-center justify-center overflow-hidden text-sm font-semibold border border-red-500 text-white  rounded-md bg-red-500 hover:text-red-500 hover:bg-white"
                          onClick={() => handleOpenDeleteNotify(item)}
                        >
                          <span class="">
                            {i18n.language === "en" ? "Delete" : "Xoá bỏ"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

            <Pagination
              numberOfPage={notifyData?.pageCurrent}
              pages={notifyData?.pageTotal}
              handleNavigatePage={handleNavigatePage}
            />
          </div>
        ) : null}

        {isDeleteNotify && (
          <div className="fixed z-50 top-0 bottom-0 left-0 right-0 w-full max-h-full bg-black bg-opacity-25"></div>
        )}
        {isDeleteNotify && (
          <DeleteNotify
            dataNotifyDelete={dataDeleteNotify}
            isClose={isCloseDeleteNotify}
            deleteNotify={deleteNotify}
          />
        )}
      </div>
    </>
  );
};

export default NotificationSystem;
