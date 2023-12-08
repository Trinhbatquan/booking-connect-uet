import React,{ useRef } from "react";
import { useState,useEffect } from "react";

import { BsBox,BsCheck2Square,BsXCircle } from "react-icons/bs";
import { AiOutlineFileDone,AiOutlineDelete } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import { FaRunning } from "react-icons/fa";
import { GrRefresh } from "react-icons/gr";
import { BiMessageSquareEdit } from "react-icons/bi";
import { IoReload } from "react-icons/io5";
import {
  getAllBooking,
  updateStatusBookingSchedule,
} from "../../../services/bookingService";
import Loading from "../../../utils/Loading";

import { useTranslation } from "react-i18next";
import moment from "moment";
import { dateFormat,path } from "../../../utils/constant";

import "../DepartmentSystem/DepartmentManager.scss";

import { motion,AnimatePresence } from "framer-motion";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode,FilterOperator } from "primereact/api";
import { Ripple } from "primereact/ripple";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { Tooltip } from "primereact/tooltip";
import { useDispatch,useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logOutApi } from "../../../services/userService";
import { logOutUser } from "../../../redux/authSlice";
import { useNavigate } from "react-router";
import GetCancelReason from "./GetCancelReason";
import ConfirmAction from "./ConfirmAction";
import convertBufferToBase64 from "../../../utils/convertBufferToBase64";
import { emit_new_notification_update_booking_for_student } from "../../../utils/socket_client";
import { getAnswerById } from "../../../services/answerService";

