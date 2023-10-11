import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { emitter } from "../../../utils/emitter";

const QuestionForm = ({ type, create }) => {
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [others, setOthers] = useState("");
  const [notifyCheckState, setNotifyCheckState] = useState("");
  console.log(notifyCheckState);

  const { i18n, t } = useTranslation();

  const handleChangeEvent = (value, type) => {
    const stateArr = ["Subject", "Question", "Others"];
    const setStateArr = [setSubject, setQuestion, setOthers];
    for (let i = 0; i < stateArr.length; i++) {
      if (type === stateArr[i]) {
        setStateArr[i](value);
        break;
      } else {
        continue;
      }
    }
  };

  emitter.on("EVENT_CLEAR_DATA", () => {
    setSubject("");
    setQuestion("");
    setOthers("");
  });

  const handleCheckNullState = () => {
    let result = true;
    const stateArr = [subject, question];
    const notification_en = ["Subject", "Question"];
    const notification_vi = ["Trường chủ đề", "Trường câu hỏi"];
    for (let i = 0; i < stateArr.length; i++) {
      if (!stateArr[i]) {
        if (i18n.language === "vi") {
          setNotifyCheckState(
            `${notification_vi[i]} ${t("system.notification.required")}`
          );
        } else {
          setNotifyCheckState(
            `${notification_en[i]} ${t("system.notification.required")}`
          );
        }
        result = false;
        break;
      } else {
        setNotifyCheckState("");
      }
    }
    return result;
  };

  const createQuestion = () => {
    if (handleCheckNullState()) {
      create({ subject, question, others });
    }
  };

  const clearData = () => {
    setSubject("");
    setQuestion("");
    setOthers("");
  };

  return (
    <div
      className={`${
        type ? "question-form-faculty-container" : "question-form-container"
      }`}
    >
      <span
        className="mx-auto text-red-500 text-lg"
        style={notifyCheckState ? { opacity: "1" } : { opacity: "0" }}
      >
        {notifyCheckState ? notifyCheckState : "Null"}
      </span>
      <div>
        <label
          for="helper-text"
          class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
        >
          Subject
        </label>
        <input
          onFocus={() => setNotifyCheckState("")}
          type="text"
          id="helper-text"
          value={subject}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="VD: Về vấn đề hỗ trợ đăng ký đồ án cho sinh viên K64..."
          onChange={(e) => handleChangeEvent(e.target.value, "Subject")}
        />
      </div>
      <div>
        <label
          for="helper-text"
          class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
        >
          Make question
        </label>
        <textarea
          onFocus={() => setNotifyCheckState("")}
          id="message"
          rows="4"
          value={question}
          class="block p-2.5 w-full text-md text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder="VD:
          1.Thời gian kết thúc quá trình đăng ký đồ án? 
          2.Những lưu ý trong quá trình đăng ký đồ án?
          ..."
          onChange={(e) => handleChangeEvent(e.target.value, "Question")}
        ></textarea>
      </div>
      <div>
        <label
          for="helper-text"
          class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
        >
          More information
        </label>
        <input
          onFocus={() => setNotifyCheckState("")}
          type="text"
          id="helper-text"
          value={others}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="VD: Rất mong nhận được phản hồi sớm của thầy để chuẩn bị cho kế hoạch sắp tới của em..."
          onChange={(e) => handleChangeEvent(e.target.value, "Others")}
        />
      </div>
      <div className="flex items-center justify-start gap-6 py-4">
        <button
          type="submit"
          class={`border border-gray-600 hover:bg-blue-800 hover:text-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
                `}
          onClick={() => createQuestion()}
        >
          Make question
        </button>
        <button
          type="text"
          class={`border border-gray-600 hover:bg-blue-800 hover:text-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
                `}
          onClick={() => clearData()}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default QuestionForm;
