import React from "react";
import Skeleton from "../../../../utils/Skeleton";

const FacultySkeleton = () => {
  return (
    <>
      <div
        className="faculty-skeleton-img"
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
            height: "85%",
            borderRadius: "8px",
          }}
        />
      </div>
      <div
        style={{
          flex: 1,
          margin: "0 auto",
          textAlign: "center",
          height: "25%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Skeleton className="w-full h-[25%]" />
        <Skeleton className="w-full h-[25%] mt-1" />
        <Skeleton className="w-full h-[25%] mt-1" />
        <Skeleton className="w-full h-[25%] mt-1" />
      </div>
    </>
  );
};

export default FacultySkeleton;
