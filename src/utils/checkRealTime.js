import moment from "moment";
import { dateFormat } from "./constant";

const checkRealTime = (data) => {
  console.log(data);
  const real_time = moment(new Date()).format(dateFormat.FORMAT_HOURS);
  if (data && Array.isArray(data) && data?.length > 0) {
    data = data.filter((time, index) => {
      const splitArr = time?.valueTime?.split("-");
      const firstLetterSplitArr = [
        splitArr[0].split(":")[0],
        splitArr[1].split(":")[0],
      ];
      return +real_time.split("-")[0] < +firstLetterSplitArr[0];
    });

    return data;
  }
};

export default checkRealTime;

//check timeData - only display time that is advance real time
//   const real_time = moment(new Date()).format(dateFormat.FORMAT_HOURS)
//   if (timeData && Array.isArray(timeData) && timeData?.length > 0) {
//     timeData = timeData.filter((time) => {
//       const splitArr = time.split("-");
//       const firstLetterSplitArr = [splitArr[0].slice(0,1),splitArr[1].slice(0,1)];
//       return
//     })
//   }
