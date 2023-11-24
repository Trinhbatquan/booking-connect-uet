import React, { useState, useEffect, Fragment } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import moment from "moment";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

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
import DeleteModal from "../Modal/DeleteModal";
import { logOutUser } from "../../../redux/authSlice";
import { getTeacherHomePageAPI } from "../../../services/teacherService";
import ActionItem from "./ActionItem";

const ScheduleManager = () => {
  const [selectedOptionObject, setSelectedOptionObject] = useState({});
  const [selectedOption, setSelectedOption] = useState({});
  const [startDate, setStartDate] = useState(
    new Date().setDate(new Date().getDate() + 1)
  );

  const [userData, setUserData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [timeUserSelected, setTimeUserSelected] = useState([]);
  const [optionSelected, setOptionSelected] = useState();

  const [isUpdate, setIsUpdate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [dataScheduleDelete, setDataScheduleDelete] = useState([]);
  const [loading, setLoading] = useState(false);

  const [action, setAction] = useState("");

  const { t, i18n } = useTranslation();

  console.log(action);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // async function fetchData() {
    //   await getAllCodeApi.getByType({ type: "TIME" }).then((data) => {
    //     if (data?.codeNumber === 0) {
    //       let { allCode } = data;
    //       if (allCode.length > 0) {
    //         allCode = allCode.map((time, index) => ({
    //           ...time,
    //           isSelected: false,
    //         }));
    //       }
    //       setTimeData(allCode);
    //     }
    //   });
    // }
    // fetchData();
  }, []);

  //option-general select
  let option_general = [
    {
      value: "R2",
      label: `${t("system.schedule.department")}`,
    },
    { value: "R4", label: `${t("system.schedule.faculty")}` },
    { value: "R5", label: `${t("system.schedule.teacher")}` },
    { value: "R6", label: `${t("system.schedule.health")}` },
  ];

  //option-detail select
  let options_detail = [];
  if (userData.length > 0) {
    userData.forEach((user, index) => {
      options_detail.push({ value: user?.id, label: user?.fullName });
    });
  }

  //handle change select
  const handleChangeSelect_general = async (e) => {
    setLoading(true);
    if (e?.value === "R5") {
      await getTeacherHomePageAPI.getTeacher({}).then((data) => {
        if (data?.codeNumber === 0) {
          setUserData(data.teacher);
        }
      });
    } else {
      await getUserApi.getUserByRole({ role: e?.value }).then((data) => {
        if (data?.codeNumber === 0) {
          setUserData(data?.user);
        }
      });
    }
    option_general.forEach((item, index) => {
      if (item?.value === e?.value) {
        setOptionSelected(index);
      }
    });
    setSelectedOption({});
    // setTimeUserSelected([]);
    // setStartDate(new Date().setDate(new Date().getDate() + 1));
    // timeData.forEach((time) => {
    //   time.isSelected = false;
    // });
    // setTimeData(timeData);
    setSelectedOptionObject(e);
    setAction("");
    // setIsUpdate(false);
    setLoading(false);
  };

  const handleChangeSelect_detail = async (e) => {
    console.log(selectedOptionObject);
    // await getScheduleSystem
    //   .get({ managerId: e?.value, roleManager: selectedOptionObject?.value })
    //   .then((data) => {
    //     if (data?.codeNumber === 0 && data?.schedule_user?.length > 0) {
    //       //sort by id
    //       data.schedule_user.sort((a, b) => a.id - b.id);
    //       let timeScheduleData = [];
    //       while (data.schedule_user.length > 1) {
    //         const arr = data.schedule_user;
    //         let filterArr = [];
    //         let indexArr = [];
    //         for (let i = 0; i < arr.length; i++) {
    //           if (arr[i].date === arr[0].date) {
    //             filterArr.push(arr[i]);
    //             indexArr.push(i);
    //           }
    //         }
    //         data.schedule_user = data.schedule_user.filter((item, index) => {
    //           return !indexArr.includes(index);
    //         });
    //         timeScheduleData.push(filterArr);
    //       }
    //       if (data.schedule_user.length === 1) {
    //         timeScheduleData.push([data.schedule_user[0]]);
    //       }
    //       timeScheduleData.sort((a, b) =>
    //         moment(a[0].date)
    //           .format(dateFormat.SEND_TO_SERVER)
    //           .localeCompare(
    //             moment(b[0].date).format(dateFormat.SEND_TO_SERVER)
    //           )
    //       );
    //       setTimeUserSelected(timeScheduleData);
    //     } else {
    //       setTimeUserSelected([]);
    //     }
    //   });
    // setStartDate(new Date().setDate(new Date().getDate() + 1));
    // timeData.forEach((time) => {
    //   time.isSelected = false;
    // });
    // setTimeData(timeData);
    // setIsUpdate(false);
    setSelectedOption(e);
  };

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
    if (!selectedOption?.value) {
      toast.error("Please choose department", {
        autoClose: 2000,
        position: "bottom-right",
        theme: "colored",
      });
      return false;
    }
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
        managerId: selectedOption?.value,
        roleManager: selectedOptionObject?.value,
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
      } else {
        toast.success(`${t("system.notification.update")}`, {
          autoClose: 2000,
          position: "bottom-right",
          theme: "colored",
        });
        setIsUpdate(false);
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
    setIsDelete(true);
    setDataScheduleDelete(times);
  };
  const isCloseDeleteUserModal = () => {
    setIsDelete(false);
  };
  const deleteSchedule = async (managerId, date, roleManager) => {
    deleteScheduleByIdAndDate
      .delete({ managerId, date, roleManager })
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
          });
        }
      });
  };

  return (
    <Fragment>
      <div className="w-full" style={{ height: "100px" }}></div>

      <ToastContainer />
      <div
        className="mt-3 flex flex-col items-start mx-auto pb-5 gap-8"
        style={{ maxWidth: "80%", width: "80%" }}
      >
        <p className="mx-auto text-2xl text-blue-600 font-semibold">
          Quản lý lịch hẹn và câu hỏi
        </p>

        <div className="flex items-start justify-between w-full gap-10">
          <div className="flex-1 flex flex-col justify-center gap-1">
            <label className="text-lg text-opacity-60 text-black">
              {t("system.schedule.choose")}
            </label>
            <Select
              value={selectedOptionObject}
              onChange={(e) => handleChangeSelect_general(e)}
              options={option_general}
              className="w-full"
            />
          </div>
          {selectedOptionObject?.value && (
            <>
              <div className="w-[50%] flex items-start justify-center gap-5">
                <div className="flex-1 flex flex-col justify-center gap-1">
                  <label className="text-lg text-opacity-60 text-black">
                    {`${t("system.schedule.mess")} ${
                      option_general[optionSelected]?.label
                    }`}
                  </label>
                  <Select
                    value={selectedOption}
                    onChange={(e) => handleChangeSelect_detail(e)}
                    options={options_detail}
                    className="w-full"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {selectedOption?.value && (
          <div className="flex items-center justify-between gap-10 w-full">
            <button
              type="button"
              class={` hover:bg-blue-800 transition-all duration-500 flex-1 hover:text-white rounded-lg focus:ring-4 focus:ring-blue-300 font-medium  text-md px-5 py-2.5  mb-2 focus:outline-none
                ${
                  action === "schedule"
                    ? "text-white bg-blue-800"
                    : "text-gray-400 bg-white border border-gray-600"
                }`}
              onClick={() => setAction("schedule")}
            >
              Lịch hẹn của sinh viên
            </button>
            <button
              type="button"
              class={`w-[50%] hover:bg-blue-800 transition-all duration-500  hover:text-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5  mb-2 focus:outline-none
                ${
                  action === "question"
                    ? "text-white bg-blue-800"
                    : "text-gray-400 bg-white border border-gray-600"
                }`}
              onClick={() => setAction("question")}
            >
              Câu hỏi của sinh viên
            </button>
          </div>
        )}
        {action && (
          <ActionItem
            action={action}
            roleManager={selectedOptionObject?.value}
            managerId={selectedOption?.value}
          />
        )}
      </div>
    </Fragment>
  );
};

export default ScheduleManager;
