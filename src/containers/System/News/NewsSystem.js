import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";

import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import Loading from "../../../utils/Loading";
import Pagination from "../../../utils/Pagination";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { path } from "../../../utils/constant";
import convertBufferToBase64 from "../../../utils/convertBufferToBase64";
import convertFileToBase64 from "../../../utils/convertFileToBase64";
import { logOutApi } from "../../../services/userService";
import { logOutUser } from "../../../redux/authSlice";
import { news } from "../../../services/newsService";
import { handleMessageFromBackend } from "../../../utils/handleMessageFromBackend";
import DeleteNotify from "../NotificationSystem/DeleteNotify";
import { FaStreetView } from "react-icons/fa";
import nodata from "../../../assets/image/nodata.png";

const NewsSystem = () => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mdParser = new MarkdownIt(/* Markdown-it options */);
  const [notifyCheckState, setNotifyCheckState] = useState("");
  const [title, setTitle] = useState("");
  const inputFileRef = useRef();
  const [previewImage, setPreviewImage] = useState("");
  const [avatarNew, setAvatarNew] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [contentHtml, setContentHtml] = useState("");
  const [pageCurrent, setPageCurrent] = useState(1);
  const [countNewsData, setCountNewsData] = useState(0);
  const [isUpdateNews, setIsUpdateNews] = useState(false);
  const [dataUpdateNews, setDataUpdateNews] = useState();
  const [isDeleteNews, setIsDeleteNews] = useState(false);
  const [dataDeleteNews, setDataDeleteNews] = useState();
  const [newsData, setNewsData] = useState();

  console.log(loading);

  useEffect(() => {
    news.get({ page: pageCurrent }).then((data) => {
      if (data?.codeNumber === 0) {
        const response = data?.news;
        if (response?.length > 0) {
          for (let i = 0; i < response.length; i++) {
            if (response[i]?.avatarNew?.data) {
              response[i].avatarNew.data = convertBufferToBase64(
                response[i].avatarNew.data
              );
            }
          }
          setNewsData({
            news: response,
            pageCurrent: data?.pageCurrent,
            pageTotal: data?.pageTotal,
          });
          setCountNewsData(data?.countNews);
          console.log(newsData);
        }
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(
          i18n.language === "en" ? data?.message_en : data?.message_vn,
          {
            autoClose: 3000,
            theme: "colored",
            position: "bottom-right",
          }
        );
      }
    });
  }, [pageCurrent]);

  const handleFileImage = async (e) => {
    let data = e.target.files;
    let file = data[0];
    if (file) {
      let urlAvatar = URL.createObjectURL(file);
      setPreviewImage(urlAvatar);
      try {
        const base64File = await convertFileToBase64(file);
        setAvatarNew(base64File);
      } catch (e) {
        console.log("base64 file " + e);
      }
    }
  };

  function handleEditorChange({ html, text }) {
    setContentHtml(html);
    setContent(text);
  }
  const handleNavigatePage = (page) => setPageCurrent(page);

  const handleCheckNullState = () => {
    let result = true;
    const stateArr = [title, content, avatarNew];
    const notification_en = ["Title", "Content", "Avatar"];
    const notification_vi = ["Trường chủ đề", "Trường chi tiết", "Trường ảnh"];
    if (isUpdateNews) {
      for (let i = 0; i < stateArr.length - 1; i++) {
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

  const handleCreateNews = async () => {
    if (handleCheckNullState()) {
      setLoading(true);
      setNotifyCheckState("");

      //create
      await news
        .create(
          {},
          {
            title,
            content,
            contentHtml,
            avatarNew,
          }
        )
        .then((data) => {
          if (data?.codeNumber === 0) {
            news.get({}).then((data) => {
              if (data?.codeNumber === 0) {
                const response = data?.news;
                if (response?.length > 0) {
                  for (let i = 0; i < response.length; i++) {
                    if (response[i]?.avatarNew?.data) {
                      response[i].avatarNew.data = convertBufferToBase64(
                        response[i].avatarNew.data
                      );
                    }
                  }
                  setNewsData({
                    news: response,
                    pageCurrent: data?.pageCurrent,
                    pageTotal: data?.pageTotal,
                  });
                  setCountNewsData(data?.countNews);
                  setLoading(false);
                  setContentHtml("");
                  setContent("");
                  setTitle("");
                  inputFileRef.current.value = "";
                  setAvatarNew("");
                  setPreviewImage("");
                  // setIsUpdateNotify(false);
                  // setDataUpdateNotify(null);
                  toast.success(`${t("system.notification.create")}`, {
                    autoClose: 3000,
                    theme: "colored",
                    position: "bottom-right",
                  });
                }
              } else {
                setLoading(false);
                toast.error(
                  i18n.language === "en" ? data?.message_en : data?.message_vn,
                  {
                    autoClose: 3000,
                    theme: "colored",
                    position: "bottom-right",
                  }
                );
              }
            });
          } else {
            setLoading(false);
            const response = handleMessageFromBackend(data, i18n.language);
            toast.error(response, {
              autoClose: 3000,
              theme: "colored",
              position: "bottom-right",
            });
            if (data?.codeNumber === -2) {
              setTimeout(() => {
                logOutApi.logoutUser({}).then((data) => {
                  if (data?.codeNumber === 0) {
                    dispatch(logOutUser());
                    navigate(
                      `${path.SYSTEM}/${path.LOGIN_SYSTEM}?redirect=/system`
                    );
                  }
                });
              }, 5000);
            }
          }
        });
    } else {
      return;
    }
  };

  const handleOpenUpdateNews = (data) => {
    setIsUpdateNews(true);
    setDataUpdateNews(data);

    setTitle(data.title);
    setContent(data.content);
    setContentHtml(data.contentHtml);
    if (data?.avatarNew?.data) {
      setPreviewImage(data?.avatarNew?.data);
    } else {
      setPreviewImage("");
    }
  };

  const handleCloseUpdateNews = () => {
    setContent("");
    setContentHtml("");
    setTitle("");
    setAvatarNew("");
    setPreviewImage("");
    inputFileRef.current.value = "";
    setDataUpdateNews("");
    setIsUpdateNews(false);
  };

  const handleUpdateNews = async () => {
    if (handleCheckNullState()) {
      setLoading(true);
      setNotifyCheckState("");

      //create
      await news
        .update(
          {},
          {
            id: dataUpdateNews?.id,
            title,
            content,
            contentHtml,
            avatarNew,
          }
        )
        .then((res) => {
          if (res?.codeNumber === 0) {
            news.get({}).then((data) => {
              if (data?.codeNumber === 0) {
                const response = data?.news;
                if (response?.length > 0) {
                  for (let i = 0; i < response.length; i++) {
                    if (response[i]?.avatarNew?.data) {
                      response[i].avatarNew.data = convertBufferToBase64(
                        response[i].avatarNew.data
                      );
                    }
                  }
                  setNewsData({
                    news: response,
                    pageCurrent: data?.pageCurrent,
                    pageTotal: data?.pageTotal,
                  });
                  setCountNewsData(data?.countNews);
                  setLoading(false);
                  setContentHtml("");
                  setContent("");
                  setTitle("");
                  inputFileRef.current.value = "";
                  setAvatarNew("");
                  setPreviewImage("");
                  setIsUpdateNews(false);
                  setDataUpdateNews(null);
                  toast.success(
                    i18n.language === "en" ? res?.message_en : res?.message_vn,
                    {
                      autoClose: 3000,
                      theme: "colored",
                      position: "bottom-right",
                    }
                  );
                }
              } else {
                setLoading(false);
                toast.error(
                  i18n.language === "en" ? data?.message_en : data?.message_vn,
                  {
                    autoClose: 3000,
                    theme: "colored",
                    position: "bottom-right",
                  }
                );
              }
            });
          } else {
            setLoading(false);
            const response = handleMessageFromBackend(res, i18n.language);
            toast.error(response, {
              autoClose: 3000,
              theme: "colored",
              position: "bottom-right",
            });
            if (res?.codeNumber === -2) {
              setTimeout(() => {
                logOutApi.logoutUser({}).then((data) => {
                  if (data?.codeNumber === 0) {
                    dispatch(logOutUser());
                    navigate(
                      `${path.SYSTEM}/${path.LOGIN_SYSTEM}?redirect=/system`
                    );
                  }
                });
              }, 5000);
            }
          }
        });
    }
  };

  const handleOpenDeleteNews = (data) => {
    setIsDeleteNews(true);
    setDataDeleteNews(data);
  };

  const isCloseDeleteNews = () => {
    setIsDeleteNews(false);
    setDataDeleteNews(null);
  };

  const deleteNews = async () => {
    setLoading(true);
    //create
    await news.delete({ id: dataDeleteNews?.id }).then((res) => {
      if (res?.codeNumber === 0) {
        news.get({}).then((data) => {
          if (data?.codeNumber === 0) {
            const response = data?.news;
            if (response?.length > 0) {
              for (let i = 0; i < response.length; i++) {
                if (response[i]?.avatarNew?.data) {
                  response[i].avatarNew.data = convertBufferToBase64(
                    response[i].avatarNew.data
                  );
                }
              }
              setNewsData({
                news: response,
                pageCurrent: data?.pageCurrent,
                pageTotal: data?.pageTotal,
              });
              setCountNewsData(data?.countNews);
              setLoading(false);
              setIsDeleteNews(false);
              setDataDeleteNews(null);
              toast.success(
                i18n.language === "en" ? res?.message_en : res?.message_vn,
                {
                  autoClose: 3000,
                  theme: "colored",
                  position: "bottom-right",
                }
              );
            }
          } else {
            setLoading(false);
            toast.error(
              i18n.language === "en" ? data?.message_en : data?.message_vn,
              {
                autoClose: 3000,
                theme: "colored",
                position: "bottom-right",
              }
            );
          }
        });
      } else {
        setLoading(false);
        const response = handleMessageFromBackend(res, i18n.language);
        toast.error(response, {
          autoClose: 3000,
          theme: "colored",
          position: "bottom-right",
        });
        if (res?.codeNumber === -2) {
          setTimeout(() => {
            logOutApi.logoutUser({}).then((data) => {
              if (data?.codeNumber === 0) {
                dispatch(logOutUser());
                navigate(
                  `${path.SYSTEM}/${path.LOGIN_SYSTEM}?redirect=/system`
                );
              }
            });
          }, 5000);
        }
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
          {i18n.language === "en" ? "News" : "Tin Tức"}
        </p>
        <div
          className={`flex items-center justify-center mt-7 gap-1 py-2 px-1 text-white font-semibold rounded-lg
            bg-blue-500 mx-auto
          }`}
          // type="text"
          // onClick={() => setIsCreateUser(true)}
          style={{ maxWidth: "14%", width: "14%" }}
        >
          {i18n.language === "en" ? "Create news" : "Tạo tin tức"}
        </div>

        <div className="flex flex-col h-auto bg-slate-200 rounded-lg shadow backdrop-blur-md shadow-gray-300 mt-2 mb-1 pb-6 px-3">
          <span
            className="mx-auto text-red-500 mb-2"
            style={notifyCheckState ? { opacity: "1" } : { opacity: "0" }}
          >
            {notifyCheckState ? notifyCheckState : "Null"}
          </span>
          <div className="w-full flex items-start justify-center gap-6 mt-3">
            <div className="flex-1 flex flex-col justify-center relative">
              <label
                htmlFor="title"
                className="mb-1 text-headingColor opacity-80 flex items-center gap-1"
              >
                {i18n.language === "en" ? "Title" : "Chủ đề"}
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
                value={content}
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
                isUpdateNews ? "bg-backColor" : "bg-blue-500"
              } text-white
              } text-white mt-6 py-2 px-1 font-semibold rounded-md shadow backdrop-blur-md bg-opacity-100 hover:bg-opacity-80`}
              style={{ maxWidth: "15%", width: "15%" }}
              onClick={
                isUpdateNews
                  ? () => handleUpdateNews()
                  : () => handleCreateNews()
              }
            >
              {isUpdateNews
                ? t("system.department.save")
                : t("system.department.add")}
            </button>
            {isUpdateNews && (
              <button
                className={`text-white mt-6 py-2 px-1 font-semibold rounded-md shadow backdrop-blur-md bg-opacity-100 hover:bg-opacity-80 bg-blue-500`}
                style={{ maxWidth: "10%", width: "10%" }}
                onClick={() => handleCloseUpdateNews()}
              >
                {t("system.department.close")}
              </button>
            )}
          </div>
        </div>
        {loading && (
          <div className="fixed loading-overlay top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25">
            <div className="absolute top-[50%] left-[50%]">
              <Loading />
            </div>
          </div>
        )}
        <div className="mt-12 flex items-start justify-between">
          <div
            className={`flex items-center justify-center gap-1 py-2 px-1 text-white font-semibold rounded-md
                  bg-blurThemeColor
                }`}
            // type="text"
            // onClick={() => setIsCreateUser(true)}
            style={{ maxWidth: "14%", width: "14%" }}
          >
            {i18n.language === "en" ? "News Management" : "Quản lý tin tức"}
          </div>
          <div className="w-fit bg-blurThemeColor font-semibold text-white rounded-lg py-[8px] px-[12px]">
            <p className="text-white text-md flex items-center justify-start gap-1.5">
              <FaStreetView className="text-white text-xl" />
              {`${
                i18n.language === "en" ? "Total of news:" : "Tổng số tin tức:"
              } ${countNewsData}`}
            </p>
          </div>
        </div>
        {/* <p style={{ padding: "10px 26px" }}>
          {`${
            i18n.language === "en" ? "Total of news:" : "Tổng số tin tức:"
          } ${countNewsData}`}
        </p> */}
        <div className="notify w-full py-8 mx-auto flex flex-col items-start justify-start gap-8">
          {newsData?.news?.length > 0 ? (
            newsData?.news?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="notify-item w-full relative flex items-center justify-start gap-6"
                >
                  <div className="relative">
                    <img
                      src={
                        item?.avatarNew?.data
                          ? item.avatarNew.data
                          : "https://uet.vnu.edu.vn/wp-content/uploads/2018/01/GetArticleImage.jpg"
                      }
                      className="w-[300px] h-[180px]"
                      title={""}
                      alt={""}
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
                    <h4
                      style={{
                        marginBottom: "9px",
                        color: "#343434",
                      }}
                    >
                      {item?.title}
                    </h4>
                    <div
                      className="text-md"
                      style={{
                        marginTop: "10px",
                        marginBottom: "22px",
                        color: "#015198",
                        height: "42px",
                        maxHeight: "42px",
                        lineHeight: "20px",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
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
                        onClick={() => handleOpenUpdateNews(item)}
                      >
                        <span class="">
                          {i18n.language === "en" ? "Update" : "Cập nhật"}
                        </span>
                      </button>
                      <button
                        class="px-5 py-1.5 flex transition-all ease-in duration-150 items-center justify-center overflow-hidden text-sm font-semibold border border-red-500 text-white  rounded-md bg-red-500 hover:text-red-500 hover:bg-white"
                        onClick={() => handleOpenDeleteNews(item)}
                      >
                        <span class="">
                          {i18n.language === "en" ? "Delete" : "Xoá bỏ"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <img
              src={nodata}
              alt=""
              style={{
                height: "250px",
                width: "60%",
                objectFit: "cover",
                margin: "0 auto",
              }}
            />
          )}
          {newsData?.news?.length > 0 && (
            <Pagination
              numberOfPage={newsData?.pageCurrent}
              pages={newsData?.pageTotal}
              handleNavigatePage={handleNavigatePage}
            />
          )}
        </div>
        {isDeleteNews && (
          <div className="fixed z-50 top-0 bottom-0 left-0 right-0 w-full max-h-full bg-black bg-opacity-25"></div>
        )}
        {isDeleteNews && (
          <DeleteNotify
            dataNotifyDelete={dataDeleteNews}
            isClose={isCloseDeleteNews}
            deleteNotify={deleteNews}
          />
        )}
      </div>
    </>
  );
};

export default NewsSystem;
