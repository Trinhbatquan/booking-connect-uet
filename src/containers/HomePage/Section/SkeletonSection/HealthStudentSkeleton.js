import React from "react";
import Skeleton from "../../../../utils/Skeleton";

const HealthStudentSkeleton = () => {
  return (
    <div
      className="health-skeleton"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "500px",
        minHeight: "500px",
        width: "25%",
      }}
    >
      <div
        className="item-health-skeleton"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Skeleton
          style={{
            width: "100%",
            height: "65%",
            margin: "0 auto",
            borderRadius: "15px 15px 0 0",
          }}
        />
        <div
          style={{
            margin: "0 auto",
            width: "100%",
            flex: 1,
            padding: "20px 20px 12px",
            position: "relative",
            zIndex: 4,
            flexGrow: 1,
            transition: "background-color 0.5s ease",
            borderRadius: "0 0 15px 15px",
            backgroundColor: "#fff",
            textAlign: "center",
          }}
        >
          <Skeleton className="w-full h-[20px]" />
        </div>
      </div>
    </div>
  );
};

export default HealthStudentSkeleton;
