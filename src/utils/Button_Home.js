const Button = ({ text, click, date, selected }) => {
  console.log(text);
  return (
    <button
      type="button"
      className={`"text-headingColor ${
        !selected
          ? "bg-yellow-300 hover:bg-blue-700 hover:text-white"
          : "bg-gray-500 cursor-text"
      } transition-all duration-300 font-semibold  text-sm px-3.5 py-3 text-center mr-2 mb-2`}
      style={{ minWidth: "125px" }}
      onClick={!selected ? () => click(text, date) : null}
    >
      {text}
    </button>
  );
};

export default Button;
