import React, { useRef } from "react";
import { useState, useEffect } from "react";

import { BsBox, BsCheck2Square, BsXCircle } from "react-icons/bs";
import { AiOutlineFileDone, AiOutlineDelete } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import { FaRunning } from "react-icons/fa";
import { GrRefresh } from "react-icons/gr";
import { BiMessageSquareEdit } from "react-icons/bi";
import {
  getAllBooking,
  updateStatusBookingSchedule,
} from "../../../services/bookingService";
import Loading from "./../../../utils/Loading";

import { useTranslation } from "react-i18next";
import moment from "moment";
import { dateFormat, path } from "../../../utils/constant";

import "../DepartmentManager/DepartmentManager.scss";

import { motion, AnimatePresence } from "framer-motion";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Ripple } from "primereact/ripple";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { Tooltip } from "primereact/tooltip";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logOutApi } from "../../../services/userService";
import { logOutUser } from "../../../redux/authSlice";
import { useNavigate } from "react-router";
import GetCancelReason from "./GetCancelReason";
import ConfirmAnswer from "./ConfirmAnswer";

const ActionItem = ({ action, managerId, roleManager }) => {
  const [loading, setLoading] = useState(false);
  const [loadingFull, setLoadingFull] = useState(false);
  const [dataBookingFilter, setDataBookingFilter] = useState([]);
  const [dataBookingTotal, setDataBookingTotal] = useState([]);

  const [status, setStatus] = useState("total");

  const [detail, setDetail] = useState(false);
  const [dataBookingSelect, setDataBookingSelect] = useState([]);
  const [answer, setAnswer] = useState(false);
  const [dataAnswer, setDataAnswer] = useState("");
  const [
    isOpenModalAnswerQuestionConfirm,
    setIsOpenModalAnswerQuestionConfirm,
  ] = useState(false);
  const [dataConfirmAnswer, setDataConfirmAnswer] = useState([]);
  const [isOpenModelCancel, setIsOpenModelCancel] = useState(false);
  const [dataModalCancel, setDataModelCancel] = useState([]);

  console.log(dataBookingSelect);

  const { t, i18n } = useTranslation();
  const currentUser = useSelector((state) => state.authReducer);
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

  console.log(selectedProducts8);

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
      "CurrentPageReport PrevPageLink PageLinks NextPageLink RowsPerPageDropdown ",
    CurrentPageReport: (options) => {
      return (
        <span
          style={{
            color: "var(--text-color)",
            opacity: "60",
            fontSize: "12px",
            userSelect: "none",
            width: "120px",
            textAlign: "center",
          }}
        >
          {`Show ${options.first} - ${options.last} of ${options.totalRecords}`}
        </span>
      );
    },
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
  };

  //filter
  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      statusId: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      "studentData.fullName": {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      "studentData.email": {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      updatedAt: {
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
              setSelectedProducts8(null);
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
              // onClick={() => handleDeleteManyData()}
            />
          )}
        </div>
        <span className="p-input-icon-left" style={{ width: "350px" }}>
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder={`${
              action === "schedule"
                ? "Search by name, email, date or status"
                : "Search by name, email, time or status"
            }`}
            style={{ width: "100%" }}
          />
        </span>
      </div>
    );
  };
  const header1 = renderHeader1();
  const actionTemplate = (rowData) => {
    return (
      <>
        <div className="flex items-center justify-center gap-5">
          <Button
            tooltip="See detail"
            tooltipOptions={{ position: "top" }}
            style={{
              color: "#812222",
              backgroundColor: "transparent",
              padding: "2px",
              border: "none",
              borderRadius: "25px",
            }}
          >
            <FaEye
              className="text-xl"
              onClick={() => HandleDetailBooking(rowData)}
            />
          </Button>
          {status === "process" && (
            <Button
              tooltip="Confirm appointment completion"
              tooltipOptions={{ position: "top" }}
              style={{
                color: "green",
                backgroundColor: "transparent",
                padding: "2px",
                border: "none",
                borderRadius: "25px",
              }}
              onClick={() => {
                //  setDataBookingSelect(rowData);
                acceptOrCancelSchedule("done", rowData);
              }}
            >
              <BsCheck2Square
                className="text-xl"
                // onClick={() => HandleDetailBooking(rowData)}
              />
            </Button>
          )}
          {status === "new" &&
            (action === "schedule" ? (
              <>
                <Button
                  tooltip="Accept this schedule"
                  tooltipOptions={{ position: "top" }}
                  style={{
                    color: "blue",
                    backgroundColor: "transparent",
                    padding: "2px",
                    border: "none",
                    borderRadius: "25px",
                  }}
                  onClick={() => {
                    // setDataBookingSelect(rowData);
                    acceptOrCancelSchedule("process", rowData);
                  }}
                >
                  <BsCheck2Square className="text-xl " />
                </Button>
                <Button
                  tooltip="Cancel this schedule"
                  tooltipOptions={{ position: "top" }}
                  style={{
                    color: "red",
                    backgroundColor: "transparent",
                    padding: "2px",
                    border: "none",
                    borderRadius: "25px",
                  }}
                  onClick={() => {
                    // setDataBookingSelect(rowData);
                    acceptOrCancelSchedule("cancel", rowData);
                  }}
                >
                  <BsXCircle className="text-xl " />
                </Button>
              </>
            ) : (
              <Button
                tooltip="Answer this question"
                tooltipOptions={{ position: "top" }}
                style={{
                  color: "blue",
                  backgroundColor: "transparent",
                  padding: "2px",
                  border: "none",
                  borderRadius: "25px",
                }}
              >
                <BiMessageSquareEdit
                  className="text-xl"
                  onClick={() => HandleDetailBooking(rowData, "answer")}
                />
              </Button>
            ))}
          {(status === "cancel" || status === "done") && (
            <Button
              tooltip="Remove this schedule to database"
              tooltipOptions={{ position: "top" }}
              style={{
                color: "blue",
                backgroundColor: "transparent",
                padding: "2px",
                border: "none",
                borderRadius: "25px",
              }}
            >
              <AiOutlineDelete className="text-xl" />
            </Button>
          )}
        </div>
      </>
    );
  };

  const timeTemplate = (rowData) => {
    return <span>{rowData.updatedAt}</span>;
  };

  const dateTemplate = (rowData) => {
    return <span>{rowData.date}</span>;
  };

  const statusTemplate = (rowData) => {
    let value = "";
    if (rowData.statusId === "S1") {
      value = "New";
    } else if (rowData.statusId === "S2") {
      value = "In Process";
    } else if (rowData.statusId === "S3") {
      value = "Done";
    } else if (rowData.statusId === "S4") {
      value = "Cancel";
    }
    return <span>{value}</span>;
  };

  useEffect(() => {
    console.log(moment("2023-09-19T17:00:00.000Z").format("DD/MM/YYYY"));
    let statusId = [];
    if (status === "total") {
      statusId = ["S1", "S2", "S3", "S4"];
    } else if (status === "process") {
      statusId = ["S2"];
    } else if (status === "new") {
      statusId = ["S1"];
    } else if (status === "cancel") {
      statusId = ["S4"];
    } else {
      statusId = ["S3"];
    }
    const params = {
      managerId,
      roleManager,
      actionId: action === "schedule" ? "A1" : "A2",
      statusId,
    };
    const paramTotals = {
      managerId,
      roleManager,
      actionId: action === "schedule" ? "A1" : "A2",
      statusId: ["S1", "S2", "S3", "S4"],
    };
    setLoading(true);
    setTimeout(async () => {
      await getAllBooking.getByManagerAndAction(params).then((res) => {
        if (res?.codeNumber === 0) {
          if (res?.allBooking?.length > 0) {
            console.log(res?.allBooking);
            res?.allBooking?.forEach((item) => {
              console.log(item);
              item.date = moment(item?.date).format(dateFormat.LABEL_SCHEDULE);
              item.updatedAt = moment(item?.updatedAt).format(
                dateFormat.LABEL_SCHEDULE
              );
            });
          }
          setDataBookingFilter(res?.allBooking);
        }
      });
      await getAllBooking.getByManagerAndAction(paramTotals).then((res) => {
        if (res?.codeNumber === 0) {
          setDataBookingTotal(res?.allBooking);
        }
      });
      setLoading(false);
    }, 1000);
    initFilters1();
    setSelectedProducts8(null);
    setDetail(false);
    setAnswer(false);
    setDataBookingSelect([]);
  }, [action, status]);

  console.log(dataBookingFilter, action);

  let countProcess = 0,
    countDone = 0,
    countNew = 0,
    countCancel = 0;
  if (dataBookingTotal?.length > 0) {
    dataBookingTotal.forEach((item) => {
      if (item?.statusId === "S2") {
        countProcess += 1;
      } else if (item?.statusId === "S1") {
        countNew += 1;
      } else if (item?.statusId === "S3") {
        countDone += 1;
      } else {
        countCancel += 1;
      }
    });
  }

  const handleRefresh = () => {
    if (status === "total") {
      const params = {
        managerId,
        roleManager,
        actionId: action === "schedule" ? "A1" : "A2",
        statusId: ["S1", "S2", "S3", "S4"],
      };
      setTimeout(() => {
        getAllBooking.getByManagerAndAction(params).then((res) => {
          if (res?.codeNumber === 0) {
            if (res?.allBooking?.length > 0) {
              console.log(res?.allBooking);
              res?.allBooking?.forEach((item) => {
                console.log(item);
                item.date = moment(item?.date).format(
                  dateFormat.LABEL_SCHEDULE
                );
              });
            }
            setDataBookingFilter(res?.allBooking);
            setDataBookingTotal(res?.allBooking);
          }
        });
      }, 1000);
      setDetail(false);
      setAnswer(false);
      setDataBookingSelect([]);
      setSelectedProducts8(null);
    } else {
      setStatus("total");
    }
  };

  const HandleDetailBooking = (data, action) => {
    setDetail(true);
    setDataBookingSelect(data);
    setSelectedProducts8([data]);
    if (action === "answer") {
      setAnswer(true);
    } else {
      setAnswer(false);
    }
    setDataAnswer("");
  };

  //handle question
  const handleAnswerQuestion = () => {
    setAnswer(true);
  };

  const isOpenModalConfirmAnswer = () => {
    if (!dataAnswer) {
      toast.error(t("system.notification.miss"), {
        autoClose: 3000,
        position: "bottom-right",
        theme: "colored",
      });
    } else {
      console.log(dataBookingSelect);
      console.log(dataAnswer);
      setIsOpenModalAnswerQuestionConfirm(true);
      setDataConfirmAnswer(dataBookingSelect);
    }
  };

  const closeModalConfirmAnswer = () => {
    setIsOpenModalAnswerQuestionConfirm();
    setDataConfirmAnswer([]);
  };

  const confirmAnswerQuestion = async (data) => {
    setLoadingFull(true);

    const body = {
      email: currentUser?.email,
      managerId: data?.managerId,
      roleManager: data?.roleManager,
      studentId: data?.studentData?.id,
      actionId: "A2",
      type: "done",
      answer: dataAnswer,
    };
    await updateStatusBookingSchedule.update({}, body).then((res) => {
      if (res?.codeNumber === -1) {
        setLoadingFull(false);
        toast.error(`${t("system.notification.fail")}`, {
          autoClose: 2000,
          position: "bottom-right",
          theme: "colored",
        });
        setLoading(false);
      } else if (res?.codeNumber === -2) {
        setLoadingFull(false);

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
      } else if (res?.codeNumber === 1) {
        setLoadingFull(false);

        toast.error(res?.message, {
          autoClose: 2000,
          position: "bottom-right",
          theme: "colored",
        });
      } else {
        const clearData = async () => {
          setDetail(false);
          setDataBookingSelect([]);
          setIsOpenModalAnswerQuestionConfirm(false);
          setDataModelCancel([]);
          setDataAnswer("");
          setSelectedProducts8(null);
          await handleRefresh();
          setLoadingFull(false);
          toast.success(`${t("system.notification.create")}`, {
            autoClose: 2000,
            position: "bottom-right",
            theme: "colored",
          });
        };
        clearData();
      }
    });
  };

  //handle schedule
  const acceptOrCancelSchedule = async (type, rowData) => {
    setSelectedProducts8([rowData]);
    if (type === "process" || type === "done") {
      if (type === "done") {
        const currentDate = moment(new Date()).format("DD/MM/YYYY");
        const dateSchedule = rowData.date.split("-")[1].trim();
        if (currentDate < dateSchedule) {
          toast.error(
            `${
              i18n.language === "en"
                ? "This appointment is not occurred yet."
                : "Cuộc hẹn này chưa xảy ra."
            }`,
            {
              autoClose: 3000,
              position: "bottom-right",
              theme: "colored",
            }
          );
          return;
        } else {
          const currentHour = new Date().getHours();
          const hourShedule = rowData?.timeDataBooking.valueVn
            .split("-")[1]
            .trim()
            .split(":")[0];
          if (currentHour < hourShedule) {
            toast.error(
              `${
                i18n.language === "en"
                  ? "This appointment is not occurred yet."
                  : "Cuộc hẹn này chưa xảy ra."
              }`,
              {
                autoClose: 3000,
                position: "bottom-right",
                theme: "colored",
              }
            );
            return;
          }
        }
      }
      setLoadingFull(true);
      let dateFormat = rowData.date.split("-")[1].trim().split("/");
      dateFormat = new Date(+dateFormat[2], +dateFormat[1] - 1, +dateFormat[0]);
      const body = {
        email: currentUser?.email,
        managerId: rowData?.managerId,
        roleManager: rowData?.roleManager,
        studentId: rowData?.studentData?.id,
        actionId: "A1",
        date: dateFormat,
        timeType: rowData?.timeType,
        time: rowData?.timeDataBooking?.valueVn,
        type,
      };
      console.log(body);
      await updateStatusBookingSchedule.update({}, body).then((res) => {
        if (res?.codeNumber === -1) {
          setLoadingFull(false);

          toast.error(`${t("system.notification.fail")}`, {
            autoClose: 2000,
            position: "bottom-right",
            theme: "colored",
          });
        } else if (res?.codeNumber === -2) {
          setLoadingFull(false);

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
        } else if (res?.codeNumber === 1) {
          setLoadingFull(false);

          toast.error(res?.message, {
            autoClose: 2000,
            position: "bottom-right",
            theme: "colored",
          });
        } else {
          const clearData = async () => {
            setDetail(false);
            setDataBookingSelect([]);
            await handleRefresh();
            setLoadingFull(false);
            toast.success(`${t("system.notification.create")}`, {
              autoClose: 2000,
              position: "bottom-right",
              theme: "colored",
            });
          };
          clearData();
        }
      });
    } else if (type === "cancel") {
      setIsOpenModelCancel(true);
      setDataModelCancel(dataBookingSelect);
    }
  };
  const closeModalCancel = () => {
    setIsOpenModelCancel(false);
    setDataModelCancel([]);
  };
  const confirmCancelSchedule = async (data, reason) => {
    if (!reason) {
      toast.error(t("system.notification.miss"), {
        autoClose: 3000,
        position: "bottom-right",
        theme: "colored",
      });
    } else {
      setLoadingFull(true);
      let dateFormat = data.date.split("-")[1].trim().split("/");
      dateFormat = new Date(+dateFormat[2], +dateFormat[1] - 1, +dateFormat[0]);
      const body = {
        email: currentUser?.email,
        managerId: data?.managerId,
        roleManager: data?.roleManager,
        studentId: data?.studentData?.id,
        actionId: "A1",
        date: dateFormat,
        timeType: data?.timeType,
        time: dataBookingSelect?.timeDataBooking?.valueVn,
        type: "cancel",
        reasonCancel: reason,
      };
      await updateStatusBookingSchedule.update({}, body).then((res) => {
        if (res?.codeNumber === -1) {
          setLoadingFull(false);
          toast.error(`${t("system.notification.fail")}`, {
            autoClose: 2000,
            position: "bottom-right",
            theme: "colored",
          });
          setLoading(false);
        } else if (res?.codeNumber === -2) {
          setLoadingFull(false);

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
        } else if (res?.codeNumber === 1) {
          setLoadingFull(false);

          toast.error(res?.message, {
            autoClose: 2000,
            position: "bottom-right",
            theme: "colored",
          });
        } else {
          const clearData = async () => {
            setDetail(false);
            setDataBookingSelect([]);
            setIsOpenModelCancel(false);
            setDataModelCancel([]);
            await handleRefresh();
            setLoadingFull(false);
            toast.success(`${t("system.notification.create")}`, {
              autoClose: 2000,
              position: "bottom-right",
              theme: "colored",
            });
          };
          clearData();
        }
      });
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex flex-col items-start justify-center w-full">
        <div className="w-full status-item flex items-center justify-start gap-6 pt-4">
          <button
            type="button"
            class={`hover:bg-blue-800 flex items-center justify-center gap-1 transition-all duration-500 flex-1 hover:text-white rounded-lg focus:ring-4 focus:ring-blue-300 font-medium  text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
                ${
                  status === "total"
                    ? "text-white bg-blue-800"
                    : "text-gray-400 bg-white border border-gray-600"
                }`}
            onClick={() => setStatus("total")}
          >
            <BsBox />
            {`${
              action === "schedule"
                ? "Total of schedule:"
                : "Total of question:"
            }`}{" "}
            <span className="text">
              {dataBookingTotal?.length ? dataBookingTotal.length : 0}
            </span>
          </button>
          <button
            type="button"
            class={`hover:bg-blue-800 flex items-center justify-center gap-1 transition-all duration-500 flex-1 hover:text-white rounded-lg focus:ring-4 focus:ring-blue-300 font-medium  text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
               ${
                 status === "new"
                   ? "text-white bg-blue-800"
                   : "text-gray-400 bg-white border border-gray-600"
               }`}
            onClick={() => setStatus("new")}
          >
            <FaRunning /> New:
            <span className="text">{countNew ? countNew : 0}</span>
          </button>
          {action === "schedule" && (
            <button
              type="button"
              class={`hover:bg-blue-800 flex items-center justify-center gap-1 transition-all duration-500 flex-1 hover:text-white rounded-lg focus:ring-4 focus:ring-blue-300 font-medium  text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
                  ${
                    status === "process"
                      ? "text-white bg-blue-800"
                      : "text-gray-400 bg-white border border-gray-600"
                  }`}
              onClick={() => setStatus("process")}
            >
              <FaRunning /> In process:
              <span className="text">{countProcess ? countProcess : 0}</span>
            </button>
          )}
          <button
            type="button"
            class={`hover:bg-blue-800 flex items-center justify-center gap-1 transition-all duration-500 flex-1 hover:text-white rounded-lg focus:ring-4 focus:ring-blue-300 font-medium  text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
               ${
                 status === "done"
                   ? "text-white bg-blue-800"
                   : "text-gray-400 bg-white border border-gray-600"
               }`}
            onClick={() => setStatus("done")}
          >
            <AiOutlineFileDone /> Done:
            <span className="text">{countDone ? countDone : 0}</span>
          </button>
          {action === "schedule" && (
            <button
              type="button"
              class={`hover:bg-blue-800 flex items-center justify-center gap-1 transition-all duration-500 flex-1 hover:text-white rounded-lg focus:ring-4 focus:ring-blue-300 font-medium  text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
                  ${
                    status === "cancel"
                      ? "text-white bg-blue-800"
                      : "text-gray-400 bg-white border border-gray-600"
                  }`}
              onClick={() => setStatus("cancel")}
            >
              <AiOutlineFileDone /> Cancel:
              <span className="text">{countCancel ? countCancel : 0}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => handleRefresh()}
            class={`hover:bg-blue-800 flex text-gray-400 bg-white border border-gray-600 items-center justify-center gap-1 transition-all duration-500 flex-1 hover:text-white rounded-lg focus:ring-4 focus:ring-blue-300 font-medium  text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
                `}
          >
            {/* <GrRefresh className="text-xl text-white" /> */}
            Refresh
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <>
            {dataBookingFilter?.length === 0 ? null : (
              <div className="w-full mt-8">
                <DataTable
                  value={dataBookingFilter}
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
                  globalFilterFields={
                    action === "schedule"
                      ? [
                          "statusId",
                          "studentData.fullName",
                          "studentData.email",
                          "date",
                        ]
                      : [
                          "statusId",
                          "studentData.fullName",
                          "studentData.email",
                          "updatedAt",
                        ]
                  }
                  header={header1}
                  emptyMessage="No customers found."
                  selectionMode={`${
                    status === "cancel" || status === "done"
                      ? "checkbox"
                      : "single"
                  }`}
                  selection={selectedProducts8}
                  onSelectionChange={(e) =>
                    (status === "cancel" || status === "done") &&
                    setSelectedProducts8(e.value)
                  }
                  resizableColumns
                  columnResizeMode="fit"
                  showGridlines
                  // onAllRowsSelect={(e) => setAllRowSelected(e)}
                  // onAllRowsUnselect={() => setAllRowSelected(false)}
                  // dataKey="id"
                >
                  {(status === "cancel" || status === "done") && (
                    <Column
                      selectionMode="multiple"
                      headerStyle={{ width: "3em" }}
                    ></Column>
                  )}
                  <Column
                    header={t("system.table.name")}
                    field="studentData.fullName"
                    filterField="studentData.fullName"
                  ></Column>
                  <Column
                    header={t("system.table.email")}
                    field="studentData.email"
                    filterField="studentData.email"
                  ></Column>
                  <Column
                    field="studentData.faculty"
                    header={t("system.header.faculty")}
                  ></Column>
                  {action === "question" && (
                    <Column header="Time" body={timeTemplate}></Column>
                  )}
                  {action === "schedule" && (
                    <Column header="Date" body={dateTemplate}></Column>
                  )}
                  {action === "schedule" && (
                    <Column
                      header="Time"
                      field="timeDataBooking.valueEn"
                    ></Column>
                  )}
                  {status === "total" && (
                    <Column header="Status" body={statusTemplate}></Column>
                  )}
                  <Column
                    body={actionTemplate}
                    header={t("system.table.action")}
                  ></Column>
                </DataTable>
              </div>
            )}
            <AnimatePresence>
              {detail && (
                <motion.div
                  className="mt-5 w-full mx-auto"
                  initial={{ opacity: 0, translateX: -50 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  exit={{ opacity: 0, translateX: -50 }}
                >
                  {action === "schedule" ? (
                    <div className="rounded-sm shadow-sm px-4 py-5 bg-gray-200 flex flex-col items-start justify-center gap-5">
                      <div className="flex items-center justify-start gap-5 w-full">
                        <div className="flex-1">
                          <label
                            htmlFor="helper-text"
                            class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                          >
                            FullName
                          </label>
                          <input
                            type="text"
                            id="helper-text"
                            disabled
                            value={dataBookingSelect?.studentData?.fullName}
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          />
                        </div>
                        <div className="flex-1">
                          <label
                            htmlFor="helper-text"
                            class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                          >
                            Email
                          </label>
                          <input
                            type="text"
                            id="helper-text"
                            disabled
                            value={dataBookingSelect?.studentData?.email}
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          />
                        </div>
                        <div className="flex-1">
                          <label
                            htmlFor="helper-text"
                            class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                          >
                            Faculty
                          </label>
                          <input
                            type="text"
                            id="helper-text"
                            disabled
                            value={dataBookingSelect?.studentData?.faculty}
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-start gap-5 w-full">
                        <div className="flex-1">
                          <label
                            htmlFor="helper-text"
                            class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                          >
                            Date
                          </label>
                          <input
                            type="text"
                            id="helper-text"
                            disabled
                            value={dataBookingSelect?.date}
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          />
                        </div>
                        <div className="flex-1">
                          <label
                            htmlFor="helper-text"
                            class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                          >
                            Time
                          </label>
                          <input
                            type="text"
                            id="helper-text"
                            disabled
                            value={dataBookingSelect?.timeDataBooking?.valueEn}
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          />
                        </div>
                        <div className="flex-1">
                          <label
                            htmlFor="helper-text"
                            class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                          >
                            PhoneNumber
                          </label>
                          <input
                            type="text"
                            id="helper-text"
                            disabled
                            value={dataBookingSelect?.studentData?.phoneNumber}
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          />
                        </div>
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="helper-text"
                          class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                        >
                          Reason
                        </label>
                        <input
                          type="text"
                          id="helper-text"
                          value={dataBookingSelect?.reason}
                          disabled
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>

                      <div className="flex items-center justify-start gap-6 py-4 w-full">
                        {status === "process" && (
                          <button
                            type="submit"
                            class={`border border-blue-600 hover:bg-blue-600 hover:text-white bg-white text-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2 mr-2 mb-2 focus:outline-none
                    `}
                            onClick={() =>
                              acceptOrCancelSchedule("done", dataBookingSelect)
                            }
                          >
                            Confirm completion
                          </button>
                        )}
                        {status === "new" && (
                          <>
                            <button
                              type="submit"
                              class={`border border-blue-600 hover:bg-blue-600 hover:text-white bg-white text-blue-600  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2 mr-2 mb-2 focus:outline-none
                    `}
                              onClick={() =>
                                acceptOrCancelSchedule(
                                  "process",
                                  dataBookingSelect
                                )
                              }
                            >
                              Accept
                            </button>
                            <button
                              type="submit"
                              class={`border border-red-500 hover:bg-red-500 hover:text-white text-red-500 bg-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2 mr-2 mb-2 focus:outline-none
                    `}
                              onClick={() =>
                                acceptOrCancelSchedule(
                                  "cancel",
                                  dataBookingSelect
                                )
                              }
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        <button
                          type="text"
                          class={`border border-blue-600 hover:bg-blue-600 hover:text-white bg-white text-blue-600  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-7 py-2 mr-2 mb-2 focus:outline-none
                    `}
                          onClick={() => {
                            setDetail(false);
                            setDataBookingSelect([]);
                            setSelectedProducts8(null);
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-sm shadow-sm px-4 py-5 bg-gray-200 flex flex-col items-start justify-center gap-5">
                      <div className="flex items-center justify-start gap-5 w-full">
                        <div className="flex-1">
                          <label
                            htmlFor="helper-text"
                            class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                          >
                            FullName
                          </label>
                          <input
                            type="text"
                            id="helper-text"
                            disabled
                            value={dataBookingSelect?.studentData?.fullName}
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          />
                        </div>
                        <div className="flex-1">
                          <label
                            htmlFor="helper-text"
                            class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                          >
                            Email
                          </label>
                          <input
                            type="text"
                            id="helper-text"
                            disabled
                            value={dataBookingSelect?.studentData?.email}
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-start gap-5 w-full">
                        <div className="flex-1">
                          <label
                            htmlFor="helper-text"
                            class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                          >
                            Faculty
                          </label>
                          <input
                            type="text"
                            id="helper-text"
                            disabled
                            value={dataBookingSelect?.studentData?.faculty}
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          />
                        </div>
                        <div className="flex-1">
                          <label
                            htmlFor="helper-text"
                            class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                          >
                            Time
                          </label>
                          <input
                            type="text"
                            id="helper-text"
                            disabled
                            value={dataBookingSelect?.updatedAt}
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          />
                        </div>
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="helper-text"
                          class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                        >
                          Subject
                        </label>
                        <input
                          type="text"
                          id="helper-text"
                          value={dataBookingSelect?.subject}
                          disabled
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="helper-text"
                          class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                        >
                          Question
                        </label>
                        <textarea
                          type="text"
                          id="helper-text"
                          value={dataBookingSelect?.question}
                          disabled
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                      {answer && (
                        <div className="w-full">
                          <label
                            htmlFor="helper-text"
                            class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                          >
                            Answer question
                          </label>
                          <textarea
                            type="text"
                            id="helper-text"
                            row="7"
                            autoFocus
                            value={dataAnswer}
                            onChange={(e) => setDataAnswer(e.target.value)}
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-start gap-6 py-4 w-full">
                        {status === "new" && (
                          <button
                            type="submit"
                            class={`border border-backColor text-backColor bg-white hover:text-white hover:bg-backColor  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-7 py-2 mr-2 mb-2 focus:outline-none
                    `}
                            onClick={
                              !answer
                                ? handleAnswerQuestion
                                : isOpenModalConfirmAnswer
                            }
                          >
                            {answer ? "Confirm Answer" : "Answer"}
                          </button>
                        )}
                        <button
                          type="text"
                          class={`border border-blue-600 hover:bg-blue-600 hover:text-white text-blue-600 bg-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-7 py-2 mr-2 mb-2 focus:outline-none
                    `}
                          onClick={() => {
                            setDetail(false);
                            setDataBookingSelect([]);
                            setSelectedProducts8(null);
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {(isOpenModelCancel || isOpenModalAnswerQuestionConfirm) && (
        <div className="fixed z-50 top-0 bottom-0 left-0 right-0 w-full max-h-full bg-black bg-opacity-25"></div>
      )}
      {isOpenModelCancel && (
        <GetCancelReason
          dataModalCancel={dataModalCancel}
          isClose={closeModalCancel}
          confirmCancel={confirmCancelSchedule}
        />
      )}

      {isOpenModalAnswerQuestionConfirm && (
        <ConfirmAnswer
          dataAnswerQuestion={dataConfirmAnswer}
          isClose={closeModalConfirmAnswer}
          confirmAnswer={confirmAnswerQuestion}
        />
      )}

      {loadingFull && (
        <div className="fixed z-50 top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25">
          <div className="absolute">
            <Loading />
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionItem;
