import React from "react";
import Skeleton from "./../../../../utils/Skeleton";

const DepartmentSkeleton = () => {
  return (
    <>
      <div
        className="department-skeleton-img"
        style={{
          width: "100%",
          height: "80%",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Skeleton
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      <div
        style={{
          flex: 1,
          margin: "11px 0 0 0",
          textAlign: "center",
          height: "20%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Skeleton className="w-full h-[40%]" />
        <Skeleton className="w-full h-[40%] mt-1" />
      </div>
    </>
  );
};

export default DepartmentSkeleton;
