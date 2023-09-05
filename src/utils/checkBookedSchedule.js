const checkBookedSchedule = (getTime, bookingScheduleData) => {
  console.log(getTime, bookingScheduleData);
  getTime.forEach((time, index) => {
    if (bookingScheduleData.includes(time?.timeType)) {
      time.isSelected = true;
    } else {
      time.isSelected = false;
    }
  });
  return getTime;
};

export default checkBookedSchedule;
