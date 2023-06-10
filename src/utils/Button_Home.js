const Button = ({ text }) => {
  return (
    <button
      type="button"
      className="text-headingColor bg-yellow-300 hover:bg-blue-700 hover:text-white transition-all duration-300 font-semibold focus:outline-none focus:ring-4 focus:ring-green-300 rounded-sm text-sm px-3.5 py-3 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      style={{ minWidth: "125px" }}
    >
      {text}
    </button>
  );
};

export default Button;
