import React, { Fragment, useEffect, useState, useRef } from "react";
import { Buffer } from "buffer";
import { FiEdit } from "react-icons/fi";
import { BsEyeSlash } from "react-icons/bs";
import { IoMdEye } from "react-icons/io";
import { AiOutlineDelete } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import { BsPersonPlusFill } from "react-icons/bs";
import { useContext } from "react";
import { ContextScrollTop } from "../RootSystem";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { useTranslation } from "react-i18next";

import {
  createUserApi,
  deleteUserApi,
  getAllCodeApi,
  getUserApi,
  logOutApi,
  updateUserApi,
} from "../../../services/userService";
import { emitter } from "../../../utils/emitter";
import Loading from "./../../../utils/Loading";
import DeleteModal from "./../Modal/DeleteModal";
import convertFileToBase64 from "../../../utils/convertFileToBase64";
import { ascertain_user, path } from "../../../utils/constant";
import { logOutUser } from "../../../redux/authSlice";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Ripple } from "primereact/ripple";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";

const HealthStudentManager = () => {
  // const [isCreateUser, setIsCreateUser] = useState(false);
  const [isDeleteUser, setIsDeleteUser] = useState(false);
  const [dataUserDelete, setDataUserDelete] = useState("");
  const [isUpdateUser, setIsUpdateUser] = useState(false);
  const [dataUserUpdate, setDataUserUpdate] = useState("");

  const [users, setUsers] = useState([]);
  const [eye, setEye] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [genderAPI, setGenderAPI] = useState([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // const [avatar, setAvatar] = useState("");
  const [address, setAddress] = useState("");
  // const [gender, setGender] = useState("");
  const [notifyCheckState, setNotifyCheckState] = useState("");
  // const [previewAvatar, setPreviewAvatar] = useState("");

  //scroll top
  // const scroll = useContext(ContextScrollTop);
  const { t, i18n } = useTranslation();

  //ref
  const inputFileRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //dataTable
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [selectedProducts8, setSelectedProducts8] = useState(null);
  const [allRowSelected, setAllRowSelected] = useState(false);
  // const [currentPage, setCurrentPage] = useState();
  const [first1, setFirst1] = useState(0);
  const [rows1, setRows1] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputTooltip, setPageInputTooltip] = useState(
    "Press 'Enter' key to go to this page."
  );

  //pagination
  const paginatorLeft = (
    <Button type="button" icon="pi pi-refresh" className="p-button-text" />
  );
  const paginatorRight = (
    <Button type="button" icon="pi pi-cloud" className="p-button-text" />
  );
  const onCustomPage1 = (event) => {
    setFirst1(event.first);
    setRows1(event.rows);
    setCurrentPage(event.page + 1);
  };
  const onPageInputChange = (event) => {
    setCurrentPage(event.target.value);
  };
  const onPageInputKeyDown = (event, options) => {
    if (event.key === "Enter") {
      const page = parseInt(currentPage);
      if (page < 1 || page > options.totalPages) {
        setPageInputTooltip(
          `Value must be between 1 and ${options.totalPages}.`
        );
      } else {
        const first = currentPage ? options.rows * (page - 1) : 0;

        setFirst1(first);
        setPageInputTooltip("Press 'Enter' key to go to this page.");
      }
    }
  };
  const template1 = {
    layout:
      "PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport",
    PrevPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="p-3">Previous</span>
          <Ripple />
        </button>
      );
    },
    NextPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="p-3">Next</span>
          <Ripple />
        </button>
      );
    },
    PageLinks: (options) => {
      if (
        (options.view.startPage === options.page &&
          options.view.startPage !== 0) ||
        (options.view.endPage === options.page &&
          options.page + 1 !== options.totalPages)
      ) {
        const className = classNames(options.className, { "p-disabled": true });

        return (
          <span className={className} style={{ userSelect: "none" }}>
            ...
          </span>
        );
      }

      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
        >
          {options.page + 1}
          <Ripple />
        </button>
      );
    },
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 4, value: 4 },
        { label: 8, value: 8 },
        { label: 12, value: 12 },
        { label: "All", value: options.totalRecords },
      ];

      return (
        <Dropdown
          value={options.value}
          options={dropdownOptions}
          onChange={options.onChange}
        />
      );
    },
    CurrentPageReport: (options) => {
      return (
        <span
          className="mx-3"
          style={{ color: "var(--text-color)", userSelect: "none" }}
        >
          Go to{" "}
          <InputText
            size="2"
            className="ml-1"
            value={currentPage}
            tooltip={pageInputTooltip}
            onKeyDown={(e) => onPageInputKeyDown(e, options)}
            onChange={onPageInputChange}
          />
        </span>
      );
    },
  };

  //filter
  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      fullName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue1("");
  };
  const clearFilter1 = () => {
    initFilters1();
  };
  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1["global"].value = value;

    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  const renderHeader1 = () => {
    return (
      <div className="flex justify-between">
        <div className="flex items-center justify-start gap-8">
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label="Clear"
            className="p-button-outlined"
            onClick={() => {
              clearFilter1();
              setSelectedProducts8([]);
            }}
          />
          {selectedProducts8?.length > 1 && (
            <Button
              type="button"
              // icon="pi pi-filter-slash"
              label="Delete"
              className={`p-button-outlined ${
                selectedProducts8?.length >= 1 ? "" : "disabled"
              }`}
              onClick={() => handleDeleteManyData()}
            />
          )}
        </div>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder="Search By Name..."
          />
        </span>
      </div>
    );
  };
  const header1 = renderHeader1();
  const actionTemplate = (rowData) => {
    // console.log(rowData);
    return (
      <div className="flex items-center justify-center gap-6">
        {rowData?.fullName === selectedProducts8[0]?.fullName && (
          <>
            <FiEdit
              className="cursor-pointer text-inputColor"
              onClick={() => isOpenUpdateUser(rowData)}
            />
            <AiOutlineDelete
              className="cursor-pointer text-blue-600"
              onClick={() => isOpenModalDeleteUser(rowData)}
            />
          </>
        )}
      </div>
    );
  };
  useEffect(() => {
    setLoading(true);
    // const gender = "GENDER";
    setTimeout(async () => {
      // await getAllCodeApi.getByType({ type: gender }).then((data) => {
      //   if (data?.codeNumber === 0) {
      //     setGenderAPI(data.allCode);
      //   }
      // });

      await getUserApi.getUserByRole({ role: "R6" }).then((data) => {
        if (data?.codeNumber === 0) {
          setUsers(data.user);
        }
      });
      setLoading(false);
      // scroll?.isScroll();
      initFilters1();
    }, 1500);
  }, []);

  const handleChangeEvent = (value, type) => {
    const stateArr = [
      "Email",
      "Password",
      "FullName",
      "PhoneNumber",
      "Address",
      // "Gender",
    ];
    const setStateArr = [
      setEmail,
      setPassword,
      setFullName,
      setPhoneNumber,
      setAddress,
      // setGender,
    ];
    for (let i = 0; i < stateArr.length; i++) {
      if (type === stateArr[i]) {
        setStateArr[i](value);
        break;
      } else {
        continue;
      }
    }
  };

  // const handleChangeAndPreviewImage = async (e) => {
  //   let data = e.target.files;
  //   let file = data[0];
  //   if (file) {
  //     let urlAvatar = URL.createObjectURL(file);
  //     setPreviewAvatar(urlAvatar);
  //     try {
  //       const base64File = await convertFileToBase64(file);
  //       setAvatar(base64File);
  //     } catch (e) {
  //       console.log("base64 file " + e);
  //     }
  //   }
  // };

  const handleCheckNullState = () => {
    let result = true;
    const stateArr = [email, password, fullName, phoneNumber, address];
    const notification_en = [
      "Email",
      "Password",
      "FullName",
      "PhoneNumber",
      "Address",
      // "Gender",
    ];
    const notification_vi = [
      "Trường Email",
      "Trường mật khẩu",
      "Trường tên ",
      "Trường số điện thoại",
      "Trường địa chỉ",
      // "Gender",
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
      const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const regexPassword =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      const rejexPhoneNumber = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
      const regexName = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
      if (!regexEmail.test(email)) {
        setNotifyCheckState(`${t("system.notification.email")}`);
        return false;
      }
      if (!regexPassword.test(password)) {
        setNotifyCheckState(`${t("system.notification.password")}`);
        return false;
      }
      if (!regexName.test(fullName)) {
        setNotifyCheckState(`${t("system.notification.name")}`);
        return false;
      }
      if (!rejexPhoneNumber.test(phoneNumber)) {
        setNotifyCheckState(`${t("system.notification.phone")}`);
        return false;
      }

      return result;
    }
  };

  const handleCreateNewUser = async () => {
    setLoading(true);
    if (handleCheckValidate()) {
      const body = {
        email,
        password,
        fullName,
        phoneNumber,
        roleId: "R6",
        address,
        type: ascertain_user.other,
        // gender,
        // image: avatar,
      };
      createUserApi.create({}, body).then(async (data) => {
        if (data?.codeNumber === -1) {
          toast.error(`${t("system.notification.fail")}`, {
            autoClose: 2000,
            position: "bottom-right",
            theme: "colored",
          });
          setLoading(false);
        } else if (data?.codeNumber === -2) {
          toast.error(`${t("system.token.mess")}`, {
            autoClose: 3000,
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
          }, 3000);
        } else if (data?.codeNumber === 1) {
          toast.error(data?.message, {
            autoClose: 2000,
            position: "bottom-right",
            theme: "colored",
          });
          setLoading(false);
        } else {
          await getUserApi.getUserByRole({ role: "R6" }).then((data) => {
            if (data?.codeNumber === 0) {
              setUsers(data.user);
            }
          });
          //     //clear data modal
          //     emitter.emit("CLEAR_DATA_MODAL");
          //   }
          // });
          toast.success(`${t("system.notification.create")}`, {
            autoClose: 2000,
            position: "bottom-right",
            theme: "colored",
          });
          setEmail("");
          setPassword("");
          setFullName("");
          setPhoneNumber("");
          setLoading(false);
          setAddress("");
          // setGender("");
          // setAvatar("");
          // setPreviewAvatar("");
          // inputFileRef.current.value = "";
        }
      });
    }
  };

  // const isCloseCreateUserModal = () => {
  //   setIsCreateUser(false);
  // };

  // const isOpenModalUpdateUser = (user) => {
  //   setIsUpdateUser(true);
  //   setDataUserUpdate(user)
  // }
  // const isCloseUpdateUserModal = () => {
  //   setIsUpdateUser(false);
  // }

  // const createNewUser = async (body) => {
  //   createUserApi.create({}, body).then((data) => {
  //     if (data?.codeNumber === 1) {
  //       toast.error(data?.message, {
  //          autoClose: 2000,
  // position: "bottom-right",
  // theme: "colored"
  //       });
  //     } else {
  //       getUserApi.getAllUsers({ id: "All" }).then((data) => {
  //         if (data?.codeNumber === 0) {
  //           setUsers(data?.user);
  //           setIsCreateUser(false);
  //           toast.success("Create a new user succeed", {
  //              autoClose: 2000,
  // position: "bottom-right",
  // theme: "colored"
  //           });

  //           //clear data modal
  //           emitter.emit("CLEAR_DATA_MODAL");
  //         }
  //       });
  //     }
  //   });
  // };

  // const updateUser = async(body) => {
  //   updateUserApi.update({}, body).then((data) => {
  //     if (data?.codeNumber === 1) {
  //       toast.error(data?.message, {
  //          autoClose: 2000,
  // position: "bottom-right",
  // theme: "colored"
  //       });
  //     } else {
  //       getUserApi.getAllUsers({ id: "All" }).then((data) => {
  //         if (data?.codeNumber === 0) {
  //           setUsers(data?.user);
  //           setIsUpdateUser(false);
  //           toast.success("Update user succeed", {
  //              autoClose: 2000,
  // position: "bottom-right",
  // theme: "colored"
  //           });
  //         }
  //       });
  //     }
  //   })
  // }

  //update user
  const isOpenUpdateUser = async (user) => {
    setLoading(true);
    setDataUserUpdate(user);
    // let base64File = "";
    // if (user?.image?.data) {
    //   base64File = new Buffer(user.image.data, "base64").toString("binary");
    // }
    setTimeout(async () => {
      setEmail(user?.email);
      setPassword("*************");
      setFullName(user?.fullName);
      setPhoneNumber(user?.phoneNumber);
      setAddress(user?.address);
      // setGender(user?.gender);
      setLoading(false);
      setIsUpdateUser(true);
      // if (base64File) {
      //   setPreviewAvatar(base64File);
      // } else {
      //   setPreviewAvatar("");
      // }
    }, 0);
  };

  const handleUpdateUser = () => {
    setLoading(true);
    const body = {
      id: dataUserUpdate?.id,
      fullName,
      phoneNumber,
      // gender,
      address,
      type: ascertain_user.other,
      // image: avatar,
    };
    setTimeout(() => {
      updateUserApi.update({}, body).then(async (data) => {
        if (data?.codeNumber === -1) {
          toast.error(`${t("system.notification.fail")}`, {
            autoClose: 2000,
            position: "bottom-right",
            theme: "colored",
          });
          setLoading(false);
        } else if (data?.codeNumber === -2) {
          toast.error(`${t("system.token.mess")}`, {
            autoClose: 3000,
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
          }, 3000);
        } else if (data?.codeNumber === 1) {
          toast.error(data?.message, {
            autoClose: 2000,
            position: "bottom-right",
            theme: "colored",
          });
          setLoading(false);
        } else {
          await getUserApi.getUserByRole({ role: "R6" }).then((data) => {
            if (data?.codeNumber === 0) {
              setUsers(data.user);
            }
          });
          toast.success(`${t("system.notification.update")}`, {
            autoClose: 2000,
            position: "bottom-right",
            theme: "colored",
          });
          setEmail("");
          setPassword("");
          setFullName("");
          setPhoneNumber("");
          setAddress("");
          // setGender("");
          setIsUpdateUser(false);
          setDataUserUpdate("");
          // setPreviewAvatar("");
          // inputFileRef.current.value = "";
          // setAvatar("");
          setLoading(false);
        }
      });
    }, 1000);
  };

  const handleCloseUpdateUser = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setPhoneNumber("");
    setAddress("");
    // setGender("");
    // setAvatar("");
    // setPreviewAvatar("");
    setIsUpdateUser(false);
    setDataUserUpdate("");
    // inputFileRef.current.value = "";
  };

  //delete user
  const isCloseDeleteUserModal = () => {
    setIsDeleteUser(false);
  };
  const isOpenModalDeleteUser = (user) => {
    setIsDeleteUser(true);
    setDataUserDelete(user);
  };
  const deleteUser = async (idData) => {
    setLoading(true);
    setTimeout(() => {
      deleteUserApi
        .delete({ id: idData, type: ascertain_user.other })
        .then((data) => {
          if (data?.codeNumber === -1) {
            toast.error(`${t("system.notification.fail")}`, {
              autoClose: 2000,
              position: "bottom-right",
              theme: "colored",
            });
            setLoading(false);
          } else if (data?.codeNumber === -2) {
            toast.error(`${t("system.token.mess")}`, {
              autoClose: 3000,
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
            }, 3000);
          } else if (data?.codeNumber === 1) {
            toast.error(data?.message, {
              autoClose: 2000,
              position: "bottom-right",
              theme: "colored",
            });
            setLoading(false);
          } else {
            getUserApi.getUserByRole({ role: "R6" }).then((data) => {
              if (data?.codeNumber === 0) {
                setUsers(data.user);
                setLoading(false);
                setDataUserDelete("");
                setIsDeleteUser(false);
                toast.success(`${t("system.notification.delete")}`, {
                  autoClose: 2000,
                  position: "bottom-right",
                  theme: "colored",
                });
                setSelectedProducts8([]);
              }
            });
          }
        });
    }, 1000);
  };
  const handleDeleteManyData = () => {
    console.log(selectedProducts8);
    let data = [];
    if (allRowSelected) {
      data = selectedProducts8?.slice(
        (currentPage - 1) * rows1,
        currentPage * rows1
      );
    } else {
      data = selectedProducts8;
    }
    setIsDeleteUser(true);
    setDataUserDelete(data);
  };

  return (
    <Fragment>
      <div
        className="mt-3 flex flex-col mx-auto pb-10"
        style={{ maxWidth: "80%", width: "80%" }}
      >
        <div className="w-full" style={{ height: "100px" }}></div>

        <ToastContainer />

        <p className="mx-auto text-2xl text-blue-500 font-semibold">
          {t("system.health-student.manager-student-health-department")}
        </p>

        <div
          className={`flex items-center justify-center mt-3 gap-1 py-2 px-1 text-white font-semibold rounded-md  ${
            isUpdateUser ? "bg-backColor" : "bg-blue-500"
          }`}
          // type="text"
          // onClick={() => setIsCreateUser(true)}
          style={{ maxWidth: "14%", width: "14%" }}
        >
          <BsPersonPlusFill
            className="mr-1 ml-2"
            style={{ fontSize: "16px" }}
            modal
          />
          {isUpdateUser
            ? t("system.health-student.update")
            : t("system.health-student.create")}
        </div>
        {loading && (
          <div className="fixed loading-overlay top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25">
            <div className="absolute">
              <Loading />
            </div>
          </div>
        )}
        <div className="flex overflow-hidden flex-col h-auto bg-slate-200 rounded-lg shadow backdrop-blur-md shadow-gray-300 mt-2 mb-1">
          <div className="pt-1 pb-4 px-3 flex flex-col justify-center-center w-full">
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
                  className={`shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light 
                  ${isUpdateUser ? "bg-blurColor opacity-30" : ""}`}
                  name="email"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => handleChangeEvent(e.target.value, "Email")}
                  onFocus={() => setNotifyCheckState("")}
                  required
                  disabled={isUpdateUser ? true : false}
                />
              </div>
              <div className="flex-1 flex flex-col justify-center relative">
                <label
                  htmlFor="password"
                  className="mb-1 text-headingColor opacity-80 flex items-center gap-1"
                >
                  {t("system.table.password")} <HiOutlinePencilAlt />
                </label>
                <input
                  className={`shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light 
                  ${isUpdateUser ? "bg-blurColor opacity-30" : ""}`}
                  name="password"
                  id="password"
                  type={`${eye ? "text" : "password"}`}
                  value={password}
                  onChange={(e) =>
                    handleChangeEvent(e.target.value, "Password")
                  }
                  onFocus={() => setNotifyCheckState("")}
                  disabled={isUpdateUser ? true : false}
                />
                {eye ? (
                  <IoMdEye
                    className="absolute right-2 bottom-3 cursor-pointer"
                    onClick={() => setEye(false)}
                  />
                ) : (
                  <BsEyeSlash
                    className="absolute right-2 bottom-3 cursor-pointer"
                    onClick={() => setEye(true)}
                  />
                )}
              </div>
            </div>

            <div className="w-full flex items-center justify-center gap-6 mt-3">
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
                  onChange={(e) =>
                    handleChangeEvent(e.target.value, "FullName")
                  }
                  onFocus={() => setNotifyCheckState("")}
                  placeholder="VD: Ban sức khoẻ thể chất"
                />
              </div>
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
                  onChange={(e) =>
                    handleChangeEvent(e.target.value, "PhoneNumber")
                  }
                  onFocus={() => setNotifyCheckState("")}
                />
              </div>
            </div>

            <div className="w-full flex items-center justify-center gap-6 mt-3">
              <div className="flex flex-col justify-center flex-1">
                <label
                  htmlFor="address"
                  className="mb-1 text-headingColor opacity-80 flex items-center gap-1"
                >
                  {t("system.table.address")} <HiOutlinePencilAlt />
                </label>
                <input
                  className=" shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  name="address"
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => handleChangeEvent(e.target.value, "Address")}
                  onFocus={() => setNotifyCheckState("")}
                  placeholder="VD: Phòng 327 nhà E3"
                />
              </div>
            </div>

            {/* <div className="w-full flex items-center justify-center gap-6 mt-3">
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
                  onChange={(e) => handleChangeEvent(e.target.value, "Gender")}
                  onFocus={() => setNotifyCheckState("")}
                >
                  <option name="gender" value="">
                    Select---
                  </option>
                  {genderAPI?.length > 0 &&
                    genderAPI?.map((e, i) => {
                      return (
                        <option key={i} name="role" value={e?.keyMap}>
                          {e?.valueVn}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="flex-1 flex-col justify-center flex">
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
                  onChange={(e) => handleChangeAndPreviewImage(e)}
                  onFocus={() => setNotifyCheckState("")}
                  ref={inputFileRef}
                />
              </div>
            </div> */}

            {/* <div className="w-full flex item-center justify-start mt-3 gap-6">
              <span className="text-red-500 font-semibold flex-1 flex items-center gap-1">
                {t("system.table.mess-1")} <HiOutlinePencilAlt />{" "}
                {t("system.table.mess-2")}
              </span>
              {previewAvatar && (
                <div className="w-full h-24 flex-1">
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
                </div>
              )}
            </div> */}

            <div className="flex items-center gap-5">
              <button
                className={`${
                  isUpdateUser ? "bg-backColor" : "bg-blue-500"
                } text-white mt-6 py-2 px-1 font-semibold rounded-md shadow backdrop-blur-md bg-opacity-100 hover:bg-opacity-80`}
                style={{ maxWidth: "15%", width: "15%" }}
                onClick={
                  isUpdateUser
                    ? () => handleUpdateUser()
                    : () => handleCreateNewUser()
                }
              >
                {isUpdateUser
                  ? t("system.health-student.save")
                  : t("system.health-student.add")}
              </button>
              {isUpdateUser && (
                <button
                  className={` text-white mt-6 py-2 px-1 font-semibold rounded-md shadow backdrop-blur-md bg-opacity-100 hover:bg-opacity-80 bg-blue-500`}
                  style={{ maxWidth: "10%", width: "10%" }}
                  onClick={() => handleCloseUpdateUser()}
                >
                  {t("system.health-student.close")}
                </button>
              )}
            </div>
          </div>

          {/* <RiDeleteBack2Fill
            className="absolute top-2 right-2 text-white text-xl cursor-pointer" */}
          {/* // onClick={() => isClose()} */}
          {/* /> */}

          {/* <AiOutlineClose
              className="absolute top-1 right-2 text-lg text-gray-300 font-semibold cursor-pointer w-8 h-8 p-2 hover:rounded-full hover:bg-white hover:bg-opacity-30"
              onClick={() => isClose()}
            /> */}
        </div>

        {users?.length === 0 ? null : (
          <div className="w-full mt-8">
            <DataTable
              value={users}
              paginator
              responsiveLayout="scroll"
              paginatorTemplate={template1}
              first={first1}
              rows={rows1}
              onPage={onCustomPage1}
              rowsPerPageOptions={[4, 8, 12]}
              paginatorLeft={paginatorLeft}
              paginatorRight={paginatorRight}
              filters={filters1}
              filterDisplay="menu"
              globalFilterFields={["fullName"]}
              header={header1}
              emptyMessage="No customers found."
              selectionMode="checkbox"
              selection={selectedProducts8}
              onSelectionChange={(e) => setSelectedProducts8(e.value)}
              resizableColumns
              columnResizeMode="fit"
              showGridlines
              onAllRowsSelect={(e) => setAllRowSelected(e)}
              onAllRowsUnselect={() => setAllRowSelected(false)}
              // dataKey="id"
            >
              <Column
                selectionMode="multiple"
                headerStyle={{ width: "3em" }}
              ></Column>
              <Column header={t("system.table.name")} field="fullName"></Column>
              <Column header={t("system.table.email")} field="email"></Column>
              <Column
                // sortable
                field="address"
                header={t("system.table.address")}
              ></Column>
              <Column
                header={t("system.table.phone")}
                field="phoneNumber"
                // body={statusQuantityTemplate}
                style={{ width: "20%" }}
              ></Column>
              {selectedProducts8 && selectedProducts8?.length === 1 && (
                <Column
                  body={actionTemplate}
                  header={t("system.table.action")}
                ></Column>
              )}
            </DataTable>
          </div>
        )}
      </div>

      {/* {isCreateUser && (
        <CreateModal isClose={isCloseCreateUserModal} createNewUser={createNewUser} />
      )} */}

      {isDeleteUser && (
        <div className="fixed z-50 top-0 bottom-0 left-0 right-0 w-full max-h-full bg-black bg-opacity-25"></div>
      )}
      {isDeleteUser && (
        <DeleteModal
          dataUserDelete={dataUserDelete}
          isClose={isCloseDeleteUserModal}
          deleteUser={deleteUser}
          type="user"
        />
      )}
      {/* {
        isUpdateUser && <UpdateModel dataUserUpdate={dataUserUpdate} isClose={isCloseUpdateUserModal} updateUser={updateUser}/>
      } */}
    </Fragment>
  );
};

export default HealthStudentManager;
