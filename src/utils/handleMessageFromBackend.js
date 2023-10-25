import { useTranslation } from "react-i18next";

export const handleMessageFromBackend = (data, language) => {
  let response = "";
  if (data?.codeNumber === -1) {
    response =
      language === "en"
        ? "Error. Please try again or contact admin!"
        : "Có lỗi. Vui lòng thử lại hoặc liên hệ quản trị viên!";
  } else if (data?.codeNumber === -2) {
    response =
      language === "en"
        ? "Token is expired. Please login again after 5 seconds."
        : "Token hết hạn. Vui lòng đăng nhập lại trong 5s nữa.";
  } else if (data?.codeNumber === 1) {
    response = language === "en" ? data?.message_en : data?.message_vn;
  }
  return response;
};