const ActionItem = ({ action,managerId,roleManager,reviewNotify }) => {
  const [loading,setLoading] = useState(false);
  const [loadingFull,setLoadingFull] = useState(false);
  const [dataBookingFilter,setDataBookingFilter] = useState([]);
  const [dataBookingTotal,setDataBookingTotal] = useState([]);

  const [status,setStatus] = useState(
    reviewNotify
      ? reviewNotify === "check_event"
        ? "process"
        : "new"
      : "total"
  );

  const [detail,setDetail] = useState(false);
  const [dataBookingSelect,setDataBookingSelect] = useState([]);
  const [answer,setAnswer] = useState(false);
  const [dataAnswer,setDataAnswer] = useState("");
  const [isOpenModalConfirmAction,setIsOpenModalConfirmAction] =
    useState(false);
  const [dataConfirmAction,setDataConfirmAction] = useState([]);
  const [isOpenModelCancel,setIsOpenModelCancel] = useState(false);
  const [dataModalCancel,setDataModelCancel] = useState([]);
  const [answerDataForDoneQuestion,setAnswerDataForDoneQuestion] =
    useState("");
  console.log(dataBookingSelect);

  const { t,i18n } = useTranslation();
  const currentUser = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //dataTable
  const [filters1,setFilters1] = useState(null);
  const [globalFilterValue1,setGlobalFilterValue1] = useState("");
  const [selectedProducts8,setSelectedProducts8] = useState(null);
  // const [currentPage, setCurrentPage] = useState();
  const [first1,setFirst1] = useState(0);
  const [rows1,setRows1] = useState(8);
  const [currentPage,setCurrentPage] = useState(1);
  const [pageInputTooltip,setPageInputTooltip] = useState(
    i18n.language === "en"
      ? "Press 'Enter' key to go to this page."
      : "Sử dụng phím Enter để di chuyển trang."
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
  const onPageInputKeyDown = (event,options) => {
    if (event.key === "Enter") {
      const page = parseInt(currentPage);
      if (page < 1 || page > options.totalPages) {
        setPageInputTooltip(
          i18n.language === "en"
            ? `Value must be between 1 and ${options.totalPages}.`
            : `Giá trị phải nằm từ 1 đến ${options.totalPages}.`
        );
      } else {
        const first = currentPage ? options.rows * (page - 1) : 0;

        setFirst1(first);
        setPageInputTooltip(
          i18n.language === "en"
            ? "Press 'Enter' key to go to this page."
            : "Sử dụng phím Enter để di chuyển trang."
        );
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
          {i18n.language === "en"
            ? `Show ${options.first} - ${options.last} of ${options.totalRecords}`
            : `Hiển thị ${options.first} - ${options.last} của ${options.totalRecords}`}
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
          <span className="p-3">
            {i18n.language === "en" ? "Previous" : "Trước"}
          </span>
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
          <span className="p-3">{i18n.language === "en" ? "Next" : "Sau"}</span>
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
        const className = classNames(options.className,{ "p-disabled": true });

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
        { label: 8,value: 8 },
        { label: 12,value: 12 },
        {
          label: i18n.language === "en" ? "All" : "Tất cả",
          value: options.totalRecords,
        },
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
      global: { value: null,matchMode: FilterMatchMode.CONTAINS },
      statusId: {
        operator: FilterOperator.AND,
        constraints: [{ value: null,matchMode: FilterMatchMode.STARTS_WITH }],
      },
      "studentData.fullName": {
        operator: FilterOperator.AND,
        constraints: [{ value: null,matchMode: FilterMatchMode.STARTS_WITH }],
      },
      "studentData.email": {
        operator: FilterOperator.AND,
        constraints: [{ value: null,matchMode: FilterMatchMode.STARTS_WITH }],
      },
      date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null,matchMode: FilterMatchMode.STARTS_WITH }],
      },
      updatedAt: {
        operator: FilterOperator.AND,
        constraints: [{ value: null,matchMode: FilterMatchMode.STARTS_WITH }],
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
            label={i18n.language === "en" ? "Clear" : "Đặt lại"}
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
              label={i18n.language === "en" ? "Delete" : "Xoá"}
              className={`p-button-outlined ${selectedProducts8?.length >= 1 ? "" : "disabled"
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
            placeholder={`${action === "schedule"
              ? i18n.language === "en"
                ? "Search by name, email or status"
                : "Tìm kiếm theo tên, email, ngày hoặc trạng thái"
              : i18n.language === "en"
                ? "Search by name, email, time or status"
                : "Tìm kiếm theo tên, email, thời gian hoặc trạng thái"
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
            tooltip={i18n.language === "en" ? "See Detail" : "Chi tiết"}
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
              tooltip={
                i18n.language === "en"
                  ? "Confirm appointment completion"
                  : "Xác nhận lịch đã hoàn thành"
              }
              tooltipOptions={{ position: "top" }}
              style={{
                color: "green",
                backgroundColor: "transparent",
                padding: "2px",
                border: "none",
                borderRadius: "25px",
              }}
              onClick={() => {
                HandleDetailBooking(rowData);
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
                  tooltip={
                    i18n.language === "en"
                      ? "Accept this schedule"
                      : "Chấp nhận lịch hẹn"
                  }
                  tooltipOptions={{ position: "top" }}
                  style={{
                    color: "blue",
                    backgroundColor: "transparent",
                    padding: "2px",
                    border: "none",
                    borderRadius: "25px",
                  }}
                  onClick={() => {
                    HandleDetailBooking(rowData);
                  }}
                >
                  <BsCheck2Square className="text-xl " />
                </Button>
                <Button
                  tooltip={
                    i18n.language === "en"
                      ? "Cancel this schedule"
                      : "Huỷ bỏ lịch hẹn"
                  }
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
                    acceptOrCancelSchedule(rowData,"cancel");
                  }}
                >
                  <BsXCircle className="text-xl " />
                </Button>
              </>
            ) : (
              <Button
                tooltip={
                  i18n.language === "en"
                    ? "Answer this question"
                    : "Trả lời câu hỏi"
                }
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
                  onClick={() => HandleDetailBooking(rowData,"answer")}
                />
              </Button>
            ))}
          {/* {(status === "cancel" || status === "done") && (
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
          )} */}
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
      value = i18n.language === "en" ? "New" : "Mới";
    } else if (rowData.statusId === "S2") {
      value = i18n.language === "en" ? "In Process" : "Đang tiến hành";
    } else if (rowData.statusId === "S3") {
      value = i18n.language === "en" ? "Done" : "Hoàn thành";
    } else if (rowData.statusId === "S4") {
      value = i18n.language === "en" ? "Cancel" : "Bị huỷ";
    }
    return <span>{value}</span>;
  };

  useEffect(() => {
    let statusId = [];
    if (status === "total") {
      statusId = ["S1","S2","S3","S4"];
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
      statusId: ["S1","S2","S3","S4"],
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
    },0);
    initFilters1();
    setSelectedProducts8(null);
    setDetail(false);
    setAnswer(false);
    setDataBookingSelect([]);
    setAnswerDataForDoneQuestion("");
  },[action,status]);

  console.log(dataBookingFilter,action);

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

  const handleRefresh = (statusId) => {
    if (!statusId || status === "total") {
      const params = {
        managerId,
        roleManager,
        actionId: action === "schedule" ? "A1" : "A2",
        statusId: ["S1","S2","S3","S4"],
      };
      getAllBooking.getByManagerAndAction(params).then((res) => {
        if (res?.codeNumber === 0) {
          if (res?.allBooking?.length > 0) {
            console.log(res?.allBooking);
            res?.allBooking?.forEach((item) => {
              console.log(item);
              item.date = moment(item?.date).format(dateFormat.LABEL_SCHEDULE);
            });
          }
          setDataBookingFilter(res?.allBooking);
          setDataBookingTotal(res?.allBooking);
        }
      });
      setDetail(false);
      setAnswer(false);
      setDataBookingSelect([]);
      setSelectedProducts8(null);
      setDataConfirmAction([]);
      setAnswerDataForDoneQuestion("");
      setStatus("total");
    } else {
      setStatus(statusId);
    }
  };

  const HandleDetailBooking = (data,actionId) => {
    setDetail(true);
    setDataBookingSelect(data);
    setSelectedProducts8([data]);
    if (actionId === "answer") {
      setAnswer(true);
    } else {
      setAnswer(false);
    }
    setDataAnswer("");
    if (action === "question" && status === "done") {
      setLoading(true);
      getAnswerById({
        questionId: data?.id,
      }).then((res) => {
        if (res?.codeNumber === 0) {
          setAnswerDataForDoneQuestion(res?.answerData);
        }
        setLoading(false);
      });
    }
  };

  //handle question
  const handleAnswerQuestion = () => {
    setAnswer(true);
  };

  const openModalConfirmAction = (data,type) => {
    if (type === "answer" && !dataAnswer) {
      toast.error(t("system.notification.miss"),{
        autoClose: 3000,
        position: "bottom-right",
        theme: "colored",
      });
      return;
    } else {
      console.log(dataBookingSelect);
      console.log(dataAnswer);
      setIsOpenModalConfirmAction(true);
      setDataConfirmAction(dataBookingSelect);
    }
  };

  const closeModalConfirmAction = () => {
    setIsOpenModalConfirmAction(false);
    setDataConfirmAction([]);
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
    await updateStatusBookingSchedule.update({},body).then((res) => {
      if (res?.codeNumber === -1) {
        setLoadingFull(false);
        toast.error(`${t("system.notification.fail")}`,{
          autoClose: 2000,
          position: "bottom-right",
          theme: "colored",
        });
        setLoading(false);
      } else if (res?.codeNumber === -2) {
        setLoadingFull(false);

        toast.error(`${t("system.token.mess")}`,{
          autoClose: 5000,
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
        },5000);
      } else if (res?.codeNumber === 1) {
        setLoadingFull(false);

        toast.error(`${t("system.notification.fail")}`,{
          autoClose: 2000,
          position: "bottom-right",
          theme: "colored",
        });
      } else {
        const clearData = async () => {
          setDetail(false);
          setDataBookingSelect([]);
          setIsOpenModalConfirmAction(false);
          setDataModelCancel([]);
          setDataAnswer("");
          setSelectedProducts8(null);
          await handleRefresh("done");
          setLoadingFull(false);
          toast.success(
            i18n.language === "en"
              ? "Answer Question Successfully."
              : "Trả lời câu hỏi thành công.",
            {
              autoClose: 2000,
              position: "bottom-right",
              theme: "colored",
            }
          );
        };
        clearData();

        //socket notify to student
        emit_new_notification_update_booking_for_student({
          studentId: data?.studentData?.id,
          actionId: "A2",
          type: "done",
        });
      }
    });
  };

  //handle schedule
  const acceptOrCancelSchedule = async (data,type) => {
    // setSelectedProducts8([data]);
    if (type === "process" || type === "done") {
      if (type === "done") {
        const currentDate = moment(new Date()).format("DD/MM/YYYY");
        const dateSchedule = data.date.split("-")[1].trim();
        if (currentDate < dateSchedule) {
          toast.error(
            `${i18n.language === "en"
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
          const hourShedule = data?.timeDataBooking.valueVn
            .split("-")[1]
            .trim()
            .split(":")[0];
          if (currentHour < hourShedule) {
            toast.error(
              `${i18n.language === "en"
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
      let dateFormat = data.date.split("-")[1].trim().split("/");
      dateFormat = new Date(+dateFormat[2],+dateFormat[1] - 1,+dateFormat[0]);
      const body = {
        email: currentUser?.email,
        managerId: data?.managerId,
        roleManager: data?.roleManager,
        studentId: data?.studentData?.id,
        actionId: "A1",
        date: dateFormat,
        timeType: data?.timeType,
        time: data?.timeDataBooking?.valueVn,
        type,
      };
      console.log(body);
      await updateStatusBookingSchedule.update({},body).then((res) => {
        if (res?.codeNumber === -1) {
          setLoadingFull(false);

          toast.error(`${t("system.notification.fail")}`,{
            autoClose: 2000,
            position: "bottom-right",
            theme: "colored",
          });
        } else if (res?.codeNumber === -2) {
          setLoadingFull(false);

          toast.error(`${t("system.token.mess")}`,{
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
          },5000);
        } else if (res?.codeNumber === 1) {
          setLoadingFull(false);

          toast.error(`${t("system.notification.fail")}`,{
            autoClose: 2000,
            position: "bottom-right",
            theme: "colored",
          });
        } else {
          const clearData = async () => {
            setDetail(false);
            setDataBookingSelect([]);
            setIsOpenModalConfirmAction(false);
            if (type === "process") {
              await handleRefresh("process");
            } else {
              await handleRefresh("done");
            }
            setLoadingFull(false);
            toast.success(
              i18n.language === "en"
                ? type === "done"
                  ? "Confirm Completion Successfully."
                  : "Approve Schedule Successfully."
                : type === "done"
                  ? "Xác nhận hoàn thành thành công."
                  : "Chấp nhận lịch hẹn thành công.",
              {
                autoClose: 2000,
                position: "bottom-right",
                theme: "colored",
              }
            );
          };
          clearData();
          //socket notify to student
          emit_new_notification_update_booking_for_student({
            studentId: data?.studentData?.id,
            actionId: "A1",
            type,
          });
        }
      });
    } else if (type === "cancel") {
      setIsOpenModelCancel(true);
      setDataModelCancel(data);
    }
  };
  const closeModalCancel = () => {
    setIsOpenModelCancel(false);
    setDataModelCancel([]);
  };
  const confirmCancelSchedule = async (data,reason) => {
    if (!reason) {
      toast.error(t("system.notification.miss"),{
        autoClose: 3000,
        position: "bottom-right",
        theme: "colored",
      });
    } else {
      setLoadingFull(true);
      let dateFormat = data.date.split("-")[1].trim().split("/");
      dateFormat = new Date(+dateFormat[2],+dateFormat[1] - 1,+dateFormat[0]);
      const body = {
        email: currentUser?.email,
        managerId: data?.managerId,
        roleManager: data?.roleManager,
        studentId: data?.studentData?.id,
        actionId: "A1",
        date: dateFormat,
        timeType: data?.timeType,
        time: data?.timeDataBooking?.valueVn,
        type: "cancel",
        reasonCancel: reason,
      };
      await updateStatusBookingSchedule.update({},body).then((res) => {
        if (res?.codeNumber === -1) {
          setLoadingFull(false);
          toast.error(`${t("system.notification.fail")}`,{
            autoClose: 2000,
            position: "bottom-right",
            theme: "colored",
          });
          setLoading(false);
        } else if (res?.codeNumber === -2) {
          setLoadingFull(false);

          toast.error(`${t("system.token.mess")}`,{
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
          },5000);
        } else if (res?.codeNumber === 1) {
          setLoadingFull(false);

          toast.error(res?.message,{
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
            await handleRefresh("cancel");
            setLoadingFull(false);
            toast.success(
              i18n.language === "en"
                ? "Cancel Schedule Successfully."
                : "Huỷ lịch hẹn thành công.",
              {
                autoClose: 2000,
                position: "bottom-right",
                theme: "colored",
              }
            );
          };
          clearData();
          //socket notify to student
          emit_new_notification_update_booking_for_student({
            studentId: data?.studentData?.id,
            actionId: "A1",
            type: "cancel",
          });
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
                ${status === "total"
                ? "text-white bg-blue-800"
                : "text-gray-400 bg-white border border-gray-600"
              }`}
            onClick={() => setStatus("total")}
          >
            <BsBox />
            {`${action === "schedule"
              ? i18n.language === "en"
                ? "Total of schedule:"
                : "Tổng số lịch hẹn:"
              : i18n.language === "en"
                ? "Total of question"
                : "Tổng số câu hỏi:"
              }`}{" "}
            <span className="text">
              {dataBookingTotal?.length ? dataBookingTotal.length : 0}
            </span>
          </button>
          <button
            type="button"
            class={`hover:bg-blue-800 flex items-center justify-center gap-1 transition-all duration-500 flex-1 hover:text-white rounded-lg focus:ring-4 focus:ring-blue-300 font-medium  text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
               ${status === "new"
                ? "text-white bg-blue-800"
                : "text-gray-400 bg-white border border-gray-600"
              }`}
            onClick={() => setStatus("new")}
          >
            <FaRunning /> {i18n.language === "en" ? "New:" : "Mới:"}
            <span className="text">{countNew ? countNew : 0}</span>
          </button>
          {action === "schedule" && (
            <button
              type="button"
              class={`hover:bg-blue-800 flex items-center justify-center gap-1 transition-all duration-500 flex-1 hover:text-white rounded-lg focus:ring-4 focus:ring-blue-300 font-medium  text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
                  ${status === "process"
                  ? "text-white bg-blue-800"
                  : "text-gray-400 bg-white border border-gray-600"
                }`}
              onClick={() => setStatus("process")}
            >
              <FaRunning />{" "}
              {i18n.language === "en" ? "In Process:" : "Đang tiến hành:"}
              <span className="text">{countProcess ? countProcess : 0}</span>
            </button>
          )}
          <button
            type="button"
            class={`hover:bg-blue-800 flex items-center justify-center gap-1 transition-all duration-500 flex-1 hover:text-white rounded-lg focus:ring-4 focus:ring-blue-300 font-medium  text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
               ${status === "done"
                ? "text-white bg-blue-800"
                : "text-gray-400 bg-white border border-gray-600"
              }`}
            onClick={() => setStatus("done")}
          >
            <AiOutlineFileDone />
            {i18n.language === "en" ? "Completed:" : "Hoàn thành:"}
            <span className="text">{countDone ? countDone : 0}</span>
          </button>
          {action === "schedule" && (
            <button
              type="button"
              class={`hover:bg-blue-800 flex items-center justify-center gap-1 transition-all duration-500 flex-1 hover:text-white rounded-lg focus:ring-4 focus:ring-blue-300 font-medium  text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
                  ${status === "cancel"
                  ? "text-white bg-blue-800"
                  : "text-gray-400 bg-white border border-gray-600"
                }`}
              onClick={() => setStatus("cancel")}
            >
              <AiOutlineFileDone />

              {i18n.language === "en" ? "Canceled:" : "Bị huỷ:"}
              <span className="text">{countCancel ? countCancel : 0}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => handleRefresh()}
            class={`system-button-refresh hover:bg-blue-800 flex text-gray-400 bg-white border border-gray-600 items-center justify-center gap-1 transition-all duration-500 flex-1 hover:text-white rounded-lg focus:ring-4 focus:ring-blue-300 font-medium  text-md px-5 py-2.5 mr-2 mb-2 focus:outline-none
                `}
          >
            <IoReload className="system-button-refresh-icon rotating text-2xl text-gray-400 hover:text-white transition-all duration-500" />
            {i18n.language === "en" ? "Refresh" : "Cập nhật"}
          </button>
        </div>

        {loading ? (
          <div className="fixed loading-overlay top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25">
            <div className="absolute">
              <Loading />
            </div>
          </div>
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
                  rowsPerPageOptions={[4,8,12]}
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
                  // selectionMode={`${
                  //   status === "cancel" || status === "done"
                  //     ? "checkbox"
                  //     : "single"
                  // }`}
                  selectionMode="single"
                  selection={selectedProducts8}
                  onSelectionChange={(e) => setSelectedProducts8(e.value)}
                  resizableColumns
                  columnResizeMode="fit"
                  showGridlines
                // onAllRowsSelect={(e) => setAllRowSelected(e)}
                // onAllRowsUnselect={() => setAllRowSelected(false)}
                // dataKey="id"
                >
                  {/* {(status === "cancel" || status === "done") && (
                    <Column
                      selectionMode="multiple"
                      headerStyle={{ width: "3em" }}
                    ></Column>
                  )} */}
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
                    <Column header="Thời gian" body={timeTemplate}></Column>
                  )}
                  {action === "schedule" && (
                    <Column
                      header="Ngày, tháng, năm"
                      body={dateTemplate}
                    ></Column>
                  )}
                  {action === "schedule" && (
                    <Column
                      header="Thời gian"
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
                  initial={{ opacity: 0,translateX: -50 }}
                  animate={{ opacity: 1,translateX: 0 }}
                  exit={{ opacity: 0,translateX: -50 }}
                >
                  {action === "schedule" ? (
                    <div className="rounded-sm shadow-sm px-4 py-5 bg-gray-200 flex flex-col items-start justify-center gap-5">
                      <div className="flex items-center justify-start gap-5 w-full">
                        <div className="flex-1">
                          <label
                            htmlFor="helper-text"
                            class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                          >
                            {i18n.language === "en" ? "FullName" : "Tên đầy đủ"}
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
                            {i18n.language === "en" ? "Faculties" : "Khoa/Viện"}
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
                            {i18n.language === "en"
                              ? "Schedule Date"
                              : "Ngày hẹn"}
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
                            {i18n.language === "en"
                              ? "Schedule Time"
                              : "Thời gian hẹn"}
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
                            {i18n.language === "en"
                              ? "PhoneNumber"
                              : "Số điện thoại"}
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
                          {i18n.language === "en"
                            ? "Schedule Reason"
                            : "Lý do buổi hẹn"}
                        </label>
                        <textarea
                          type="text"
                          id="helper-text"
                          value={dataBookingSelect?.reason}
                          disabled
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                      {dataBookingSelect?.reasonCancelSchedule && (
                        <div className="w-full">
                          <label
                            htmlFor="helper-text"
                            class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                          >
                            {i18n.language === "en"
                              ? "Schedule Cancelation Reason"
                              : "Lý do huỷ buổi hẹn"}
                          </label>
                          <textarea
                            type="text"
                            id="helper-text"
                            value={dataBookingSelect?.reasonCancelSchedule}
                            disabled
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-start gap-6 py-4 w-full">
                        {status === "process" && (
                          <button
                            type="submit"
                            class={`border border-blue-600 hover:bg-blue-600 hover:text-white bg-white text-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2 mr-2 mb-2 focus:outline-none
                    `}
                            onClick={() =>
                              openModalConfirmAction(dataBookingSelect,"done")
                            }
                          >
                            {i18n.language === "en"
                              ? "Confirm completion"
                              : "Xác nhận hoàn thành"}
                          </button>
                        )}
                        {status === "new" && (
                          <>
                            <button
                              type="submit"
                              class={`border border-blue-600 hover:bg-blue-600 hover:text-white bg-white text-blue-600  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2 mr-2 mb-2 focus:outline-none
                    `}
                              onClick={() =>
                                openModalConfirmAction(
                                  dataBookingSelect,
                                  "process"
                                )
                              }
                            >
                              {i18n.language === "en" ? "Approve" : "Chấp nhận"}
                            </button>
                            <button
                              type="submit"
                              class={`border border-red-500 hover:bg-red-500 hover:text-white text-red-500 bg-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2 mr-2 mb-2 focus:outline-none
                    `}
                              onClick={() =>
                                acceptOrCancelSchedule(
                                  dataBookingSelect,
                                  "cancel"
                                )
                              }
                            >
                              {i18n.language === "en" ? "Cancel" : "Huỷ bỏ"}
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
                          {i18n.language === "en" ? "Close" : "Đóng"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-sm shadow-sm px-4 py-5 bg-gray-200 flex flex-col items-start justify-center gap-5">
                      {console.log(dataBookingSelect)}
                      <div className="flex items-center justify-start gap-5 w-full">
                        <div className="flex-1">
                          <label
                            htmlFor="helper-text"
                            class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                          >
                            {i18n.language === "en" ? "FullName" : "Tên đầy đủ"}
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
                            {i18n.language === "en" ? "Faculties" : "Khoa/Viện"}
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
                            {i18n.language === "en"
                              ? "Question Making Time"
                              : "Thời gian đặt câu hỏi"}
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
                      <div className="flex items-start justify-start gap-5 w-full">
                        <div className="flex-1">
                          <label
                            htmlFor="helper-text"
                            class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                          >
                            {i18n.language === "en"
                              ? "Question Subject"
                              : "Chủ đề câu hỏi"}
                          </label>
                          <input
                            type="text"
                            id="helper-text"
                            value={dataBookingSelect?.subject}
                            disabled
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          />
                        </div>
                        {/* {selectedProducts8?.image?.data?.length > 0 && (
                          <div className="flex-1">
                            <label
                              htmlFor="helper-text"
                              class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                            >
                              {i18n.language === "en"
                                ? "Image"
                                : "Ảnh kèm theo câu hỏi"}
                            </label>
                            <div className="w-full h-48 flex-1 relative">
                              <div
                                style={{
                                  backgroundImage: `url(${convertBufferToBase64(
                                    dataBookingSelect.image.data
                                  )})`,
                                  backgroundRepeat: "no-repeat",
                                  backgroundSize: "contain",
                                  height: "100%",
                                  width: "50%",
                                  cursor: "pointer",
                                }}
                              ></div>
                            </div>
                          </div>
                        )} */}
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="helper-text"
                          class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                        >
                          {i18n.language === "en" ? "Question" : " Nội dung"}
                        </label>
                        <textarea
                          type="text"
                          id="helper-text"
                          value={dataBookingSelect?.question}
                          disabled
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                      </div>
                      {answerDataForDoneQuestion ? (
                        <div className="w-full">
                          <label
                            htmlFor="helper-text"
                            class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                          >
                            {i18n.language === "en"
                              ? "Answer for question"
                              : "Câu trả lời cho câu hỏi trên"}
                          </label>
                          <textarea
                            type="text"
                            id="helper-text"
                            value={answerDataForDoneQuestion?.answer}
                            disabled
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      {answer && (
                        <div className="w-full">
                          <label
                            htmlFor="helper-text"
                            class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                          >
                            {i18n.language === "en"
                              ? "Answer Question"
                              : " Trả lời câu hỏi"}
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
                                : () =>
                                  openModalConfirmAction(
                                    dataBookingSelect,
                                    "answer"
                                  )
                            }
                          >
                            {answer
                              ? i18n.language === "en"
                                ? "Confirm Answer"
                                : "Xác nhận trả lời"
                              : i18n.language === "en"
                                ? "Answer"
                                : "Trả lời"}
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
                            setAnswerDataForDoneQuestion("");
                          }}
                        >
                          {i18n.language === "en" ? "Close" : "Đóng"}
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

      {(isOpenModelCancel || isOpenModalConfirmAction) && (
        <div className="fixed z-50 top-0 bottom-0 left-0 right-0 w-full max-h-full bg-black bg-opacity-25"></div>
      )}
      {isOpenModelCancel && (
        <GetCancelReason
          dataModalCancel={dataModalCancel}
          isClose={closeModalCancel}
          confirmCancel={confirmCancelSchedule}
        />
      )}

      {isOpenModalConfirmAction && (
        <ConfirmAction
          data={dataConfirmAction}
          isClose={closeModalConfirmAction}
          confirm={
            dataConfirmAction?.actionId === "A2"
              ? confirmAnswerQuestion
              : acceptOrCancelSchedule
          }
        />
      )}

      {loadingFull && (
        <div className="fixed loading-overlay top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25">
          <div className="absolute">
            <Loading />
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionItem;
