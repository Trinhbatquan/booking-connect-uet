import React, { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { BsHandIndexThumb } from "react-icons/bs";

import moment from "moment";
import "moment/locale/vi";

import "./Schedule.scss";
import Button from "../../../utils/Button_Home";
import { contact, dateFormat } from "../../../utils/constant";

const Schedule = ({ change, timeData, teacher, handleSchedule }) => {
  const [date, setDate] = useState("");
  console.log({ timeData });
  const options = [];
  const date_now = new Date();
  for (let i = 0; i < 7; i++) {
    let labelDate;
    if (i === 0) {
      labelDate = moment(date_now)
        .add(i, "days")
        // .locale("en")
        .format(dateFormat.TODAY_SCHEDULE);
      //config error first letter
      labelDate = labelDate.charAt(0).toUpperCase() + labelDate.slice(1);
    } else {
      labelDate = moment(date_now)
        .add(i, "days")
        // .locale("en")
        .format(dateFormat.LABEL_SCHEDULE);
      //config error first letter
      labelDate = labelDate.charAt(0).toUpperCase() + labelDate.slice(1);
    }
    const valueDate = moment(date_now)
      .add(i, "days")
      .format(dateFormat.SEND_TO_SERVER);

    options.push({
      value: valueDate,
      label: labelDate,
    });
  }

  // const handleModalSchedule = (text) => {
  //   console.log(text);
  // };

  return (
    <div className="schedule-container">
      <div className="schedule-date">
        <select
          className="text-base"
          name="date"
          id="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            change(e.target.value);
          }}
        >
          {options?.length > 0 &&
            options.map((option, index) => {
              return (
                <option key={index} value={option?.value} className="text-base">
                  {option?.label}
                </option>
              );
            })}
        </select>
      </div>
      <div className="schedule-content">
        <div className="schedule-content-time">
          <div className="schedule-content-label">
            <FaCalendarAlt className="text-xl" />
            <span className="text-base font-semibold uppercase text-headingColor">
              Choose calender
            </span>
          </div>
          <div className="schedule-content-body">
            {timeData && Array.isArray(timeData) && timeData?.length > 0 ? (
              timeData?.map((time, index) => {
                return (
                  <Button
                    key={index}
                    text={time}
                    click={(time) => handleSchedule(time, date)}
                  />
                );
              })
            ) : (
              <span className="text-headingColor ">{timeData}</span>
            )}
          </div>
          {timeData && Array.isArray(timeData) && timeData?.length > 0 && (
            <span className="schedule-content-note text-headingColor text-md flex items-center justify-start gap-1">
              Chọn <BsHandIndexThumb /> và đặt lịch
            </span>
          )}
        </div>
        <div className="schedule-content-contact">
          <p className="text-base font-semibold uppercase text-purple-500 py-1">
            Địa chỉ
          </p>
          <p className="text-base font-semibold text-black py-1">
            {teacher?.address}
          </p>
          <p className="text-base text-headingColor py-1">
            {contact.university}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
