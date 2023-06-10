import React, { useState, useEffect } from "react";
import MarkdownIt from "markdown-it";
import { BsPersonPlusFill } from "react-icons/bs";
import MdEditor from "react-markdown-editor-lite";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";

import Loading from "../../../utils/Loading";
import { getUserApi } from "../../../services/userService";
import { createMarkDown, getMarkDown } from "../../../services/markdownService";
import {
  createTeacherInfo,
  getTeacherInfo,
} from "../../../services/teacherService";

const mdParser = new MarkdownIt(/* Markdown-it options */);

const TeacherDescription = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [markdownHtml, setMarkdownHtml] = useState("");
  const [markdownText, setMarkdownText] = useState("");
  const [description, setDescription] = useState("");

  const [selectedOptionTeacherInfo, setSelectedOptionTeacherInfo] =
    useState(null);
  const [note, setNote] = useState("");

  const [teachers, setTeachers] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(async () => {
      await getUserApi.getUserByRole({ role: "R5" }).then((data) => {
        if (data?.codeNumber === 0) {
          setTeachers(data.user);
        }
      });
      await getUserApi.getUserByRole({ role: "R4" }).then((data) => {
        if (data?.codeNumber === 0) {
          setFaculties(data.user);
        }
      });
      setLoading(false);
    }, 1000);
  }, []);

  let optionsTeachers = [];
  if (teachers.length > 0) {
    teachers.forEach((user, index) => {
      optionsTeachers.push({ value: user?.id, label: user?.fullName });
    });
  }

  let optionsFaculties = [];
  if (faculties.length > 0) {
    faculties.forEach((user, index) => {
      optionsFaculties.push({ value: user?.id, label: user?.fullName });
    });
  }

  // Finish change markdown
  function handleEditorChange({ html, text }) {
    setMarkdownHtml(html);
    setMarkdownText(text);
  }

  //change select teacher info
  const handleChangeSelectTeacherInfo = (e) => {
    setSelectedOptionTeacherInfo(e);
  };

  //change select teacher id
  const handleChangeSelect = async (e) => {
    setSelectedOption(e);
    const data = await getMarkDown.getById({ id: e?.value });
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
    const res = await getTeacherInfo.getById({ id: e?.value });
    if (res?.codeNumber === 1) {
      setSelectedOptionTeacherInfo(null);
      setNote("");
      setIsUpdate(false);
    } else {
      const { faculty_id, note } = res?.teacher_info;
      let optionFacultySelect = {};
      for (let i = 0; i < optionsFaculties.length; i++) {
        if (optionsFaculties[i]?.value === faculty_id) {
          optionFacultySelect = optionsFaculties[i];
          break;
        }
      }
      setSelectedOptionTeacherInfo(optionFacultySelect);
      setNote(note);
      setIsUpdate(true);
    }
  };

  const handleMarkDown = () => {
    setLoading(true);
    const dataMarkDown = {
      markdownHtml,
      markdownText,
      description,
      userId: selectedOption?.value,
      action: isUpdate ? "update" : "create",
    };
    const dataTeacherInfo = {
      facultyId: selectedOptionTeacherInfo?.value,
      teacherId: selectedOption?.value,
      note,
      action: isUpdate ? "update" : "create",
    };
    setTimeout(async () => {
      await createMarkDown.create({}, dataMarkDown).then((res) => {
        createTeacherInfo.create({}, dataTeacherInfo).then((data) => {
          if (res?.codeNumber !== 0 || data?.codeNumber !== 0) {
            toast.error(res?.message, {
              autoClose: 2000,
            });
            setLoading(false);
          } else {
            setDescription("");
            setSelectedOption(null);
            setSelectedOptionTeacherInfo(null);
            setMarkdownHtml("");
            setMarkdownText("");
            setNote("");
            setLoading(false);
            setIsUpdate(false);
            toast.success(res?.message, {
              autoClose: 2000,
            });
          }
        });
      });
    }, 1000);
  };

  return (
    <div
      className="mt-3 flex flex-col mx-auto pb-10 "
      style={{ maxWidth: "80%", width: "80%" }}
    >
      <ToastContainer />
      <p className="mx-auto text-2xl text-blue-600 font-semibold mb-10">
        DESCRIPTION TEACHER
      </p>
      {loading && <Loading />}
      <div
        className={`flex items-center justify-center mt-3 gap-1 py-2 px-1 text-white font-semibold rounded-md  
        bg-blue-600 mb-4
        `}
        // type="text"
        // onClick={() => setIsCreateUser(true)}
        style={{ maxWidth: "25%", width: "25%" }}
      >
        <BsPersonPlusFill
          className="mr-1 ml-2"
          style={{ fontSize: "16px" }}
          modal
        />
        {isUpdate ? "Update description teacher" : "Create description teacher"}
      </div>
      <div className="">
        <div className="flex items-start gap-5 mb-4">
          <div className="flex-1 flex flex-col justify-start items-start">
            <label className="text-lg text-opacity-60 text-black">
              Choose a teacher
            </label>
            <Select
              value={selectedOption}
              onChange={(e) => handleChangeSelect(e)}
              options={optionsTeachers}
              className="w-full"
            />
          </div>
          <div className="flex-1 flex flex-col items-start">
            <label
              htmlFor="detail"
              className="text-lg text-opacity-60 text-black"
            >
              Detail of teacher
            </label>
            <textarea
              id="detail"
              name="detail"
              rows="3"
              className="w-full border-opacity-50 border-blurColor rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-start gap-5 mb-4">
          <div className="flex-1 flex flex-col justify-start items-start">
            <label className="text-lg text-opacity-60 text-black">
              Faculty teacher
            </label>
            <Select
              value={selectedOptionTeacherInfo}
              onChange={(e) => handleChangeSelectTeacherInfo(e)}
              options={optionsFaculties}
              className="w-full"
            />
          </div>
          <div className="flex-1 flex flex-col items-start">
            <label className="text-lg text-opacity-60 text-black">Note</label>
            <textarea
              id="note"
              name="note"
              rows="1"
              className="w-full border-opacity-50 border-blurColor rounded-md"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col items-start w-full">
          <label className="text-lg text-opacity-60 text-black">
            Description teacher
          </label>
          <MdEditor
            value={markdownText}
            style={{ width: "100%", height: "400px", border: "1px solid #aaa" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleEditorChange}
          />
        </div>
        <button
          className={`text-white mt-6 py-2 px-1 font-semibold rounded-md shadow backdrop-blur-md bg-opacity-80 hover:bg-opacity-100
           ${isUpdate ? "bg-backColor" : "bg-blue-500"}`}
          style={{ maxWidth: "15%", width: "15%" }}
          onClick={() => handleMarkDown()}
        >
          {isUpdate ? "Update" : "Create"}
        </button>
      </div>
    </div>
  );
};

export default TeacherDescription;
