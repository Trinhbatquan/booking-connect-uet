import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Loading from "../../../utils/Loading";
import { useNavigate, useParams } from "react-router";
import { news } from "../../../services/newsService";
import convertBufferToBase64 from "../../../utils/convertBufferToBase64";
import { useTranslation } from "react-i18next";
import { path } from "../../../utils/constant";
import { RiArrowDownSLine } from "react-icons/ri";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import moment from "moment";
import { getNotiFy } from "../../../services/notificationService";
import nodata from "../../../assets/image/nodata.png";
import { useSelector } from "react-redux";

const NotificationDetailManager = () => {
  const mdParser = new MarkdownIt(/* Markdown-it options */);
  const code_url = useParams().code_url;
  const [loading, setLoading] = useState(true);
  const [notifyDetail, setNotifyDetail] = useState();
  const { i18n } = useTranslation();
  const currentUser = useSelector((state) => state.authReducer);

  useEffect(() => {
    getNotiFy
      .getOneNotifyManager({ code_url, roleManager: currentUser?.role })
      .then((data) => {
        if (data?.codeNumber === 0) {
          const response = data?.notify;
          if (response?.image?.data) {
            response.image.data = convertBufferToBase64(response.image.data);
          }
          setNotifyDetail(response);
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
  }, []);

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
      <div className="w-full" style={{ height: "110px" }}></div>

      <div
        className="mt-[34px] pt-[20px] mb-[20px] mx-[10%] pr-[30px] pl-[65px]"
        style={{
          border: "1px solid #f2f2f2",
          borderRadius: "3px",
          minHeight: "300px",
        }}
      >
        {notifyDetail?.title ? (
          <>
            <div className=" relative mb-[30px]">
              <h2
                className="text-blurThemeColor font-semibold"
                style={{
                  lineHeight: "1.36",
                  fontSize: "30px",
                }}
              >
                {notifyDetail?.title}
              </h2>
            </div>
            <div
              className="pb-[15px]"
              style={{
                borderBottom: "1px dashed #e3e3e3",
              }}
            >
              {moment(notifyDetail?.updatedAt).format("DD/MM/YYYY")}
            </div>

            <div
              className="mt-[20px] mb-[20px]"
              dangerouslySetInnerHTML={{
                __html: notifyDetail?.contentHtml,
              }}
              style={{
                fontSize: "16px",
              }}
            ></div>
          </>
        ) : (
          <img
            src={nodata}
            alt=""
            style={{
              height: "300px",
              width: "70%",
              objectFit: "cover",
              margin: "0 auto",
            }}
          />
        )}
      </div>
      {/* <HomeFooter /> */}
    </div>
  );
};

export default NotificationDetailManager;