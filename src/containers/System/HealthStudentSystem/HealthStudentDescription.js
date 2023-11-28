import React, { useState, useEffect } from "react";
import MarkdownIt from "markdown-it";
import { BsPersonPlusFill } from "react-icons/bs";
import MdEditor from "react-markdown-editor-lite";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import Loading from "../../../utils/Loading";
import { getUserApi, logOutApi } from "../../../services/userService";
import { createMarkDown, getMarkDown } from "../../../services/markdownService";
import { logOutUser } from "../../../redux/authSlice";
import { markdown, path } from "../../../utils/constant";

const mdParser = new MarkdownIt(/* Markdown-it options */);

const HealthStudentDescription = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [markdownHtml, setMarkdownHtml] = useState("");
  const [markdownText, setMarkdownText] = useState("");
  const [description, setDescription] = useState("");

  const [department, setDepartment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [notifyCheckState, setNotifyCheckState] = useState("");

  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getUserApi.getUserByRole({ role: "R6" }).then((data) => {
      if (data?.codeNumber === 0) {
        setDepartment(data.user);
      }
    });
    // await getUserApi.getUserByRole({ role: "R6" }).then((data) => {
    //   if (data?.codeNumber === 0) {
    //     setFaculties(data.user);
    //   }
    // });
    setLoading(false);
  }, []);

  let optionsDepartment = [];
  if (department.length > 0) {
    department.forEach((user, index) => {
      optionsDepartment.push({ value: user?.id, label: user?.fullName });
    });
  }

  // let optionsFaculties = [];
  // if (faculties.length > 0) {
  //   faculties.forEach((user, index) => {
  //     optionsFaculties.push({ value: user?.id, label: user?.fullName });
  //   });
  // }

  // Finish change markdown
  function handleEditorChange({ html, text }) {
    setMarkdownHtml(html);
    setMarkdownText(text);
  }

  //change select teacher id
  const handleChangeSelect = async (e) => {
    setSelectedOption(e);
    const data = await getMarkDown.getById({
      id: e?.value,
      type: markdown.other,
    });
    if (data?.codeNumber === 1) {
      setDescription("");
      setMarkdownHtml("");
      setMarkdownText("");
      setIsUpdate(false);
    } else {
      const { description, markdownText, markdownHtml } = data?.markdown;
      setDescription(description);
      setMarkdownText(markdownText);
      setMarkdownHtml(markdownHtml);
      setIsUpdate(true);
    }
    // const res = await getTeacherInfo.getById({ id: e?.value });
    // if (res?.codeNumber === 1) {
    //   setSelectedOptionTeacherInfo(null);
    //   setNote("");
    //   setIsUpdate(false);
    // } else {
    //   const { faculty_id, note } = res?.teacher_info;
    //   let optionFacultySelect = {};
    //   for (let i = 0; i < optionsFaculties.length; i++) {
    //     if (optionsFaculties[i]?.value === faculty_id) {
    //       optionFacultySelect = optionsFaculties[i];
    //       break;
    //     }
    //   }
    //   setSelectedOptionTeacherInfo(optionFacultySelect);
    //   setNote(note);
    //   setIsUpdate(true);
    // }
  };

  const checkNullData = () => {
    let result = true;
    const dataArr = [
      selectedOption?.value,
      description,
      markdownText,
      markdownHtml,
    ];
    for (let i = 0; i < dataArr.length; i++) {
      if (!dataArr[i]) {
        result = false;
        break;
      }
    }
    return result;
  };

  const handleMarkDown = () => {
    if (checkNullData()) {
      setLoading(true);
      const dataMarkDown = {
        markdownHtml,
        markdownText,
        description,
        userId: selectedOption?.value,
        action: isUpdate ? "update" : "create",
        type: markdown.other,
      };
      // const dataTeacherInfo = {
      //   facultyId: selectedOptionTeacherInfo?.value,
      //   teacherId: selectedOption?.value,
      //   note,
      //   action: isUpdate ? "update" : "create",
      // };
      createMarkDown.create({}, dataMarkDown).then((res) => {
        // createTeacherInfo.create({}, dataTeacherInfo).then((data) => {
        if (res?.codeNumber === -1) {
          toast.error(`${t("system.notification.fail")}`, {
            autoClose: 2000,
            position: "bottom-right",
            theme: "colored",
          });
          setLoading(false);
        } else if (res?.codeNumber === -2) {
          toast.error(`${t("system.token.mess")}`, {
            autoClose: 5000,
            position: "bottom-right",
            theme: "colored",
          });
          setTimeout(() => {
            logOutApi.logoutUser({}).then((data) => {
              if (data?.codeNumber === 0) {
                dispatch(logOutUser());
                navigate(
                  `${path.SYSTEM}/${path.LOGIN_SYSTEM}?redirect=/system`
                );
              }
            });
          }, 5000);
        } else if (res?.codeNumber === 1) {
          toast.error(res?.message, {
            autoClose: 2000,
            position: "bottom-right",
            theme: "colored",
          });
          setLoading(false);
        } else {
          if (res?.message === "create") {
            toast.success(`${t("system.notification.create")}`, {
              autoClose: 2000,
              position: "bottom-right",
              theme: "colored",
            });
          } else {
            toast.success(`${t("system.notification.update")}`, {
              autoClose: 2000,
              position: "bottom-right",
              theme: "colored",
            });
          }
          setDescription("");
          setSelectedOption(null);
          setMarkdownHtml("");
          setMarkdownText("");
          setLoading(false);
          setIsUpdate(false);
        }
      });
    } else {
      setNotifyCheckState(`${t("system.notification.miss")}`);
    }
  };

  const handleCloseUpdateDepartment = () => {
    setDescription("");
    setSelectedOption(null);
    setMarkdownHtml("");
    setMarkdownText("");
    setIsUpdate(false);
  };

  return (
    <div className="w-full flex flex-col mx-auto pb-10 ">
      <ToastContainer />
      {loading && (
        <div className="fixed loading-overlay top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25">
          <div className="absolute">
            <Loading />
          </div>
        </div>
      )}

      <div className="bg-slate-200 shadow-gray-300 mt-2 mb-1 pt-1 pb-4 px-3 rounded-lg">
        <div
          className="mx-auto text-red-500 mb-2 text-center text-xl"
          style={notifyCheckState ? { opacity: "1" } : { opacity: "0" }}
        >
          {notifyCheckState ? notifyCheckState : "Null"}
        </div>
        <div className="flex items-start gap-5 mb-4">
          <div className="flex-1 flex flex-col justify-start items-start">
            <label className=" text-opacity-60 text-black flex items-center gap-1">
              {t("system.health-student.choose")} <HiOutlinePencilAlt />
            </label>
            <Select
              value={selectedOption}
              onChange={(e) => handleChangeSelect(e)}
              options={optionsDepartment}
              className="w-full"
              onFocus={() => setNotifyCheckState("")}
            />
          </div>
          <div className="flex-1 flex flex-col items-start">
            <label
              htmlFor="detail"
              className=" text-opacity-60 text-black flex items-center gap-1"
            >
              {t("system.health-student.overview")} <HiOutlinePencilAlt />
            </label>
            <textarea
              id="detail"
              name="detail"
              rows="3"
              className="w-full border-opacity-50 border-blurColor rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={() => setNotifyCheckState("")}
            />
          </div>
        </div>
        {/* <div className="flex items-start gap-5 mb-4">
          <div className="flex-1 flex flex-col justify-start items-start">
            <label className=" text-opacity-60 text-black">
              health-student teacher
            </label>
            <Select
              value={selectedOptionTeacherInfo}
              onChange={(e) => handleChangeSelectTeacherInfo(e)}
              options={optionsFaculties}
              className="w-full"
            />
          </div>
          <div className="flex-1 flex flex-col items-start">
            <label className=" text-opacity-60 text-black">Note</label>
            <textarea
              id="note"
              name="note"
              rows="1"
              className="w-full border-opacity-50 border-blurColor rounded-md"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div> */}

        <div className="flex flex-col items-start w-full">
          <label className=" text-opacity-60 text-black flex items-center gap-1">
            {t("system.health-student.detail")} <HiOutlinePencilAlt />
          </label>
          <MdEditor
            value={markdownText}
            style={{ width: "100%", height: "400px", border: "1px solid #aaa" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleEditorChange}
            onFocus={() => setNotifyCheckState("")}
          />
        </div>
        <button
          className={`text-white mt-6 py-2 px-1 font-semibold rounded-md shadow backdrop-blur-md bg-opacity-80 hover:bg-opacity-100
           ${isUpdate ? "bg-backColor" : "bg-blue-500"}`}
          style={{ maxWidth: "15%", width: "15%" }}
          onClick={() => handleMarkDown()}
        >
          {isUpdate
            ? t("system.health-student.update")
            : t("system.health-student.add")}
        </button>
        {isUpdate && (
          <button
            className={` ml-5 text-white mt-6 py-2 px-1 font-semibold rounded-md shadow backdrop-blur-md bg-opacity-100 hover:bg-opacity-80 bg-blue-500`}
            style={{ maxWidth: "10%", width: "10%" }}
            onClick={() => handleCloseUpdateDepartment()}
          >
            {t("system.health-student.close")}
          </button>
        )}
      </div>
    </div>
  );
};

export default HealthStudentDescription;
