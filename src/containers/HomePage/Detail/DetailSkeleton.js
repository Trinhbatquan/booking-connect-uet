import React from "react";
import Skeleton from "../../../utils/Skeleton";

const DetailSkeleton = () => {
  return (
    <div className="detail-teacher-faculty-container">
      <div className="detail-teacher">
        <div className=" h-[80px] w-[80px] flex-3">
          <Skeleton
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
            }}
          />
        </div>
        <div className="detail-teacher-content flex-1">
          <p className="detail-teacher-content-name">
            <Skeleton className="w-full h-[30px]" />
          </p>
          <p className="py-1">
            <Skeleton className="w-full h-[10px] mb-1" />
            <Skeleton className="w-full h-[10px] mb-1" />
            <Skeleton className="w-full h-[10px] mb-1" />
            <Skeleton className="w-full h-[10px]" />
          </p>
        </div>
      </div>
      <div className="action-teacher">
        <div className="action-select flex items-center justify-start gap-4">
          <Skeleton className="flex-1 h-[35px]" />
          <Skeleton className="flex-1 h-[35px]" />
        </div>
        <div className="w-full">
          <Skeleton className="h-[10px] w-full my-3" />
        </div>
        <div className="w-full grid grid-cols-4 gap-3">
          {Array(10)
            .fill(0)
            ?.map((item, index) => {
              return <Skeleton key={index} className="h-[20px]" />;
            })}
        </div>
      </div>
    </div>
  );
};

export default DetailSkeleton;
