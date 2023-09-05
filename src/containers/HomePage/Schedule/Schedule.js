import React, { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { BsCircleFill } from "react-icons/bs";
import { BsHandIndexThumb } from "react-icons/bs";
import { useTranslation } from "react-i18next";

import moment from "moment";
import "moment/locale/vi";

import "./Schedule.scss";
import Button from "../../../utils/Button_Home";
import { contact, dateFormat } from "../../../utils/constant";

const Schedule = ({ change, timeData, teacher, handleSchedule }) => {
  const [date, setDate] = useState("");

  const { t, i18n } = useTranslation();

  console.log({ timeData });
  const options = [];
  const date_now = new Date();
  for (let i = 1; i < 8; i++) {
    let labelDate;
    if (i18n.language === "en") {
      if (i === 1) {
        labelDate = moment(date_now)
          .add(i, "days")
          .locale("en")
          .format(dateFormat.TOMORROW_SCHEDULE_EN);
        //config error first letter
        // labelDate = labelDate.charAt(0).toUpperCase() + labelDate.slice(1);
      } else {
        labelDate = moment(date_now)
          .add(i, "days")
          .locale("en")
          .format(dateFormat.LABEL_SCHEDULE);
        //config error first letter
        // labelDate = labelDate.charAt(0).toUpperCase() + labelDate.slice(1);
      }
    } else {
      if (i === 1) {
        labelDate = moment(date_now)
          .add(i, "days")
          // .locale("en")
          .format(dateFormat.TOMORROW_SCHEDULE);
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
    }
    const valueDate = moment(date_now)
      .add(i, "days")
      .format(dateFormat.SEND_TO_SERVER);

    options.push({
      value: valueDate,
      label: labelDate,
    });
  }

  return (
    <div className="schedule-container">
      {/* {console.log(i18n.language)} */}
      <div className="schedule-date">
        <select
          className="text-base"
          name="date"
          id="date"
          value={date}
          defaultValue={options[0]?.value}
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
                    selected={time?.isSelected}
                    key={index}
                    text={
                      i18n.language === "en"
                        ? time?.valueTimeEn
                        : time?.valueTimeVn
                    }
                    date={date || options[0].value}
                    click={(text, date) =>
                      handleSchedule(
                        {
                          timeType: time?.timeType,
                          valueTime:
                            i18n.language === "en"
                              ? time?.valueTimeEn
                              : time?.valueTimeVn,
                        },
                        date
                      )
                    }
                  />
                );
              })
            ) : (
              <span className="text-headingColor ">{timeData}</span>
            )}
          </div>
          {timeData && Array.isArray(timeData) && timeData?.length > 0 && (
            <div className="w-full flex items-center justify-start gap-6">
              <span className="schedule-content-note text-headingColor text-md flex items-center justify-start gap-1">
                Chọn <BsHandIndexThumb /> và đặt lịch
              </span>
              {/* <span className="schedule-content-note text-headingColor text-md flex items-center justify-start gap-1">
                <BsCircleFill className="text-2xl text-slate-500" /> Lịch quá
                hạn
              </span> */}
              <span className="schedule-content-note text-headingColor text-md flex items-center justify-start gap-1">
                <BsCircleFill className="text-2xl text-gray-500" /> Lịch đã chọn
              </span>
              <span className="schedule-content-note text-headingColor text-md flex items-center justify-start gap-1">
                <BsCircleFill className="text-2xl text-yellow-300" /> Lịch trống
              </span>
            </div>
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
