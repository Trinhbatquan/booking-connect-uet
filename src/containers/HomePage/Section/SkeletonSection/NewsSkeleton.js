import React from "react";
import Skeleton from "../../../../utils/Skeleton";

const NewsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-12" style={{}}>
      <div className="cursor-pointer  relative h-[375px] rounded-lg overflow-hidden">
        <Skeleton
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: "4",
          }}
        />
      </div>

      <div className="h-[375px] overflow-hidden grid grid-rows-3 grid-flow-col">
        <div
          className=" cursor-pointer  flex items-start justify-start h-[125px] w-full gap-8 mb-[20px]
        pb-[17px]"
        >
          <Skeleton
            style={{
              overflow: "hidden",
              borderRadius: "10px",
              width: "150px",
              height: "100px",
              objectFit: "cover",
            }}
          />
          <div className="flex-1">
            <Skeleton className="h-[15px]" />
            <Skeleton className="mt-[10px] h-[15px]" />
            <p
              className="flex items-start justify-start w-full gap-1 pt-[10px]"
              style={{
                color: "#f68500",
                fontWeight: "600",
                lineHeight: "1.5",
              }}
            >
              <Skeleton className="h-[24px] w-[70px]" />
            </p>
          </div>
        </div>

        <div
          className=" cursor-pointer  flex items-center justify-start h-[125px] w-full gap-8 mb-[20px]
        pb-[17px]"
        >
          <Skeleton
            style={{
              overflow: "hidden",
              borderRadius: "10px",
              width: "150px",
              height: "100px",
              objectFit: "cover",
            }}
          />
          <div className="flex-1 pb-[10px] ">
            <Skeleton className="h-[15px]" />
            <Skeleton className="mt-[10px] h-[15px]" />
            <p
              className="flex items-start justify-start w-full gap-1 pt-[10px]"
              style={{
                color: "#f68500",
                fontWeight: "600",
                lineHeight: "1.5",
              }}
            >
              <Skeleton className="h-[24px] w-[70px]" />
            </p>
          </div>
        </div>

        <div
          className=" cursor-pointer  flex items-end justify-start h-[125px] w-full gap-8 mb-[20px]
        pb-[17px]"
        >
          <Skeleton
            style={{
              overflow: "hidden",
              borderRadius: "10px",
              width: "150px",
              height: "100px",
              objectFit: "cover",
            }}
          />
          <div className="flex-1 pb-[20px]">
            <Skeleton className="h-[15px]" />
            <Skeleton className="mt-[10px] h-[15px]" />
            <p
              className="flex items-start justify-start w-full gap-1 pt-[10px]"
              style={{
                color: "#f68500",
                fontWeight: "600",
                lineHeight: "1.5",
              }}
            >
              <Skeleton className="h-[24px] w-[70px]" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsSkeleton;
