import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Loading from "../../../utils/Loading";
import HomeHeader from "../HomeHeader";
import { useNavigate } from "react-router";
import { news } from "../../../services/newsService";
import convertBufferToBase64 from "../../../utils/convertBufferToBase64";
import { useTranslation } from "react-i18next";
import { path } from "../../../utils/constant";
import { RiArrowDownSLine } from "react-icons/ri";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import HomeFooter from "../HomeFooter";

const NewsSeeAll = () => {
  const [loading, setLoading] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const mdParser = new MarkdownIt(/* Markdown-it options */);

  useEffect(() => {
    setLoading(true);
    news.get({ page: currentPage }).then((data) => {
      if (data?.codeNumber === 0) {
        const { news, pageCurrent, countNews } = data;
        if (news?.length > 0) {
          for (let i = 0; i < news.length; i++) {
            if (news[i]?.avatarNew?.data) {
              news[i].avatarNew.data = convertBufferToBase64(
                news[i].avatarNew.data
              );
            }
          }
          setNewsData(newsData.concat(news));
          setCurrentPage(+pageCurrent);
          setTotalPage(+countNews);
          setLoading(false);
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
  }, [currentPage]);

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
        className="mt-[34px] pt-[20px] mb-[20px] mx-[10%] pr-[30px] pl-[65px]"
        style={{
          border: "1px solid #f2f2f2",
          borderRadius: "3px",
        }}
      >
        <div className=" relative mb-[30px]">
          <h2 className="text-blurThemeColor font-semibold">
            {i18n.language === "en" ? "News" : "Tin Tức"}
          </h2>
          <div
            style={{
              position: "absolute",
              top: "4px",
              bottom: "4px",
              width: "11px",
              left: "-31px",
              backgroundColor: "#f68500",
            }}
          ></div>
        </div>

        <div className="flex flex-col items-start justify-start">
          {newsData?.length === 0
            ? ""
            : newsData.map((item, index) => {
                return (
                  <div
                    className="teacher-see-all-item w-full gap-8"
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      borderBottom: "1px dashed #e3e3e3",
                      marginBottom: "20px",
                      paddingBottom: "20px",
                    }}
                    // onClick={() =>
                    //   navigate(`${path.HOMEPAGE}/${item?.code_url}/ids-role/R5`)
                    // }
                  >
                    <div className="relative w-[230px] h-[152px] mx-auto flex items-start justify-center">
                      <div
                        className=""
                        style={{
                          backgroundImage: `url(${item?.avatarNew?.data})`,
                          backgroundSize: "cover",
                          width: "100%",
                          height: "100%",
                          backgroundRepeat: "no-repeat",
                          borderRadius: "8px",
                        }}
                      ></div>
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
                    <div className="flex-1">
                      <h3
                        style={{
                          margin: "0px",
                          color: "#343434",
                        }}
                      >
                        {item?.title}
                      </h3>
                      <div
                        className="text-md"
                        style={{
                          marginTop: "10px",
                          marginBottom: "22px",
                          color: "#015198",
                          height: "90px",
                          maxHeight: "90px",
                          lineHeight: "30px",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 3,
                        }}
                        dangerouslySetInnerHTML={{
                          __html: item?.contentHtml,
                        }}
                      ></div>
                      <div className="w-full flex items-start justify-start gap-4">
                        <button
                          class="px-5 py-1.5 flex cursor-pointer transition-all ease-in duration-150 items-center justify-center overflow-hidden text-sm font-semibold border border-backColor text-white  rounded-md bg-backColor hover:text-backColor hover:bg-white"
                          onClick={() =>
                            navigate(
                              `${path.HOMEPAGE}/${path.detail_news}/${item?.code_url}`
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

        {newsData?.length < totalPage && (
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
              onClick={() => setCurrentPage(currentPage + 1)}
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
      </div>
      <HomeFooter />
    </div>
  );
};

export default NewsSeeAll;
