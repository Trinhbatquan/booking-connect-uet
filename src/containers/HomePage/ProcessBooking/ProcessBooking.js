import React,{ useState,useEffect,useRef } from "react";
import moment from "moment";
import { toast,ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import HomeHeader from "../HomeHeader";
import Loading from "../../../utils/Loading";
import HomeFooter from "../HomeFooter";

import { IoReload } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { RiSearchEyeLine } from "react-icons/ri";
import { MdContentPasteGo } from "react-icons/md";

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
import { logOutApi,logOutHomePageApi } from "../../../services/userService";
import { useLocation,useNavigate } from "react-router";
import "moment/locale/vi";
import { motion,AnimatePresence } from "framer-motion";

import convertBufferToBase64 from "./../../../utils/convertBufferToBase64";
import {
  emit_create_booking,
  emit_new_notification_update_booking_for_student,
} from "../../../utils/socket_client";
import {
  dateFormat,
  positionCustom,
  statusCustom,
} from "../../../utils/constant";
import {
  createQuestionService,
  getAllBookingStudentByIdAndAction,
} from "../../../services/bookingService";

import "./ProcessBooking.scss";
import { getAnswerById } from "../../../services/answerService";
import ConfirmSentDirectly from "./ConfirmSentDirectly";
import { handleMessageFromBackend } from "../../../utils/handleMessageFromBackend";
import { path } from "../../../utils/constant";
import nodata from "../../../assets/image/nodata.png";
import { logOutUser } from "../../../redux/studentSlice";

const ProcessBooking = () => {
  const actionParam = useLocation()?.search?.split("?")[1];

  const { i18n,t } = useTranslation();
  const [loading,setLoading] = useState(false);
  const [action,setAction] = useState(actionParam || "A1");
  const currentUser = useSelector((state) => state.studentReducer);
  const [dataBooking,setDataBooking] = useState([]);
  const [isOpenDetailBooking,setIsOpenDetailBooking] = useState(false);
  const [answerData,setAnswerData] = useState([]);
  const [isConfirmSentDirectly,setIsConfirmSentDirectly] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const customDataBookingStudent = (res) => {
    res.forEach((item) => {
      if (item?.roleManager === "R5") {
        item.nameCustom = `${positionCustom(
          item?.teacherData?.positionId,
          i18n.language
        )}, ${item?.teacherData?.fullName}`;
        item.emailCustom = item?.teacherData?.email;
        item.statusCustom = `${statusCustom(
          item?.statusId,
          i18n.language,
          action
        )}`;
        item.phoneNumberCustom = item?.teacherData?.phoneNumber;
        item.addressCustom = item?.teacherData?.address;
        console.log(i18n.language);
        item.dateCustom =
          i18n.language === "en"
            ? moment(item?.date).locale("en").format(dateFormat.LABEL_SCHEDULE)
            : moment(item?.date).format(dateFormat.LABEL_SCHEDULE);
        item.dateMakeQuestion =
          i18n.language === "en"
            ? moment(item?.createdAt).locale("en").format("LLLL")
            : moment(item?.createdAt).format("LLLL");
      } else {
        item.nameCustom = `${item?.otherUserData?.fullName}`;
        item.emailCustom = item?.otherUserData?.email;
        item.statusCustom = `${statusCustom(
          item?.statusId,
          i18n.language,
          action
        )}`;
        item.phoneNumberCustom = item?.otherUserData?.phoneNumber;
        item.addressCustom = item?.otherUserData?.address;
        item.dateCustom =
          i18n.language === "en"
            ? moment(item?.date).locale("en").format(dateFormat.LABEL_SCHEDULE)
            : moment(item?.date).format(dateFormat.LABEL_SCHEDULE);
        item.dateMakeQuestion =
          i18n.language === "en"
            ? moment(item?.createdAt).locale("en").format("LLLL")
            : moment(item?.createdAt).format("LLLL");
      }
    });
    return res;
  };

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("auth-bookingCare-UET_student"))) {
      setLoading(true);
      getAllBookingStudentByIdAndAction
        .get({
          studentId: currentUser?.id,
          actionId: action,
        })
        .then((data) => {
          if (data?.codeNumber === 0) {
            console.log(data?.studentBooking);
            if (data?.studentBooking?.length > 0) {
              let dataBookingCustom = data.studentBooking;
              if (dataBookingCustom?.length > 0) {
                console.log(1);
                dataBookingCustom = customDataBookingStudent(dataBookingCustom);
                setDataBooking(dataBookingCustom);
              }
            } else {
              console.log(2);
              setDataBooking([]);
            }
            setLoading(false);
          } else {
            setLoading(false);
            toast.error(
              i18n.language === "en" ? data?.message_en : data?.message_vn,
              {
                autoClose: 3000,
                theme: "colored",
                position: "bottom-right",
              }
            );
          }
        });
      initFilters1();
      setAnswerData([]);
      setIsOpenDetailBooking(false);
      setSelectedProducts8([]);
    }
  },[action,i18n.language]);

  const handleRefresh = () => {
    setLoading(true);
    getAllBookingStudentByIdAndAction
      .get({
        studentId: currentUser?.id,
        actionId: action,
      })
      .then((data) => {
        if (data?.codeNumber === 0) {
          console.log(data?.studentBooking);
          if (data?.studentBooking?.length > 0) {
            let dataBookingCustom = data.studentBooking;
            if (dataBookingCustom?.length > 0) {
              dataBookingCustom = customDataBookingStudent(dataBookingCustom);
            }
            setDataBooking(dataBookingCustom);
          } else {
            setDataBooking([]);
          }
          setLoading(false);
        } else {
          setLoading(false);
          toast.error(
            i18n.language === "en" ? data?.message_en : data?.message_vn,
            {
              autoClose: 3000,
              theme: "colored",
              position: "bottom-right",
            }
          );
        }
      });
    initFilters1();
    setIsOpenDetailBooking(false);
    setSelectedProducts8(null);
    if (action === "A2") {
      setAnswerData([]);
    }
  };

  const handleOpenDetailBooking = (rowData) => {
    if (action === "A1") {
      setSelectedProducts8([rowData]);
      setIsOpenDetailBooking(true);
    } else {
      if (rowData?.statusId === "S1") {
        setIsOpenDetailBooking(true);
        setSelectedProducts8([rowData]);
      } else {
        setLoading(true);
        getAnswerById({
          questionId:
            rowData?.statusId === "S3"
              ? rowData?.id
              : rowData?.questionSimilarityId,
        }).then((data) => {
          if (data?.codeNumber === 0) {
            setAnswerData(data?.answerData);
            setLoading(false);
            setIsOpenDetailBooking(true);
            setSelectedProducts8([rowData]);
          } else {
            setLoading(false);
            toast.error(
              i18n.language === "en" ? data?.message_en : data?.message_vn,
              {
                autoClose: 3000,
                theme: "colored",
                position: "bottom-right",
              }
            );
          }
        });
      }
    }
  };

  const handleCloseDetailBooking = () => {
    setIsOpenDetailBooking(false);
    setSelectedProducts8(null);
    if (action === "A2") {
      setAnswerData([]);
    }
  };

  //send directly
  const handleOpenConfirmSentDirectly = (rowData) => {
    setSelectedProducts8([rowData]);
    setIsConfirmSentDirectly(true);
  };

  const closeConfirm = () => {
    setIsConfirmSentDirectly(false);
  };

  const sentDirectly = async () => {
    const data = selectedProducts8[0];
    const body = {
      email: currentUser?.email,
      studentId: currentUser?.id,
      managerId: +data?.managerId,
      roleManager: data?.roleManager,
      action: "A2",
      subject: data?.subject,
      question: data?.question,
      avatar:
        data?.image?.data?.length > 0
          ? convertBufferToBase64(data.image.data)
          : "",
      option: "directly",
    };
    setLoading(true);
    await createQuestionService.create({},body).then(async (res) => {
      if (res?.codeNumber === 0) {
        // setLoading(false);
        if (res?.type === "create" || res?.type === "sent") {
          setIsConfirmSentDirectly(false);
          setSelectedProducts8([]);
          await handleRefresh();
          toast.success(
            i18n.language === "en" ? res?.message_en : res?.message_vn,
            {
              autoClose: 6000,
              position: "bottom-right",
              theme: "colored",
            }
          );
          // emitter.emit("EVENT_CLEAR_DATA");
          if (res?.type === "create") {
            //socket_emit_booking_create
            emit_create_booking(+data?.managerId,data?.roleManager,"A2");
          }
        } else {
          setLoading(false);
          setIsConfirmSentDirectly(false);
          setSelectedProducts8([]);
          toast.info(
            i18n.language === "en" ? res?.message_en : res?.message_vn,
            {
              autoClose: 6000,
              position: "bottom-right",
              theme: "colored",
            }
          );
          //emitter clear data component child
        }
      } else {
        setLoading(false);
        const response = handleMessageFromBackend(data,i18n.language);
        toast.error(response,{
          autoClose: 3000,
          theme: "colored",
          position: "bottom-right",
        });
        if (data?.codeNumber === -2) {
          setTimeout(() => {
            logOutHomePageApi.logoutUser({}).then((data) => {
              if (data?.codeNumber === 0) {
                dispatch(logOutUser());
                navigate(
                  `${path.HOMEPAGE}/${path.login_homepage}?redirect=/homepage`
                );
              }
            });
          },5000);
        }
      }
    });
  };

  //dataTable
  const [filters1,setFilters1] = useState(null);
  const [globalFilterValue1,setGlobalFilterValue1] = useState("");
  // const [filters1, setFilters1] = useState(null);
  // const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [selectedProducts8,setSelectedProducts8] = useState([]);
  const [allRowSelected,setAllRowSelected] = useState(false);
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
  // const paginatorLeft = (
  //   <ButtonPrimeReact
  //     type="button"
  //     icon="pi pi-refresh"
  //     className="p-button-text"
  //   />
  // );
  // const paginatorRight = (
  //   <ButtonPrimeReact
  //     type="button"
  //     icon="pi pi-cloud"
  //     className="p-button-text"
  //   />
  // );
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
      "PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport",
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
        { label: "All",value: options.totalRecords },
      ];

      return (
        <Dropdown
          value={options.value}
          options={dropdownOptions}
          onChange={options.onChange}
        />
      );
    },
    // CurrentPageReport: (options) => {
    //   return (
    //     <span
    //       className="mx-3"
    //       style={{ color: "var(--text-color)", userSelect: "none" }}
    //     >
    //       Go to{" "}
    //       <InputText
    //         size="2"
    //         className="ml-1"
    //         value={currentPage}
    //         tooltip={pageInputTooltip}
    //         onKeyDown={(e) => onPageInputKeyDown(e, options)}
    //         onChange={onPageInputChange}
    //       />
    //     </span>
    //   );
    // },
  };

  // filter
  const initFilters1 = () => {
    setFilters1({
      global: { value: null,matchMode: FilterMatchMode.CONTAINS },
      nameCustom: {
        operator: FilterOperator.AND,
        constraints: [{ value: null,matchMode: FilterMatchMode.STARTS_WITH }],
      },
      statusCustom: {
        operator: FilterOperator.AND,
        constraints: [{ value: null,matchMode: FilterMatchMode.STARTS_WITH }],
      },
      subject: {
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
          {/* {selectedProducts8?.length > 1 && (
            <Button
              type="button"
              // icon="pi pi-filter-slash"
              label="Delete"
              className={`p-button-outlined ${
                selectedProducts8?.length >= 1 ? "" : "disabled"
              }`}
              // onClick={() => handleDeleteManyData()}
            />
          )} */}
        </div>
        <span className="p-input-icon-left" style={{ width: "350px" }}>
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder={`${action === "A1"
              ? i18n.language === "en"
                ? "Search for name, status"
                : "Tìm kiếm theo tên, trạng thái"
              : i18n.language === "en"
                ? "Search for name, subject, status"
                : "Tìm kiếm theo tên, chủ đề, trạng thái"
              }`}
            style={{ width: "100%" }}
          />
        </span>
      </div>
    );
  };
  const header1 = renderHeader1();
  const actionTemplate = (rowData) => {
    // console.log(rowData);
    // console.log(selectedProducts8);
    return (
      <div className="flex items-center justify-center gap-6">
        {rowData?.statusId !== "S5" ? (
          <Button
            tooltip={i18n.language === "en" ? "See detail" : "Chi tiết"}
            tooltipOptions={{ position: "top" }}
            style={{
              color: "#812222",
              backgroundColor: "transparent",
              padding: "2px",
              border: "none",
              borderRadius: "25px",
            }}
          >
            <RiSearchEyeLine
              className="text-xl"
              onClick={() => handleOpenDetailBooking(rowData)}
            />
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-6">
            <Button
              tooltip={i18n.language === "en" ? "See detail" : "Chi tiết"}
              tooltipOptions={{ position: "top" }}
              style={{
                color: "#812222",
                backgroundColor: "transparent",
                padding: "2px",
                border: "none",
                borderRadius: "25px",
              }}
            >
              <RiSearchEyeLine
                className="text-xl"
                onClick={() => handleOpenDetailBooking(rowData)}
              />
            </Button>
            <Button
              tooltip={
                i18n.language === "en"
                  ? "Click if you want to be answered directly"
                  : "Nhấn vào nếu bạn muốn nhận câu trả lời trực tiếp"
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
                handleOpenConfirmSentDirectly(rowData);
              }}
            >
              <MdContentPasteGo
                className="text-xl"
                onClick={() => setSelectedProducts8([rowData])}
              />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {console.log(dataBooking)}
      <ToastContainer />
      {loading && (
        <div className="fixed loading-overlay top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25">
          <div className="absolute">
            <Loading />
          </div>
        </div>
      )}

      <div
        className="relative mt-[34px] pt-[20px] mb-[20px] mx-[10%] pr-[30px] pl-[65px]"
        style={{
          border: "1px solid rgb(242, 242, 242)",
          minHeight: "300px",
        }}
      >
        <div className="mb-[30px] relative">
          <h2 className="text-blurThemeColor font-semibold">
            {i18n.language === "en"
              ? "Management Booking"
              : "Quản lý tiến trình"}
          </h2>
          <div
            style={{
              position: "absolute",
              top: "4px",
              bottom: "4px",
              width: "11px",
              left: "-31px",
              backgroundColor: "rgb(246, 133, 0)",
            }}
          ></div>
        </div>
        <div className="pb-[30px] mx-auto flex flex-col items-start justify-start gap-5">
          <div
            className="px-5 h-[60px] w-full rounded-lg flex items-center justify-between"
            style={{
              border: "1px solid rgb(242, 242, 242)",
            }}
          >
            <div className="flex items-center justify-start gap-8">
              <button
                class={`px-5 py-1.5 flex transition-all ease-in duration-150 items-center justify-center overflow-hidden text-md font-semibold border border-blue-500 rounded-2xl hover:text-white hover:bg-blue-500 hover:opacity-100 ${action === "A1"
                  ? "text-white bg-blue-500"
                  : "text-blue-500 bg-white opacity-50"
                  }`}
                onClick={() => setAction("A1")}
              >
                <span class="">
                  {i18n.language === "en" ? "About Appointment" : "Về lịch hẹn"}
                </span>
              </button>
              <button
                class={`px-5 py-1.5 flex transition-all ease-in duration-150 items-center justify-center overflow-hidden text-md font-semibold border border-blue-500 rounded-2xl hover:text-white hover:bg-blue-500 hover:opacity-100 ${action === "A2"
                  ? "text-white bg-blue-500"
                  : "text-blue-500 bg-white opacity-50"
                  }`}
                onClick={() => setAction("A2")}
              >
                <span class="">
                  {i18n.language === "en" ? "About Question" : "Về câu hỏi"}
                </span>
              </button>
            </div>
            {dataBooking?.length > 0 && (
              <button
                class={`process-booking-refresh px-5 py-1.5 flex  items-center justify-center gap-2 overflow-hidden text-sm bg-gray-200 text-headingColor hover:text-white hover:bg-blue-500 transition-all duration-200 rounded-2xl
                 `}
                onClick={() => handleRefresh()}
              >
                <IoReload className="rotating text-2xl text-headingColor hover:text-white transition-all duration-200" />
                <span class="">
                  {i18n.language === "en" ? "Refresh" : "Cập nhật"}
                </span>
              </button>
            )}
          </div>
          {dataBooking?.length > 0 ? (
            <div className="w-full mt-8">
              <DataTable
                value={dataBooking}
                paginator
                responsiveLayout="scroll"
                paginatorTemplate={template1}
                first={first1}
                rows={rows1}
                onPage={onCustomPage1}
                rowsPerPageOptions={[4,8,12]}
                filters={filters1}
                filterDisplay="menu"
                globalFilterFields={["nameCustom","statusCustom","subject"]}
                header={header1}
                emptyMessage="No customers found."
                // selectionMode={`${
                //   status === "cancel" || status === "done"
                //     ? "checkbox"
                //     : "single"
                // }`}
                selectionMode="single" /*  color blur when click into a record */
                selection={selectedProducts8}
                // onSelectionChange={(e) => setSelectedProducts8(e.value)}
                resizableColumns
                columnResizeMode="fit"
                showGridlines
              >
                <Column
                  header={
                    i18n.language === "en"
                      ? "Teacher/Institution"
                      : "Giảng viên/Đơn vị"
                  }
                  field="nameCustom"
                ></Column>
                {action === "A1" && (
                  <Column
                    header={
                      i18n.language === "en" ? "Appointment Date" : "Ngày hẹn"
                    }
                    field="dateCustom"
                  ></Column>
                )}
                {action === "A1" && (
                  <Column
                    header={
                      i18n.language === "en"
                        ? "Appointment Time"
                        : "Thời gian hẹn"
                    }
                    field={
                      i18n.language === "en"
                        ? "timeDataBooking.valueEn"
                        : "timeDataBooking.valueVn"
                    }
                  ></Column>
                )}
                {action === "A1" && (
                  <Column
                    header={i18n.language === "en" ? "Address" : "Địa chỉ"}
                    field="addressCustom"
                  ></Column>
                )}
                {action === "A2" && (
                  <Column
                    header={
                      i18n.language === "en"
                        ? "Question Subject"
                        : "Chủ đề câu hỏi"
                    }
                    field="subject"
                  ></Column>
                )}
                {action === "A2" && (
                  <Column
                    header={
                      i18n.language === "en"
                        ? "Question Making Time"
                        : "Thời gian đặt câu hỏi"
                    }
                    field="dateMakeQuestion"
                  ></Column>
                )}
                <Column
                  header={i18n.language === "en" ? "Status" : "Trạng thái"}
                  field="statusCustom"
                ></Column>
                <Column
                  body={actionTemplate}
                  header={t("system.table.action")}
                ></Column>
              </DataTable>

              <AnimatePresence>
                {isOpenDetailBooking && (
                  <motion.div
                    className="mt-5 w-full mx-auto"
                    initial={{ opacity: 0,translateX: -50 }}
                    animate={{ opacity: 1,translateX: 0 }}
                    exit={{ opacity: 0,translateX: -50 }}
                  >
                    {action === "A1" ? (
                      <div className="rounded-sm shadow-sm px-4 py-5 bg-gray-200 flex flex-col items-start justify-center gap-5">
                        <div className="flex items-center justify-start gap-5 w-full">
                          <div className="flex-1">
                            <label
                              htmlFor="helper-text"
                              class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                            >
                              {i18n.language === "en"
                                ? "Teacher/Institution"
                                : "Giảng viên/Đơn vị"}
                            </label>
                            <input
                              type="text"
                              id="helper-text"
                              disabled
                              value={selectedProducts8[0]?.nameCustom}
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
                              value={selectedProducts8[0]?.emailCustom}
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
                                ? "PhoneNumber"
                                : "Số điện thoại"}
                            </label>
                            <input
                              type="text"
                              id="helper-text"
                              disabled
                              value={selectedProducts8[0]?.phoneNumberCustom}
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                          </div>
                          <div className="flex-1">
                            <label
                              htmlFor="helper-text"
                              class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                            >
                              {i18n.language === "en" ? "Address" : "Địa chỉ"}
                            </label>
                            <input
                              type="text"
                              id="helper-text"
                              disabled
                              value={selectedProducts8[0]?.addressCustom}
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
                            value={selectedProducts8[0]?.reason}
                            disabled
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          />
                        </div>
                        <div className="flex items-center justify-start gap-5 w-full">
                          <div className="flex-1">
                            <label
                              htmlFor="helper-text"
                              class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                            >
                              {i18n.language === "en"
                                ? "Appointment Date"
                                : "Ngày hẹn"}
                            </label>
                            <input
                              type="text"
                              id="helper-text"
                              disabled
                              value={selectedProducts8[0]?.dateCustom}
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                          </div>
                          <div className="flex-1">
                            <label
                              htmlFor="helper-text"
                              class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                            >
                              {i18n.language === "en"
                                ? "Appointment Time"
                                : "Thời gian hẹn"}
                            </label>
                            <input
                              type="text"
                              id="helper-text"
                              disabled
                              value={
                                i18n.language === "en"
                                  ? selectedProducts8[0]?.timeDataBooking
                                    ?.valueEn
                                  : selectedProducts8[0]?.timeDataBooking
                                    ?.valueVn
                              }
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
                                ? "Appointment Making Time"
                                : "Thời gian đặt lịch"}
                            </label>
                            <input
                              type="text"
                              id="helper-text"
                              disabled
                              value={selectedProducts8[0]?.dateMakeQuestion}
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                          </div>
                          <div className="flex-1">
                            <label
                              htmlFor="helper-text"
                              class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                            >
                              {i18n.language === "en" ? "Status" : "Trạng thái"}
                            </label>
                            <input
                              type="text"
                              id="helper-text"
                              value={selectedProducts8[0]?.statusCustom}
                              disabled
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                          </div>
                        </div>
                        {selectedProducts8[0]?.reasonCancelSchedule && (
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
                              value={selectedProducts8[0].reasonCancelSchedule}
                              disabled
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-start gap-6 py-4 w-full">
                          <button
                            type="text"
                            class={`border border-blue-500 hover:bg-blue-600 bg-blue-500 text-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-8 py-1 mr-2 mb-2 focus:outline-none
                    `}
                            onClick={() => {
                              handleCloseDetailBooking();
                            }}
                          >
                            {i18n.language === "en" ? "Close" : "Đóng lại"}
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
                              {i18n.language === "en"
                                ? "Teacher/Institution"
                                : "Giảng viên/Đơn vị"}
                            </label>
                            <input
                              type="text"
                              id="helper-text"
                              disabled
                              value={selectedProducts8[0]?.nameCustom}
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
                              value={selectedProducts8[0]?.emailCustom}
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
                                ? "PhoneNumber"
                                : "Số điện thoại"}
                            </label>
                            <input
                              type="text"
                              id="helper-text"
                              disabled
                              value={selectedProducts8[0]?.phoneNumberCustom}
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                          </div>
                          <div className="flex-1">
                            <label
                              htmlFor="helper-text"
                              class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                            >
                              {i18n.language === "en" ? "Address" : "Địa chỉ"}
                            </label>
                            <input
                              type="text"
                              id="helper-text"
                              disabled
                              value={selectedProducts8[0]?.addressCustom}
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
                                ? "Question Subject"
                                : "Chủ đề câu hỏi"}
                            </label>
                            <input
                              type="text"
                              id="helper-text"
                              disabled
                              value={selectedProducts8[0]?.subject}
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
                              value={selectedProducts8[0]?.dateMakeQuestion}
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
                              ? "Question Detail"
                              : "Nội dung câu hỏi"}
                          </label>
                          <textarea
                            id="helper-text"
                            row="1"
                            disabled
                            value={selectedProducts8[0]?.question}
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          />
                        </div>
                        <div className="flex items-start justify-start gap-5 w-full">
                          <div className="flex-1">
                            <label
                              htmlFor="helper-text"
                              class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                            >
                              {i18n.language === "en" ? "Status" : "Trạng thái"}
                            </label>
                            <input
                              type="text"
                              id="helper-text"
                              value={selectedProducts8[0]?.statusCustom}
                              disabled
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                          </div>
                          {selectedProducts8[0]?.image?.data?.length > 0 && (
                            <div className="w-[50%]">
                              <label
                                htmlFor="helper-text"
                                class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                              >
                                {i18n.language === "en"
                                  ? "Question Image"
                                  : "Hình ảnh cho câu hỏi"}
                              </label>
                              <div className="w-full h-[110px] flex-1 relative">
                                <div
                                  style={{
                                    backgroundImage: `url(${convertBufferToBase64(
                                      selectedProducts8[0].image.data
                                    )})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "contain",
                                    height: "100%",
                                    width: "30%",
                                    cursor: "pointer",
                                    borderRadius: "5px",
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                        {(selectedProducts8[0]?.statusId === "S3" ||
                          selectedProducts8[0]?.statusId === "S5") && (
                            <div className="w-full">
                              <label
                                htmlFor="helper-text"
                                class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                              >
                                {i18n.language === "en"
                                  ? "Answer"
                                  : "Câu trả lời"}
                              </label>
                              <textarea
                                id="helper-text"
                                row="1"
                                value={answerData?.answer}
                                disabled
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                              />
                            </div>
                          )}

                        <div className="flex items-center justify-start gap-6 py-4 w-full">
                          {selectedProducts8[0]?.statusId === "S5" && (
                            <button
                              type="text"
                              class={`border border-orange-400 hover:bg-orange-500 bg-orange-400 text-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-8 py-1 mr-2 mb-2 focus:outline-none
                    `}
                              onClick={() => {
                                handleOpenConfirmSentDirectly(
                                  selectedProducts8[0]
                                );
                              }}
                            >
                              {i18n.language === "en"
                                ? "Send Directly"
                                : "Gửi trực tiếp"}
                            </button>
                          )}
                          <button
                            type="text"
                            class={`border border-blue-500 hover:bg-blue-600 bg-blue-500 text-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-8 py-1 mr-2 mb-2 focus:outline-none
                    `}
                            onClick={() => {
                              handleCloseDetailBooking();
                            }}
                          >
                            {i18n.language === "en" ? "Close" : "Đóng lại"}
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <img
              src={nodata}
              alt=""
              style={{
                height: "300px",
                width: "70%",
                objectFit: "cover",
                margin: "0 auto",
              }}
            />
          )}
        </div>
      </div>
      <HomeFooter />

      {isConfirmSentDirectly && (
        <div className="fixed modal-confirm-schedule-overplay top-0 bottom-0 flex items-center justify-center mx-auto left-0 right-0 w-full max-h-full bg-black bg-opacity-25"></div>
      )}
      {isConfirmSentDirectly && (
        <ConfirmSentDirectly
          closeConfirm={closeConfirm}
          confirmSentDirectly={sentDirectly}
        />
      )}
    </div>
  );
};

export default ProcessBooking;
