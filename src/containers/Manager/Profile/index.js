import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import Loading from "../../../utils/Loading";
import { useTranslation } from "react-i18next";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { path, select_faculty } from "../../../utils/constant";
import convertFileToBase64 from "../../../utils/convertFileToBase64";
import {
  getAllCodeApi,
  getUserApi,
  logOutApi,
  logOutHomePageApi,
} from "../../../services/userService";
import {
  getManager,
  getStudent,
  updateProfileManager,
  updateStudent,
} from "../../../services/studentService";
import { handleMessageFromBackend } from "../../../utils/handleMessageFromBackend";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import convertBufferToBase64 from "../../../utils/convertBufferToBase64";
import { logOutUser } from "../../../redux/authSlice";

const UpdateProfileManager = () => {
  const [loading, setLoading] = useState(true);
  const [notifyCheckState, setNotifyCheckState] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [faculty, setFaculty] = useState("");
  const [position, setPosition] = useState("");
  const [gender, setGender] = useState("");
  const [avatar, setAvatar] = useState("");
  const [previewAvatar, setPreviewAvatar] = useState("");

  const [genderAPI, setGenderAPI] = useState("");
  const [positionAPI, setPositionAPI] = useState("");
  const [facultyAPI, setFacultyAPI] = useState("");

  const { i18n, t } = useTranslation();
  const inputFileRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.authReducer);

  const handleGetProfileUser = ({ type, message }) => {
    console.log(1);
    getManager({}, { email: currentUser?.email }).then((data) => {
      if (data?.codeNumber === 0) {
        const manager = data?.manager;
        setEmail(manager?.email);
        setFullName(manager.fullName);
        setPhoneNumber(manager.phoneNumber);
        setAddress(manager.address);
        if (currentUser?.role === "R5") {
          setFaculty(manager?.facultyId);
          setGender(manager?.gender);
          if (manager?.image?.data) {
            manager.image.data = convertBufferToBase64(manager?.image?.data);
            setPreviewAvatar(manager.image.data);
          }
          setPosition(manager?.positionId);
        }
        setLoading(false);
        if (type === "update_profile") {
          toast.success(message, {
            autoClose: 3000,
            theme: "colored",
            position: "bottom-right",
          });
        }
      } else {
        setLoading(false);
        const response = handleMessageFromBackend(data, i18n.language);
        toast.error(response, {
          autoClose: 3000,
          theme: "colored",
          position: "bottom-right",
        });
        if (data?.codeNumber === -2) {
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
        }
      }
    });
  };
  useEffect(() => {
    getManager({}, { email: currentUser?.email }).then((data) => {
      if (data?.codeNumber === 0) {
        const manager = data?.manager;
        console.log(manager);
        setEmail(manager?.email);
        setFullName(manager.fullName);
        setPhoneNumber(manager.phoneNumber);
        setAddress(manager.address);
        if (currentUser?.role === "R5") {
          setFaculty(manager?.facultyId);
          setGender(manager?.gender);
          if (manager?.image?.data) {
            manager.image.data = convertBufferToBase64(manager?.image?.data);
            setPreviewAvatar(manager.image.data);
          }
          setPosition(manager?.positionId);
        }
        setLoading(false);
      } else {
        setLoading(false);
        const response = handleMessageFromBackend(
          data?.codeNumber,
          i18n.language
        );
        toast.error(response, {
          autoClose: 3000,
          theme: "colored",
          position: "bottom-right",
        });
        if (data?.codeNumber === -2) {
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
        }
      }
    });
    const gender = "GENDER";
    const position = "POSITION";

    if (currentUser?.role === "R5") {
      getAllCodeApi.getByType({ type: gender }).then(async (data) => {
        if (data?.codeNumber === 0) {
          setGenderAPI(data.allCode);
          console.log(2);
          await getAllCodeApi.getByType({ type: position }).then((data) => {
            if (data?.codeNumber === 0) {
              setPositionAPI(data.allCode);
            }
          });
          await getUserApi.getUserByRole({ role: "R4" }).then((data) => {
            if (data?.codeNumber === 0) {
              setFacultyAPI(data.user);
            }
          });
        }
      });
    }
  }, []);

  const handleChangeAndPreviewImage = async (e) => {
    let data = e.target.files;
    let file = data[0];
    if (file) {
      if (file?.size > 500000) {
        inputFileRef.current.value = "";
        toast.error(
          `${
            i18n.language === "en"
              ? "This image is too big, please use image size < 400KB"
              : "Ảnh hiện tại quá lớn. Vui lòng sử dụng ảnh dưới 400KB"
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

  const handleCheckNullState = () => {
    let result = true;
    const stateArr =
      currentUser?.role === "R5"
        ? [fullName, phoneNumber, address, position, faculty, gender]
        : [fullName, phoneNumber, address];
    const notification_en = [
      "FullName",
      "PhoneNumber",
      "Address",
      "Position",
      "Faculty",
      "Gender",
    ];
    const notification_vi = [
      "Trường tên ",
      "Trường số điện thoại",
      "Trường địa chỉ",
      "Trường chức vụ",
      "Trường khoa/viện",
      "Trường giới tính",
    ];
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

  const handleCheckValidate = () => {
    let result = true;
    const checkNullState = handleCheckNullState();
    if (checkNullState) {
      const rejexPhoneNumber = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
      if (!rejexPhoneNumber.test(phoneNumber)) {
        setNotifyCheckState(`${t("system.notification.phone")}`);
        return false;
      }
      return result;
    }
  };

  const updateProfile = () => {
    if (handleCheckValidate()) {
      setNotifyCheckState("");
      setLoading(true);

      updateProfileManager(
        {},
        {
          email: currentUser?.email,
          roleManager: currentUser?.role,
          fullName,
          phoneNumber,
          address,
          gender,
          faculty,
          position,
          image: avatar,
        }
      ).then(async (res) => {
        console.log(1);

        if (res?.codeNumber === 0) {
          console.log(3);
          await handleGetProfileUser({
            type: "update_profile",
            message: i18n.language === "en" ? res?.message_en : res?.message_vn,
          });
        } else {
          setLoading(false);
          const response = handleMessageFromBackend(
            res?.codeNumber,
            i18n.language
          );
          toast.error(response, {
            autoClose: 3000,
            theme: "colored",
            position: "bottom-right",
          });
          if (res?.codeNumber === -2) {
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
          }
        }
      });
    } else {
      return;
    }
  };

  return (
    <div>
      <ToastContainer />
      {loading && (
        <div className="fixed loading-overlay top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25">
          <div className="absolute">
            <Loading />
          </div>
        </div>
      )}

      <div className="w-full" style={{ height: "110px" }}></div>

      <div className="update-profile py-[20px] my-[5px] px-[10%] mx-auto">
        <h2 className="text-blurThemeColor font-semibold pb-[19px] border-b-2 border-gray-300">
          {i18n.language === "en"
            ? "Update Manager's Profile"
            : "Cập nhật thông tin"}
        </h2>
        <span className="text-blurThemeColor font-semibold flex-1 flex items-center gap-1">
          {t("system.table.mess-1")} <HiOutlinePencilAlt />
          {t("system.table.mess-2")}
        </span>
        <div className="content pb-[19px] flex flex-col items-start justify-start gap-3">
          <span
            className="mx-auto text-red-500 mb-2"
            style={notifyCheckState ? { opacity: "1" } : { opacity: "0" }}
          >
            {notifyCheckState ? notifyCheckState : "Null"}
          </span>
          <div className="w-full flex items-center justify-center gap-6">
            <div className="flex-1 flex flex-col justify-center">
              <label
                htmlFor="email"
                className="mb-1 text-headingColor opacity-80 flex items-center gap-1"
              >
                {t("system.table.email")} <HiOutlinePencilAlt />
              </label>
              <input
                className={`shadow-sm opacity-50 bg-gray-300 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light 
                  `}
                name="email"
                type="email"
                id="email"
                value={email}
                required
                disabled={true}
              />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <label
                htmlFor="name"
                className="mb-1 text-headingColor opacity-80 flex items-center gap-1"
              >
                {t("system.table.name")} <HiOutlinePencilAlt />
              </label>
              <input
                className="shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                name="name"
                id="name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onFocus={() => setNotifyCheckState("")}
              />
            </div>
          </div>

          <div className="w-full flex items-center justify-center gap-6">
            <div className="flex-1 flex flex-col justify-center">
              <label
                htmlFor="phone"
                className="mb-1 text-headingColor opacity-80 flex items-center gap-1"
              >
                {t("system.table.phone")} <HiOutlinePencilAlt />
              </label>
              <input
                className=" shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                name="phone"
                id="phone"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onFocus={() => setNotifyCheckState("")}
              />
            </div>
            <div className="flex flex-col justify-center w-2/3">
              <label
                htmlFor="address"
                className="mb-1 text-headingColor opacity-80 flex items-center gap-1"
              >
                {t("system.table.address")}
              </label>
              <input
                className=" shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                name="address"
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onFocus={() => setNotifyCheckState("")}
              />
            </div>
          </div>

          {currentUser?.role === "R5" && (
            <>
              <div className="w-full flex items-center justify-center gap-6">
                <div className="flex-1 flex flex-col justify-center">
                  <label
                    htmlFor="positionId"
                    className="mb-1 text-headingColor opacity-80 flex items-center gap-1"
                  >
                    {i18n.language === "en" ? "Position" : "Chức vụ"}{" "}
                    <HiOutlinePencilAlt />
                  </label>
                  <select
                    className={`shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light
                                  `}
                    name="positionId"
                    id="positionId"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    onFocus={() => setNotifyCheckState("")}
                  >
                    <option name="positionId" value="" className="text-sm">
                      {i18n.language === "en" ? "Select ---" : "Chọn ---"}
                    </option>
                    {positionAPI?.length > 0 &&
                      positionAPI?.map((e, i) => {
                        return (
                          <option
                            key={i}
                            name="positionId"
                            value={e?.keyMap}
                            className="text-sm"
                          >
                            {i18n.language === "en" ? e?.valueEn : e?.valueVn}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="flex flex-col justify-center w-2/3">
                  <label
                    htmlFor="faculty"
                    className="mb-1 text-headingColor opacity-80 flex items-center gap-1"
                  >
                    {t("login_register.faculty")} <HiOutlinePencilAlt />
                  </label>
                  <select
                    className={`shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light
                                  `}
                    name="faculties"
                    id="faculties"
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    onFocus={() => setNotifyCheckState("")}
                  >
                    <option name="faculties" value="" className="text-sm">
                      {i18n.language === "en" ? "Select ---" : "Chọn ---"}
                    </option>
                    {facultyAPI?.length > 0 &&
                      facultyAPI?.map((e, i) => {
                        return (
                          <option
                            key={i}
                            name="faculties"
                            value={e?.id}
                            className="text-sm"
                          >
                            {e?.fullName}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>

              <div className="w-full flex items-start justify-start gap-6 mt-3">
                <div className="flex-1 flex flex-col justify-center">
                  <label
                    htmlFor="gender"
                    className="mb-1 text-headingColor opacity-80 flex items-center gap-1"
                  >
                    {t("system.table.gender")} <HiOutlinePencilAlt />
                  </label>
                  <select
                    className=" shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    name="gender"
                    type="text"
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    onFocus={() => setNotifyCheckState("")}
                  >
                    <option name="gender" value="">
                      {i18n.language === "en" ? "Select ---" : "Chọn ---"}
                    </option>
                    {genderAPI?.length > 0 &&
                      genderAPI?.map((e, i) => {
                        return (
                          <option key={i} name="role" value={e?.keyMap}>
                            {i18n.language === "vi" ? e?.valueVn : e?.valueEn}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="flex-1 flex-col justify-start items-start flex">
                  <label
                    className="mb-1 text-headingColor opacity-80 flex items-center gap-1"
                    htmlFor="file_input"
                  >
                    {t("system.table.avatar")}
                  </label>
                  <input
                    className="block w-full text-sm text-gray-900 border border-gray-400 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    id="file_input"
                    type="file"
                    accept=".jpg, .png, *.jpg, *.jpeg, .jpeg"
                    onChange={(e) => handleChangeAndPreviewImage(e)}
                    onFocus={() => setNotifyCheckState("")}
                    ref={inputFileRef}
                  />
                  {previewAvatar && (
                    <div className="h-24 mt-1 w-full">
                      <div
                        style={{
                          backgroundImage: `url(${previewAvatar})`,
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "contain",
                          cursor: "pointer",
                          width: "100%",
                          height: "100%",
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="w-1/3 mt-4" onClick={() => updateProfile()}>
            <button className="w-full btn-form rounded-lg py-1 bg-blurThemeColor text-white text-md font-semibold h-[34px] opacity-80 hover:opacity-100 transition-all duration-200">
              {t("system.schedule.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileManager;
