const Button = ({ text, value, click, isSelected, type }) => {
  return (
    <button
      type="button"
      value={value}
      className={`border border-gray-300
      font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 hover:bg-gray-200 
     ${
       isSelected
         ? "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"
         : "text-gray-900 bg-white"
     }
     ${
       type === "save"
         ? "text-lg text-white w-1/5 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br"
         : type === "update"
         ? "text-lg text-white w-1/5 bg-gradient-to-r from-backColor via-green-400 to-green-500 hover:bg-gradient-to-br"
         : null
     }
      `}
      onClick={() => click()}
      // onClick={(e) => console.log(e.target.value)}
      style={{ minWidth: "150px" }}
    >
      {text}
    </button>
  );
};

export default Button;
