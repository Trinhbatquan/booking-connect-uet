const checkBookedSchedule = (getTime, bookingScheduleData) => {
  getTime = getTime.filter((item, index) => {
    return !bookingScheduleData.includes(item.valueTime);
  });
  return getTime;
};

export default checkBookedSchedule;
