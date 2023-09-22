import React from "react";

import { BsArrowUp, BsArrowDown } from "react-icons/bs";

const Cart = ({
  title = "Hello",
  number = 1,
  Symbol,
  time = "Since last week",
  styleSymbol = {},
}) => {
  console.log(styleSymbol);
  return (
    <div
      className="cart-container flex flex-col items-start"
      style={{
        backgroundColor: "white",
        border: "1px solid rgba(0,0,0,.125)",
        borderRadius: ".375rem",
        padding: "1rem 1.5rem",
        boxShadow:
          "rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem",
      }}
    >
      <div className="w-full flex flex-wrap items-start justify-around gap-1">
        <div className="flex-1 max-w-full">
          <h5
            className="uppercase font-semibold"
            style={{ color: "rgb(123, 128, 154)" }}
          >
            {title}
          </h5>
          <span
            className="text-3xl font-semibold"
            style={{ color: "rgb(52, 71, 103)" }}
          >
            {number}
          </span>
        </div>

        <div
          className="w-16 h-16 flex items-center justify-center"
          style={styleSymbol}
        >
          {Symbol}
        </div>
      </div>

      <p className="mt-3 mb-0 text-sm" style={{ color: `rgb(123, 128, 154)` }}>
        {/* <span className="mr-2" style={{ color: "#2dce89" }}>
          {increase ? <BsArrowUp /> : <BsArrowDown />}
          {`${percent}%`}
        </span> */}
        <span className="">{time}</span>
      </p>
    </div>
  );
};

export default Cart;
