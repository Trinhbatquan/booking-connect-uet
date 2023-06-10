import React, { useState, useEffect, Fragment } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";

import Button from "../../../utils/Button";
import { getAllCodeApi, getUserApi } from "../../../services/userService";
import { dateFormat } from "../../../utils/constant";
import { createSchedule } from "../../../services/scheduleService";

const ScheduleManager = () => {
  const [selectedOption, setSelectedOption] = useState({});
  const [startDate, setStartDate] = useState(new Date());

  const [userData, setUserData] = useState([]);
  const [timeData, setTimeData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await getUserApi.getAllUsers({ id: "All" }).then((data) => {
        if (data?.codeNumber === 0) {
          setUserData(data?.user);
        }
      });
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

  //option select
  let options = [];
  if (userData.length > 0) {
    userData.forEach((user, index) => {
      options.push({ value: user?.id, label: user?.fullName });
    });
  }

  //handle change select
  const handleChangeSelect = (e) => {
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
      });
      return false;
    }
    if (!startDate) {
      toast.error("please choose date", {
        autoClose: 2000,
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

  //handle click save button
  const handleSaveSchedule = async () => {
    if (!handleCheckNull()) {
      return;
    }
    const data = await createSchedule.create({}, handleCheckNull());
    if (data?.codeNumber === 0) {
      setSelectedOption({});
      setStartDate(new Date());
      timeData.map((time) => {
        time.isSelected = false;
        return time;
      });
      setTimeData(timeData);
      toast.success(data?.message, {
        autoClose: 2000,
      });
    } else {
      toast.error(data?.message, {
        autoClose: 2000,
      });
    }
  };

  return (
    <Fragment>
      <ToastContainer />
      <div
        className="mt-3 flex flex-col mx-auto pb-10"
        style={{ maxWidth: "80%", width: "80%" }}
      >
        <p className="mx-auto text-2xl text-blue-600 font-semibold">
          SCHEDULE MANAGER
        </p>

        <div className="flex items-start justify-center gap-5 my-5">
          <div className="flex-1 flex flex-col justify-center gap-1">
            <label className="text-lg text-opacity-60 text-black">
              Chọn giảng viên, phòng ban, khoa, viện
            </label>
            <Select
              value={selectedOption}
              onChange={(e) => handleChangeSelect(e)}
              options={options}
              className="w-full"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center gap-1">
            <label className="text-lg text-opacity-60 text-black">
              Chọn lịch
            </label>
            <DatePicker
              value={moment(startDate).format(dateFormat.SEND_TO_SERVER)}
              onChange={(date) => handleChangeDatePicker(date)}
              minDate={new Date()}
              className="w-full border-opacity-60 border-blurColor rounded-sm"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center items-start gap-1 mb-5">
          <label className="text-lg text-opacity-60 text-black">
            Chọn thời gian
          </label>
          <div className="flex items-center justify-start gap-5">
            {timeData.length > 0 &&
              timeData.map((time, index) => (
                <Button
                  key={index}
                  text={time?.valueVn}
                  value={time?.keyMap}
                  isSelected={time?.isSelected}
                  click={() => clickButton(time)}
                />
              ))}
          </div>
        </div>

        <Button
          text="Lưu thông tin"
          type="Save Schedule"
          click={handleSaveSchedule}
        />
      </div>
    </Fragment>
  );
};

export default ScheduleManager;
