function convertTimeStamp(date) {
  date = date.split("-");
  return new Date(date[2], date[1] - 1, date[0]); // UTC +00
  //example: 2023-06-02T00:00:00Z
}

module.exports = {
  convertTimeStamp,
};
