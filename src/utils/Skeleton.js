import React from "react";
import "../styles/styles.scss";

const Skeleton = ({ className, style }) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        ...style,
      }}
    ></div>
  );
};

export default Skeleton;
