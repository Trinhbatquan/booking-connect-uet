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

  const { t, i18n } = useTranslation();
  console.log({ timeData });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      await getAllCodeApi.getByType({ type: "TIME" }).then((data) => {
        if (data?.codeNumber === 0) {
          let { allCode } = data;
          if (allCode.length > 0) {
            // allCode.forEach((time, index) => {
            //   time.isSelected = false;
            // });
            allCode = allCode.map((time, index) => ({
              ...time,
              isSelected: false,
            }));
          }
          setTimeData(allCode);
        }
      });
    }
    fetchData();
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
    setTimeUserSelected([]);
    setStartDate(new Date().setDate(new Date().getDate() + 1));
    timeData.forEach((time) => {
      time.isSelected = false;
    });
    setTimeData(timeData);
    setSelectedOptionObject(e);
    setIsUpdate(false);
  };

  const handleChangeSelect_detail = async (e) => {
    await getScheduleSystem.get({ userId: e?.value }).then((data) => {
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
        console.log(timeScheduleData);
        setTimeUserSelected(timeScheduleData);
      } else {
        setTimeUserSelected([]);
      }
    });
    setStartDate(new Date().setDate(new Date().getDate() + 1));
    timeData.forEach((time) => {
      time.isSelected = false;
    });
    setTimeData(timeData);
    setIsUpdate(false);
    setSelectedOption(e);
  };

  //handle change date picker
  const handleChangeDatePicker = (date) => {
    setStartDate(date);
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
        userId: selectedOption?.value,
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
        .get({ userId: body.scheduleData[0].userId })
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
            console.log(timeScheduleData);
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
  const deleteSchedule = async (userId, date) => {
    deleteScheduleByIdAndDate.delete({ userId, date }).then((res) => {
      if (res?.codeNumber === 0) {
        setIsDelete(false);
        setIsUpdate(false);
        setStartDate(new Date().setDate(new Date().getDate() + 1));
        timeData.forEach((time) => {
          time.isSelected = false;
        });
        setTimeData(timeData);

        //load data
        getScheduleSystem.get({ userId }).then((data) => {
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
            console.log(timeScheduleData);
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
      <ToastContainer />
      <div
        className="mt-3 flex flex-col mx-auto pb-10"
        style={{ maxWidth: "80%", width: "80%" }}
      >
        <p className="mx-auto text-2xl text-blue-600 font-semibold">
          {t("system.schedule.manager")}
        </p>

        <div className="flex items-start justify-center gap-5 my-5">
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
        </div>

        {selectedOptionObject?.value && (
          <>
            <div className="flex items-start justify-center gap-5 my-5">
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
              <div className="flex-1 flex flex-col justify-center gap-1">
                <label className="text-lg text-opacity-60 text-black">
                  {t("system.schedule.date")}
                </label>
                <DatePicker
                  value={moment(startDate).format(dateFormat.SEND_TO_SERVER)}
                  onChange={(date) => handleChangeDatePicker(date)}
                  minDate={new Date().setDate(new Date().getDate() + 1)}
                  className="w-full border-opacity-60 border-blurColor rounded-sm"
                />
              </div>
            </div>

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
          </>
        )}

        {timeUserSelected?.length === 0 ? null : (
          <table className="mt-20">
            <thead>
              <tr>
                <th>{t("system.schedule.table.date")}</th>
                <th>{t("system.schedule.table.time")}</th>
                <th>{t("system.schedule.table.action")}</th>
              </tr>
            </thead>
            <tbody>
              {timeUserSelected?.map((times, index) => {
                return (
                  <tr key={index}>
                    <td>
                      {i18n.language === "vi"
                        ? `${moment(times[0]?.date)
                            .format(dateFormat.LABEL_SCHEDULE)
                            .charAt(0)
                            .toUpperCase()}${moment(times[0]?.date)
                            .format(dateFormat.LABEL_SCHEDULE)
                            .slice(1)}`
                        : `${moment(times[0]?.date)
                            .locale("en")
                            .format(dateFormat.LABEL_SCHEDULE)}`}
                      {}
                    </td>
                    <td>
                      <div className="flex flex-wrap items-center justify-start gap-1">
                        {times.map((time, index) => {
                          return (
                            <div
                              className="mx-3"
                              key={index}
                              style={{ minWidth: "130px" }}
                            >
                              {i18n.language === "vi"
                                ? time?.timeData?.valueVn
                                : time?.timeData?.valueEn}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-6">
                        <FiEdit
                          className="cursor-pointer text-inputColor"
                          onClick={() => handleUpdateData(times)}
                        />
                        <AiOutlineDelete
                          className="cursor-pointer text-blue-600"
                          onClick={() => isOpenModalDeleteUser(times)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
        />
      )}
    </Fragment>
  );
};

export default ScheduleManager;
