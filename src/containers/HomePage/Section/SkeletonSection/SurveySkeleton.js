import React from "react";
import Skeleton from "../../../../utils/Skeleton";

const SurveySkeleton = () => {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-[391px]">
        <div
          className={`feedback_item w-full
                        pt-[60px]
                        `}
          style={{
            transition: "all 0.3s ease",
            textAlign: "center",
          }}
        >
          <Skeleton
            className={`px-[52px] text-gray-400 minHeight-[201px]
                            `}
            style={{
              borderRadius: "15px",
              paddingTop: "65px",
              paddingBottom: "52px",
            }}
          ></Skeleton>
          <div
            className={`feedback_item-detail -mt-[39px] py-0 px-[30px]
                            `}
            style={{
              zIndex: 5,
            }}
          >
            <div
              className={`feedback_avatar w-[90px] h-[90px] border-spacing-2 border-white
                            `}
              style={{
                borderRadius: "50%",
                margin: "0 auto 4px",
                backgroundColor: "#fff",
              }}
            >
              <Skeleton
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </div>
            <p
              className={`font-semibold mx-auto`}
              style={{
                fontSize: "14px",
                margin: "0 auto 2px",
                lineHeight: "1.5",
              }}
            >
              <Skeleton className="w-[80%] h-[20px] mx-auto my-2" />
            </p>
            <p className={`font-semibold mx-auto`}>
              <Skeleton className="w-[full] h-[20px] mx-auto" />
            </p>
          </div>
        </div>
      </div>

      <div className={`w-[391px]`}>
        <div
          className={`feedback_item w-full`}
          style={{
            transition: "all 0.3s ease",
            textAlign: "center",
          }}
        >
          <Skeleton
            className={`feedback_item-content px-[32px] text-white minHeight-[224px] -mx-[30px] relative
                `}
            style={{
              borderRadius: "15px",
              paddingTop: "65px",
              paddingBottom: "52px",
            }}
          ></Skeleton>
          <div
            className={`feedback_item-detail relative mt-[43px] pt-0 px-0
                          `}
            style={{
              zIndex: 5,
            }}
          >
            <div
              className={`feedback_avatar absolute w-[144px] h-[144px] inset-0 -top-[85px] p-[8px]
                             `}
              style={{
                borderRadius: "50%",
                margin: "0 auto 4px",
                backgroundColor: "#fff",
                border: "1px solid rgb(249, 221, 221)",
              }}
            >
              <Skeleton
                alt=""
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </div>
            <p
              className={`font-semibold mx-auto pt-[72px]`}
              style={{
                fontSize: "14px",
                margin: "0 auto 2px",
                lineHeight: "1.5",
              }}
            >
              <Skeleton className="w-[80%] h-[20px] mx-auto my-2" />
            </p>
            <p className={``}>
              <Skeleton className="w-[full] h-[20px] mx-auto" />
            </p>
          </div>
        </div>
      </div>

      <div className="w-[391px]">
        <div
          className={`feedback_item w-full
                        pt-[60px]
                        `}
          style={{
            transition: "all 0.3s ease",
            textAlign: "center",
          }}
        >
          <Skeleton
            className={`px-[52px] text-gray-400 minHeight-[201px]
                            `}
            style={{
              borderRadius: "15px",
              paddingTop: "65px",
              paddingBottom: "52px",
            }}
          ></Skeleton>
          <div
            className={`feedback_item-detail -mt-[39px] py-0 px-[30px]
                            `}
            style={{
              zIndex: 5,
            }}
          >
            <div
              className={`feedback_avatar w-[90px] h-[90px] border-spacing-2 border-white
                            `}
              style={{
                borderRadius: "50%",
                margin: "0 auto 4px",
                backgroundColor: "#fff",
              }}
            >
              <Skeleton
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </div>
            <p
              className={`font-semibold mx-auto`}
              style={{
                fontSize: "14px",
                margin: "0 auto 2px",
                lineHeight: "1.5",
              }}
            >
              <Skeleton className="w-[80%] h-[20px] mx-auto my-2" />
            </p>
            <p className={`font-semibold mx-auto`}>
              <Skeleton className="w-[full] h-[20px] mx-auto" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveySkeleton;
