
const NextArrow = (props) => {
  const { onClick, className, style, type } = props;
  return (
    <div
      onClick={onClick}
      className={`${className} ${type && "slick-disabled"}`}
      style={{
        display: "block",
        ...style,
      }}
    >
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick, className, style, type} = props;

  return (
    <div
      onClick={onClick}
      className={`${className } ${type && "slick-disabled"}`}
      style={{
        display: "block",
        ...style,
      }}
    >
    </div>
  );
};

export { NextArrow, PrevArrow };
