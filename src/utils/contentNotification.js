import moment from "moment";
import { dateFormat, path } from "./constant";
import "moment/locale/vi";

const timeKey = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8"];
const timeDataVn = [
  "8:00 - 9:00",
  "9:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
];
const timeDataEn = [
  "8:00 AM - 9:00 AM",
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 - 0:00 PM",
  "1:00 PM - 2:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM",
];

const contentNotify = (type, data) => {
  let index = 0;
  for (let i = 0; i < timeKey.length; i++) {
    if (data.bookingData?.timeType === timeKey[i]) {
      index = i;
      break;
    }
  }
  const content = {};
  if (type === "new_book") {
    content.vn = () => (
      <>
        <p>Bạn có một lịch hẹn mới từ sinh viên</p>
        <p>{`Lý do: ${data.bookingData?.reason}`}</p>
        <p>
          {`Thời gian: 
          ${moment(data.bookingData?.date).format(
            dateFormat.SEND_TO_SERVER
          )} lúc
          ${timeDataVn[index]}`}
        </p>
      </>
    );
    content.en = () => (
      <>
        <p>You have a appointment with student</p>
        <p>{`Reason: ${data.bookingData?.reason}`}</p>
        <p>
          {`Time: 
          ${moment(data.bookingData?.date).format(
            dateFormat.SEND_TO_SERVER
          )} lúc
          ${timeDataEn[index]}`}
        </p>
      </>
    );
  } else if (type === "new_ques") {
    content.vn = () => (
      <>
        <p>Bạn có một câu hỏi mới từ sinh viên</p>
        <p>{`Chủ đề: ${data.bookingData?.subject}`}</p>
      </>
    );
    content.en = () => (
      <>
        <p>You have a new question with student</p>
        <p>{`Title: ${data.bookingData?.subject}`}</p>
      </>
    );
  } else if (type === "check_event") {
    content.vn = () => (
      <>
        <p>Bạn có một lịch hẹn sắp diễn ra</p>
        <p>{`Lý do: ${data.bookingData?.reason}`}</p>
        <p>
          {`Thời gian: $
          {moment(data.bookingData?.date).format(dateFormat.SEND_TO_SERVER)} lúc
          ${timeDataVn[index]}`}
        </p>
        <p>
          Vui lòng kiểm tra lại thời gian và địa điểm để tiến hành lịch họp. Xin
          cảm ơn.
        </p>
      </>
    );
    content.en = () => (
      <>
        <p>You have a appointment that is going to be take place</p>
        <p>{`Reason: ${data.bookingData?.reason}`}</p>
        <p>
          {`Time: $
          {moment(data.bookingData?.date).format(dateFormat.SEND_TO_SERVER)} lúc
          ${timeDataEn[index]}`}
        </p>
        <p>Please examine time and place to conduct a appointment. Thanks.</p>
      </>
    );
  } else if (type === "system") {
    content.vn = data.content;
    content.en = data.content;
  } else if (type === "appointment_approved") {
    content.vn = () => (
      <>
        <p>Một lịch hẹn của bạn đã được chấp nhận</p>
        <p>
          {`Lý do của lịch hẹn: `} <u>{data?.bookingData?.reason}</u>
        </p>
        <p>
          {`Thời gian gặp mặt: `}{" "}
          <u>
            {`${moment(data?.bookingData?.date).format("dddd - DD/MM/YYYY")} lúc
            ${timeDataVn[index]}`}
          </u>
        </p>
      </>
    );
    content.en = () => (
      <>
        <p>A appointment has recently approved</p>
        <p>
          {`Reason: `} <u>{data?.bookingData?.reason}</u>
        </p>
        <p>
          {`Appointment Time: `}{" "}
          <u>
            {`${moment(data?.bookingData?.date)
              .locale("en")
              .format("dddd - DD/MM/YYYY")} at
            ${timeDataEn[index]}`}
          </u>
        </p>
      </>
    );
  } else if (type === "appointment_canceled") {
    content.vn = () => (
      <>
        <p>Một lịch hẹn của bạn đã bị huỷ bỏ</p>
        <p>
          {`Lý do của lịch hẹn: `} <u>{data?.bookingData?.reason}</u>
        </p>
        <p>
          {`Thời gian gặp mặt: `}{" "}
          <u>
            {`${moment(data?.bookingData?.date).format("dddd - DD/MM/YYYY")} lúc
            ${timeDataVn[index]}`}
          </u>
        </p>
      </>
    );
    content.en = () => (
      <>
        <p>A appointment has recently canceled</p>
        <p>
          {`Reason: `} <u>{data?.bookingData?.reason}</u>
        </p>
        <p>
          {`Appointment Time: `}{" "}
          <u>
            {`${moment(data?.bookingData?.date)
              .locale("en")
              .format("dddd - DD/MM/YYYY")} at
            ${timeDataEn[index]}`}
          </u>
        </p>
      </>
    );
  } else if (type === "appointment_finished") {
    content.vn = () => (
      <>
        <p>Một lịch hẹn của bạn đã được xác nhận hoàn thành</p>
        <p>
          {`Lý do của lịch hẹn: `} <u>{data?.bookingData?.reason}</u>
        </p>
        <p>
          {`Thời gian gặp mặt: `}{" "}
          <u>
            {`${moment(data?.bookingData?.date).format("dddd - DD/MM/YYYY")} lúc
            ${timeDataVn[index]}`}
          </u>
        </p>
      </>
    );
    content.en = () => (
      <>
        <p>A appointment has recently completed</p>
        <p>
          {`Reason: `} <u>{data?.bookingData?.reason}</u>
        </p>
        <p>
          {`Appointment Time: `}{" "}
          <u>
            {`${moment(data?.bookingData?.date)
              .locale("en")
              .format("dddd - DD/MM/YYYY")} at
            ${timeDataEn[index]}`}
          </u>
        </p>
      </>
    );
  } else if (type === "question_answered") {
    content.vn = () => (
      <>
        <p>Một câu hỏi của bạn đã được trả lời</p>
        <p>
          {`Chủ đề câu hỏi: `} <u>{data?.bookingData?.subject}</u>
        </p>
        <p>
          {`Thời gian đặt câu hỏi: `}{" "}
          <u>
            {`${moment(data?.bookingData?.createdAt).format(
              "dddd - DD/MM/YYYY"
            )}`}
          </u>
        </p>
      </>
    );
    content.en = () => (
      <>
        <p>A question has recently answered</p>
        <p>
          {`Question Subject: `} <u>{data?.bookingData?.subject}</u>
        </p>
        <p>
          {`Question Making Time: `}{" "}
          <u>
            {`${moment(data?.bookingData?.createdAt)
              .locale("en")
              .format("dddd - DD/MM/YYYY")}`}
          </u>
        </p>
      </>
    );
  }

  return content;
};

export default contentNotify;
