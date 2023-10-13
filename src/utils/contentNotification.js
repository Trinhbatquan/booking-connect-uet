import moment from "moment";
import { dateFormat, path } from "./constant";

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
  }

  return content;
};

export default contentNotify;
