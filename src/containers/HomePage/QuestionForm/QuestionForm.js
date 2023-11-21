import React, { useRef, useState } from "react";

import { useTranslation } from "react-i18next";
import { emitter } from "../../../utils/emitter";
import { ToastContainer, toast } from "react-toastify";
import { BsQuestionCircle } from "react-icons/bs";
import NoteWhenMakeQuestion from "./NoteWhenMakeQuestion";
import convertFileToBase64 from "../../../utils/convertFileToBase64";
import { TiDelete } from "react-icons/ti";
import { AiFillQuestionCircle } from "react-icons/ai";
import ConfirmSendQuestion from "./ConfirmSendQuestion";

const QuestionForm = ({ type, create }) => {
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [others, setOthers] = useState("");
  const [notifyCheckState, setNotifyCheckState] = useState("");
  const [isOpenNote, setIsOpenNote] = useState(false);
  const [noteSubject, setNoteSubject] = useState(false);
  const [noteContent, setNoteContent] = useState(false);
  const [noteConfirm, setNoteConfirm] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [avatar, setAvatar] = useState("");
  const [optionMakeQuestion, setOptionMakeQuestion] = useState("");
  const [isOpenConfirmQuestion, setIsOpenConfirmQuestion] = useState(false);
  const inputFileRef = useRef();
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
    setAvatar("");
    setPreviewAvatar("");
    inputFileRef.current.value = "";
  });

  const handleCheckNullState = () => {
    let result = true;
    const stateArr = [subject, question];
    const notification_en = ["Subject", "Question"];
    const notification_vi = ["Trường chủ đề", "Trường câu hỏi"];
    for (let i = 0; i < stateArr.length; i++) {
      if (!stateArr[i]) {
        toast.error(
          i18n.language === "en"
            ? `${notification_en[i]} ${t("system.notification.required")}`
            : `${notification_vi[i]} ${t("system.notification.required")}`,
          {
            autoClose: 3000,
            theme: "colored",
            position: "bottom-right",
          }
        );
        result = false;
        break;
      }
    }
    return result;
  };

  const handleOpenConfirmQuestion = (option) => {
    if (handleCheckNullState()) {
      setIsOpenConfirmQuestion(true);
      setOptionMakeQuestion(option);
    }
  };

  const createQuestion = () => {
    create({ subject, question, avatar, others, option: optionMakeQuestion });
    setIsOpenConfirmQuestion(false);
    setOptionMakeQuestion("");
  };
  const closeConfirm = () => {
    setIsOpenConfirmQuestion(false);
    setOptionMakeQuestion("");
  };

  const clearData = () => {
    setSubject("");
    setQuestion("");
    setOthers("");
    setAvatar("");
    setPreviewAvatar("");
    inputFileRef.current.value = "";
  };

  const handleNoteWhenMakeQuestion = (option) => {
    setIsOpenNote(true);
    option(true);
  };

  const closeNote = (option) => {
    setIsOpenNote(false);
    option(false);
  };

  const handleChangeAndPreviewImage = async (e) => {
    let data = e.target.files;
    let file = data[0];
    if (file) {
      if (file?.size > 100000) {
        inputFileRef.current.value = "";
        toast.error(
          `${
            i18n.language === "en"
              ? "This image is too big, please use image size < 500KB"
              : "Ảnh hiện tại quá lớn. Vui lòng sử dụng ảnh dưới 500KB"
          }`,
          {
            autoClose: 3000,
            theme: "colored",
            position: "bottom-right",
          }
        );
      } else {
        let urlAvatar = URL.createObjectURL(file);
        setPreviewAvatar(urlAvatar);
        try {
          const base64File = await convertFileToBase64(file);
          setAvatar(base64File);
        } catch (e) {
          console.log("base64 file " + e);
        }
      }
    }
  };

  const handleRemoveAvatar = () => {
    setPreviewAvatar("");
    setAvatar("");
    inputFileRef.current.value = "";
  };

  return (
    <>
      <div
        className={`${
          type ? "question-form-faculty-container" : "question-form-container"
        }`}
      >
        <ToastContainer />
        <div>
          <label
            for="helper-text"
            class="relative flex items-center justify-start gap-2 mb-2 text-md font-medium text-gray-900 dark:text-white"
          >
            <span>{i18n.language === "en" ? "Subject" : "Chủ đề"}</span>
            <BsQuestionCircle
              className="cursor-pointer h-5 w-5"
              onClick={() => handleNoteWhenMakeQuestion(setNoteSubject)}
            />
            {noteSubject && (
              <NoteWhenMakeQuestion
                option={setNoteSubject}
                close={closeNote}
                type='Vui lòng đặt các chủ đề liên quan đến đối tượng và tuân thủ định dạng sau: "Về + Tên Chủ Đề"'
              />
            )}
          </label>
          <input
            onFocus={() => setNotifyCheckState("")}
            type="text"
            id="helper-text"
            value={subject}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Về + Tên Chủ Đề"
            onChange={(e) => handleChangeEvent(e.target.value, "Subject")}
          />
        </div>
        <div className="mt-4 flex items-start justify-start gap-4 relative">
          {noteContent && (
            <NoteWhenMakeQuestion
              option={setNoteContent}
              close={closeNote}
              type='Vui lòng đặt câu hỏi ngắn gọn, rõ ràng. Tối đa 3 câu hỏi trở xuống và tuân thủ định dạng sau: "Câu hỏi a? Câu hỏi b? Câu hỏi c?"'
            />
          )}
          <div className="flex-1">
            <label
              for="helper-text"
              class="flex relative items-center justify-start gap-2 mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              <span>
                {i18n.language === "en" ? "Make question" : "Đặt câu hỏi"}
              </span>
              <BsQuestionCircle
                className="cursor-pointer h-5 w-5"
                onClick={() => handleNoteWhenMakeQuestion(setNoteContent)}
              />
            </label>
            <textarea
              onFocus={() => setNotifyCheckState("")}
              id="message"
              rows="3"
              value={question}
              class="block p-2.5 w-full text-md text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder={`Câu hỏi a? ${"\n"}Câu hỏi b? ${"\n"}Câu hỏi c?`}
              onChange={(e) => handleChangeEvent(e.target.value, "Question")}
            ></textarea>
          </div>
          <div className="flex-3">
            <label
              class="mb-2 block text-md font-medium text-gray-900 dark:text-white"
              for="file_input"
            >
              {i18n.language === "en" ? "Upload file" : "Tải ảnh"}
            </label>

            <input
              class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
              id="file_input"
              accept=".jpg, .png, *.jpg, *.jpeg, .jpeg"
              type="file"
              onChange={(e) => handleChangeAndPreviewImage(e)}
              ref={inputFileRef}
            />

            <p
              class="mt-1 text-sm text-gray-500 dark:text-gray-300"
              id="file_input_help"
            >
              PNG, JPG, JPEG FILE
            </p>
            {previewAvatar && (
              <div className="w-full h-24 flex-1 relative">
                <div
                  style={{
                    backgroundImage: `url(${previewAvatar})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    height: "100%",
                    width: "50%",
                    cursor: "pointer",
                  }}
                ></div>
                <TiDelete
                  className="absolute top-0 right-0 text-2xl cursor-pointer"
                  onClick={handleRemoveAvatar}
                />
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label
            for="helper-text"
            class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
          >
            {i18n.language === "en" ? "More information" : "Thông tin thêm"}
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
        <div className="flex items-center justify-between py-4 relative">
          {noteConfirm && (
            <NoteWhenMakeQuestion
              option={setNoteConfirm}
              close={closeNote}
              type={`Có tất cả 2 lựa chọn dành cho các bạn.    1. Sinh viên có thể gửi trực tiếp câu hỏi đến người nhận (mất một khoảng thời gian để người nhận kiểm tra và trả lời).    2. Sinh viên có thể lựa chọn kiểm tra tương đồng (Hệ thống sẽ kiểm tra các câu hỏi trước đó và nếu trùng sẽ gửi câu trả lời đến sinh viên ngay lập tức). Nếu như câu trả lời của phần kiểm tra tương đồng chưa thoả mãn mục đích của bạn, bạn có thể vào phần Quản lý tiến trình và tiến hành gửi trực tiếp cho người nhận nhé.`}
              top="-top-32"
            />
          )}
          <div className="flex items-center justify-start gap-10">
            <div className="flex items-center justify-start gap-0.5 relative">
              <button
                type="submit"
                className="px-7 py-2 flex transition-all ease-in duration-150 items-center justify-center overflow-hidden text-md font-semibold border border-blue-500 text-white  rounded-md bg-blue-500 hover:text-blue-500 hover:bg-white"
                onClick={() => handleOpenConfirmQuestion("checkSimilarity")}
              >
                {i18n.language === "en"
                  ? "Similarity check"
                  : "Kiểm tra tương đồng"}
              </button>
              <AiFillQuestionCircle
                className="relative cursor-pointer text-blue-400 hover:text-blue-500 text-3xl -top-5 transition-all ease-in duration-150"
                onClick={() => handleNoteWhenMakeQuestion(setNoteConfirm)}
              />
            </div>
            <button
              type="submit"
              className="px-7 py-2 flex transition-all ease-in duration-150 items-center justify-center overflow-hidden text-md font-semibold border border-blue-500 text-white  rounded-md bg-blue-500 hover:text-blue-500 hover:bg-white"
              onClick={() => handleOpenConfirmQuestion("directly")}
            >
              {i18n.language === "en" ? "Send Directly" : "Gửi trực tiếp"}
            </button>
          </div>

          <button
            type="text"
            className="px-7 py-2 flex transition-all ease-in duration-150 items-center justify-center overflow-hidden text-md font-semibold border border-red-500 text-white  rounded-md bg-red-500 hover:text-red-500 hover:bg-white"
            onClick={() => clearData()}
          >
            {i18n.language === "en" ? "Clear" : "Đặt lại"}
          </button>
        </div>
      </div>

      {isOpenNote && (
        <div className="modal-schedule-overplay fixed top-0 bottom-0 left-0 right-0 w-full max-h-full bg-black bg-opacity-25"></div>
      )}

      {isOpenConfirmQuestion && (
        <ConfirmSendQuestion
          closeConfirm={closeConfirm}
          create={createQuestion}
        />
      )}

      {isOpenConfirmQuestion && (
        <div className="modal-confirm-question-overplay fixed top-0 bottom-0 left-0 right-0 w-full max-h-full bg-black bg-opacity-30"></div>
      )}
    </>
  );
};

export default QuestionForm;
