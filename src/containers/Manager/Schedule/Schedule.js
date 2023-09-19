import React, { useState, useEffect, Fragment } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import moment from "moment";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { motion, AnimatePresence } from "framer-motion";

import Button from "../../../utils/Button";
import {
  getAllCodeApi,
  getUserApi,
  logOutApi,
} from "../../../services/userService";
import { dateFormat, path } from "../../../utils/constant";
import {
  createSchedule,
  deleteScheduleByIdAndDate,
  getScheduleSystem,
} from "../../../services/scheduleService";

import { useTranslation } from "react-i18next";
import "moment/locale/vi";
import DeleteModal from "../../System/Modal/DeleteModal";
import { logOutUser } from "../../../redux/authSlice";
import { getTeacherHomePageAPI } from "../../../services/teacherService";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button as ButtonPrimeReact } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Ripple } from "primereact/ripple";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";

const ScheduleManager = () => {
  // const [selectedOptionObject, setSelectedOptionObject] = useState({});
  // const [selectedOption, setSelectedOption] = useState({});
  const [startDate, setStartDate] = useState(
    new Date().setDate(new Date().getDate() + 1)
  );

  // const [userData, setUserData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [timeUserSelected, setTimeUserSelected] = useState([]);
  // const [optionSelected, setOptionSelected] = useState();

  const [isUpdate, setIsUpdate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [dataScheduleDelete, setDataScheduleDelete] = useState([]);

  const { t, i18n } = useTranslation();
  console.log({ timeData });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.authReducer);

  //dataTable
  // const [filters1, setFilters1] = useState(null);
  // const [globalFilterValue1, setGlobalFilterValue1] = useState("");
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
    <ButtonPrimeReact
      type="button"
      icon="pi pi-refresh"
      className="p-button-text"
    />
  );
  const paginatorRight = (
    <ButtonPrimeReact
      type="button"
      icon="pi pi-cloud"
      className="p-button-text"
    />
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
  // const initFilters1 = () => {
  //   setFilters1({
  //     global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  //     fullName: {
  //       operator: FilterOperator.AND,
  //       constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  //     },
  //   });
  //   setGlobalFilterValue1("");
  // };
  // const clearFilter1 = () => {
  //   initFilters1();
  // };
  // const onGlobalFilterChange1 = (e) => {
  //   const value = e.target.value;
  //   let _filters1 = { ...filters1 };
  //   _filters1["global"].value = value;

  //   setFilters1(_filters1);
  //   setGlobalFilterValue1(value);
  // };

  const renderHeader1 = () => {
    return (
      <div className="flex justify-between">
        <div className="flex items-center justify-start gap-8">
          <ButtonPrimeReact
            type="button"
            icon="pi pi-filter-slash"
            label="Clear"
            className="p-button-outlined"
            onClick={() => {
              // clearFilter1();
              setSelectedProducts8([]);
            }}
          />
        </div>
        {/* <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder="Search By Name..."
          />
        </span> */}
        {selectedProducts8?.length > 1 && (
          <ButtonPrimeReact
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
    );
  };
  const header1 = renderHeader1();
  const actionTemplate = (rowData) => {
    console.log(rowData);
    console.log(selectedProducts8);
    return (
      <div className="flex items-center justify-center gap-6">
        {rowData[0]?.date === selectedProducts8[0][0]?.date && (
          <>
            <FiEdit
              className="cursor-pointer text-inputColor"
              onClick={() => handleUpdateData(rowData)}
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
  const dateTemplate = (rowData) => {
    return (
      <span>
        {" "}
        {i18n.language === "vi"
          ? `${moment(rowData[0]?.date)
              .format(dateFormat.LABEL_SCHEDULE)
              .charAt(0)
              .toUpperCase()}${moment(rowData[0]?.date)
              .format(dateFormat.LABEL_SCHEDULE)
              .slice(1)}`
          : `${moment(rowData[0]?.date)
              .locale("en")
              .format(dateFormat.LABEL_SCHEDULE)}`}
      </span>
    );
  };
  const timeTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap items-center justify-start gap-1">
        {rowData.map((time, index) => {
          return (
            <div className="mx-3" key={index} style={{ minWidth: "130px" }}>
              {i18n.language === "vi"
                ? time?.timeData?.valueVn
                : time?.timeData?.valueEn}
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    async function fetchData() {
      await getAllCodeApi.getByType({ type: "TIME" }).then((data) => {
        if (data?.codeNumber === 0) {
          let { allCode } = data;
          if (allCode.length > 0) {
            allCode = allCode.map((time, index) => ({
              ...time,
              isSelected: false,
            }));
          }
          setTimeData(allCode);
        }
      });
      await getScheduleSystem
        .get({ managerId: currentUser?.id, roleManager: currentUser?.role })
        .then((data) => {
          if (data?.codeNumber === 0 && data?.schedule_user?.length > 0) {
            //sort by id
            data.schedule_user.sort((a, b) => a.id - b.id);
            let timeScheduleData = [];
            while (data.schedule_user.length > 1) {
              const arr = data.schedule_user;
              let filterArr = [];
              let indexArr = [];
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].date === arr[0].date) {
                  filterArr.push(arr[i]);
                  indexArr.push(i);
                }
              }
              data.schedule_user = data.schedule_user.filter((item, index) => {
                return !indexArr.includes(index);
              });
              timeScheduleData.push(filterArr);
            }
            if (data.schedule_user.length === 1) {
              timeScheduleData.push([data.schedule_user[0]]);
            }
            timeScheduleData.sort((a, b) =>
              moment(a[0].date)
                .format(dateFormat.SEND_TO_SERVER)
                .localeCompare(
                  moment(b[0].date).format(dateFormat.SEND_TO_SERVER)
                )
            );
            setTimeUserSelected(timeScheduleData);
          } else {
            setTimeUserSelected([]);
          }
        });
      setStartDate(new Date().setDate(new Date().getDate() + 1));
      timeData.forEach((time) => {
        time.isSelected = false;
      });
      // setTimeData(timeData);
      setIsUpdate(false);
      // setSelectedOption(e);
    }
    // const handleChangeSelect_detail = async (e) => {
    // console.log(selectedOptionObject);

    // };
    fetchData();

    // initFilters1();
  }, []);

  //option-general select
  // let option_general = [
  //   {
  //     value: "R2",
  //     label: `${t("system.schedule.department")}`,
  //   },
  //   { value: "R4", label: `${t("system.schedule.faculty")}` },
  //   { value: "R5", label: `${t("system.schedule.teacher")}` },
  //   { value: "R6", label: `${t("system.schedule.health")}` },
  // ];

  //option-detail select
  // let options_detail = [];
  // if (userData.length > 0) {
  //   userData.forEach((user, index) => {
  //     options_detail.push({ value: user?.id, label: user?.fullName });
  //   });
  // }

  //handle change select
  // const handleChangeSelect_general = async (e) => {
  //   if (e?.value === "R5") {
  //     await getTeacherHomePageAPI.getTeacher({}).then((data) => {
  //       if (data?.codeNumber === 0) {
  //         setUserData(data.teacher);
  //       }
  //     });
  //   } else {
  //     await getUserApi.getUserByRole({ role: e?.value }).then((data) => {
  //       if (data?.codeNumber === 0) {
  //         setUserData(data?.user);
  //       }
  //     });
  //   }
  //   option_general.forEach((item, index) => {
  //     if (item?.value === e?.value) {
  //       setOptionSelected(index);
  //     }
  //   });
  //   setSelectedOption({});
  //   setTimeUserSelected([]);
  //   setStartDate(new Date().setDate(new Date().getDate() + 1));
  //   timeData.forEach((time) => {
  //     time.isSelected = false;
  //   });
  //   setTimeData(timeData);
  //   setSelectedOptionObject(e);
  //   setIsUpdate(false);
  // };

  //handle change date picker
  const handleChangeDatePicker = (date) => {
    let arrDateSelected = [];
    const currentDate = moment(date).format(dateFormat.SEND_TO_SERVER);
    setStartDate(date);
    if (timeUserSelected && timeUserSelected?.length > 0) {
      for (let i = 0; i < timeUserSelected.length; i++) {
        if (
          moment(timeUserSelected[i][0]?.date).format(
            dateFormat.SEND_TO_SERVER
          ) === currentDate
        ) {
          arrDateSelected = timeUserSelected[i];
          break;
        }
      }
      if (arrDateSelected?.length > 0) {
        let dataDate = [];
        arrDateSelected.forEach((item) => {
          dataDate.push(item?.timeType);
        });
        setIsUpdate(true);
        timeData.forEach((item) => {
          if (dataDate.includes(item.keyMap)) {
            item.isSelected = true;
          } else {
            item.isSelected = false;
          }
        });
      } else {
        setIsUpdate(false);
        timeData.forEach((item) => {
          item.isSelected = false;
        });
      }
      setTimeData(timeData);
    }
  };

  //handle click schedule button
  const clickButton = (time) => {
    const result = timeData.map((item, index) => {
      if (item?.id === time?.id) {
        item.isSelected = !item.isSelected;
      }
      return item;
    });
    setTimeData(result);
  };

  //handleCheckNull
  const handleCheckNull = () => {
    // if (!selectedOption?.value) {
    //   toast.error("Please choose department", {
    //     autoClose: 2000,
    //     position: "bottom-right",
    //     theme: "colored",
    //   });
    //   return false;
    // }
    if (!startDate) {
      toast.error("please choose date", {
        autoClose: 2000,
        position: "bottom-right",
        theme: "colored",
      });
      return false;
    }
    let selectedTimeArr = [];
    let output = [];
    selectedTimeArr = timeData.filter((time, index) => {
      return time.isSelected === true;
    });
    if (selectedTimeArr?.length === 0) {
      toast.error("please choose time", {
        autoClose: 2000,
        position: "bottom-right",
        theme: "colored",
      });
      return false;
    }
    selectedTimeArr.forEach((selectedTime, index) => {
      output.push({
        managerId: currentUser?.id,
        roleManager: currentUser?.role,
        date: moment(startDate).format(dateFormat.SEND_TO_SERVER),
        timeType: selectedTime?.keyMap,
      });
    });
    return output;
  };

  const handleUpdateData = (times) => {
    console.log({ times });
    setIsUpdate(true);
    setStartDate(times[0].date);
    let keyMapSelected = [];
    times.forEach((time) => {
      keyMapSelected.push(time?.timeType);
    });
    timeData.forEach((item) => {
      if (keyMapSelected.includes(item.keyMap)) {
        item.isSelected = true;
      } else {
        item.isSelected = false;
      }
    });
    setTimeData(timeData);
  };

  //handle click save button
  const handleSaveOrUpdateSchedule = async () => {
    if (!handleCheckNull()) {
      return;
    }
    const action = isUpdate ? "update" : "create";
    const body = {
      email: currentUser?.email,
      scheduleData: handleCheckNull(),
      action,
    };
    const data = await createSchedule.create({}, body);
    if (data?.codeNumber === 0) {
      if (data?.message === "create") {
        toast.success(`${t("system.notification.create")}`, {
          autoClose: 2000,
          position: "bottom-right",
          theme: "colored",
        });
        //   setSelectedOption({});
        setSelectedProducts8(null);
      } else {
        toast.success(`${t("system.notification.update")}`, {
          autoClose: 2000,
          position: "bottom-right",
          theme: "colored",
        });
        setIsUpdate(false);
        setSelectedProducts8(null);
      }
      setStartDate(new Date().setDate(new Date().getDate() + 1));
      timeData.map((time) => {
        time.isSelected = false;
        return time;
      });
      setTimeData(timeData);
      await getScheduleSystem
        .get({
          managerId: body.scheduleData[0].managerId,
          roleManager: body.scheduleData[0].roleManager,
        })
        .then((data) => {
          if (data?.codeNumber === 0 && data?.schedule_user?.length > 0) {
            //sort by id
            console.log(data.schedule_user);
            data.schedule_user.sort((a, b) => a.id - b.id);
            let timeScheduleData = [];
            while (data.schedule_user.length > 1) {
              const arr = data.schedule_user;
              let filterArr = [];
              let indexArr = [];
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].date === arr[0].date) {
                  filterArr.push(arr[i]);
                  indexArr.push(i);
                }
              }
              data.schedule_user = data.schedule_user.filter((item, index) => {
                return !indexArr.includes(index);
              });
              timeScheduleData.push(filterArr);
            }
            if (data.schedule_user.length === 1) {
              timeScheduleData.push([data.schedule_user[0]]);
            }
            console.log(timeScheduleData);
            timeScheduleData.sort((a, b) =>
              moment(a[0].date)
                .format(dateFormat.SEND_TO_SERVER)
                .localeCompare(
                  moment(b[0].date).format(dateFormat.SEND_TO_SERVER)
                )
            );
            setTimeUserSelected(timeScheduleData);
          } else {
            setTimeUserSelected([]);
          }
        });
    } else if (data?.codeNumber === -1) {
      toast.error(`${t("system.notification.fail")}`, {
        autoClose: 2000,
        position: "bottom-right",
        theme: "colored",
      });
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
            navigate(`${path.SYSTEM}/${path.LOGIN_SYSTEM}?redirect=/system`);
          }
        });
      }, 3000);
    } else if (data?.codeNumber === 1) {
      toast.error(data?.message, {
        autoClose: 2000,
        position: "bottom-right",
        theme: "colored",
      });
    }
  };

  const handleCloseUpdateSchedule = () => {
    setStartDate(new Date().setDate(new Date().getDate() + 1));
    timeData.forEach((time) => {
      time.isSelected = false;
    });
    setTimeData(timeData);
    setIsUpdate(false);
  };

  //delete
  const isOpenModalDeleteUser = (times) => {
    console.log(times);
    setIsDelete(true);
    setDataScheduleDelete(times);
  };
  const isCloseDeleteUserModal = () => {
    setIsDelete(false);
  };
  const deleteSchedule = async (managerId, date, roleManager) => {
    console.log(date);
    deleteScheduleByIdAndDate
      .delete({ managerId, date, roleManager }, { email: currentUser?.email })
      .then((res) => {
        if (res?.codeNumber === 0) {
          setIsDelete(false);
          setIsUpdate(false);
          setStartDate(new Date().setDate(new Date().getDate() + 1));
          timeData.forEach((time) => {
            time.isSelected = false;
          });
          setTimeData(timeData);

          //load data
          getScheduleSystem.get({ managerId, roleManager }).then((data) => {
            if (data?.codeNumber === 0 && data?.schedule_user?.length > 0) {
              //sort by id
              data.schedule_user.sort((a, b) => a.id - b.id);
              let timeScheduleData = [];
              while (data.schedule_user.length > 1) {
                const arr = data.schedule_user;
                let filterArr = [];
                let indexArr = [];
                for (let i = 0; i < arr.length; i++) {
                  if (arr[i].date === arr[0].date) {
                    filterArr.push(arr[i]);
                    indexArr.push(i);
                  }
                }
                data.schedule_user = data.schedule_user.filter(
                  (item, index) => {
                    return !indexArr.includes(index);
                  }
                );
                timeScheduleData.push(filterArr);
              }
              if (data.schedule_user.length === 1) {
                timeScheduleData.push([data.schedule_user[0]]);
              }
              timeScheduleData.sort((a, b) =>
                moment(a[0].date)
                  .format(dateFormat.SEND_TO_SERVER)
                  .localeCompare(
                    moment(b[0].date).format(dateFormat.SEND_TO_SERVER)
                  )
              );
              setTimeUserSelected(timeScheduleData);
            } else {
              setTimeUserSelected([]);
            }
            setSelectedProducts8([]);
          });
        }
      });
  };

  const handleDeleteManyData = () => {
    let data = [];
    if (allRowSelected) {
      data = selectedProducts8?.slice(
        (currentPage - 1) * rows1,
        currentPage * rows1
      );
    } else {
      data = selectedProducts8;
    }
    setIsDelete(true);
    setDataScheduleDelete(data);
  };

  return (
    <Fragment>
      <ToastContainer />
      <div
        className="mt-3 flex flex-col items-start mx-auto pb-5 gap-8"
        style={{ maxWidth: "80%", width: "80%" }}
      >
        <p className="mx-auto text-2xl text-blue-600 font-semibold">
          {t("system.schedule.manager")}
        </p>
        <div className="flex items-start justify-between w-full gap-10">
          <motion.div
            initial={{ opacity: 0, translateX: 50 }}
            animate={{ opacity: 1, translateX: 0 }}
            exit={{ opacity: 0, translateX: 50 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex-1 flex flex-col justify-center gap-1"
          >
            <label className="text-lg text-opacity-60 text-black">
              {t("system.schedule.date")}
            </label>
            <DatePicker
              value={moment(startDate).format(dateFormat.SEND_TO_SERVER)}
              onChange={(date) => handleChangeDatePicker(date)}
              minDate={new Date().setDate(new Date().getDate() + 1)}
              className="w-full border-opacity-60 border-blurColor rounded-sm"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, translateX: 50 }}
          animate={{ opacity: 1, translateX: 0 }}
          exit={{ opacity: 0, translateX: 50 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="w-full"
        >
          <div className="flex flex-col justify-center items-start gap-1 mb-5">
            <label className="text-lg text-opacity-60 text-black">
              {t("system.schedule.time")}
            </label>
            <div className="flex items-center justify-start gap-5 flex-wrap">
              {timeData.length > 0 &&
                timeData.map((time, index) => (
                  <Button
                    key={index}
                    text={
                      i18n.language === "vi" ? time?.valueVn : time?.valueEn
                    }
                    value={time?.keyMap}
                    isSelected={time?.isSelected}
                    click={() => clickButton(time)}
                  />
                ))}
            </div>
          </div>

          <div className="flex items-center justify-start gap-3">
            <Button
              text={`${
                isUpdate
                  ? t("system.schedule.update")
                  : t("system.schedule.save")
              }`}
              type={`${isUpdate ? "update" : "save"}`}
              click={handleSaveOrUpdateSchedule}
            />
            {isUpdate && (
              <button
                className={` text-white mb-2 py-2 px-1 font-semibold rounded-md shadow backdrop-blur-md bg-opacity-100 hover:bg-opacity-80 bg-blue-500`}
                style={{ maxWidth: "10%", width: "10%" }}
                onClick={() => handleCloseUpdateSchedule()}
              >
                {t("system.department.close")}
              </button>
            )}
          </div>
        </motion.div>
      </div>
      <div
        className="flex items-start mx-auto pb-16"
        style={{ maxWidth: "80%", width: "80%" }}
      >
        {timeUserSelected?.length === 0 ? null : (
          <div className="w-full mt-8">
            <DataTable
              value={timeUserSelected}
              paginator
              responsiveLayout="scroll"
              paginatorTemplate={template1}
              first={first1}
              rows={rows1}
              onPage={onCustomPage1}
              rowsPerPageOptions={[4, 8, 12]}
              paginatorLeft={paginatorLeft}
              paginatorRight={paginatorRight}
              // filters={filters1}
              filterDisplay="menu"
              // globalFilterFields={[""]}
              header={header1}
              // emptyMessage="No customers found."
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
              <Column
                header={t("system.schedule.table.date")}
                body={dateTemplate}
              ></Column>
              <Column
                header={t("system.schedule.table.time")}
                body={timeTemplate}
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

      {isDelete && (
        <div className="fixed z-50 top-0 bottom-0 left-0 right-0 w-full max-h-full bg-black bg-opacity-25"></div>
      )}
      {isDelete && (
        <DeleteModal
          dataUserDelete={dataScheduleDelete}
          isClose={isCloseDeleteUserModal}
          deleteUser={deleteSchedule}
          type="schedule"
        />
      )}
    </Fragment>
  );
};

export default ScheduleManager;
