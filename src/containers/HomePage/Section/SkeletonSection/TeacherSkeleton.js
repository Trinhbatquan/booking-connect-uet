import React from "react";
import Skeleton from "../../../../utils/Skeleton";

const TeacherSkeleton = () => {
  return (
    <>
      <div
        className="teacher-skeleton-img"
        style={{
          border: "1px solid #eee",
          width: "95%",
          maxWidth: "95%",
          height: "220px",
          maxHeight: "220px",
          borderRadius: "4px",
        }}
      >
        <div
          style={{
            backgroundImage: "none",
            marginTop: "10px",
            marginBottom: " 5px",
            width: "120px",
            height: "120px",
            borderRadius: " 50%",
            margin: "10px auto",
          }}
        >
          <Skeleton
            style={{
              width: "auto",
              margin: "0 auto",
              height: "100%",
              borderRadius: "50%",
            }}
          />
        </div>
        <div
          style={{
            paddingTop: "5px",
            textAlign: "center",
            width: "85%",
            height: "50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            margin: "0 auto",
          }}
        >
          <Skeleton className="w-full h-[40%]" />
          <Skeleton className="w-full h-[40%] mt-1" />
        </div>
      </div>
    </>
  );
};

export default TeacherSkeleton;
