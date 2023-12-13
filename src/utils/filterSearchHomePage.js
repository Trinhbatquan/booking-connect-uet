import toLowerCaseNonAccentVietnamese from "./configText";

const filterSearchInputHomePage = (text,dataSearch) => {
  const textConfig = toLowerCaseNonAccentVietnamese(text);
  // console.log(textConfig);
  for (let i = 0; i < dataSearch.length; i++) {
    dataSearch[i].data = dataSearch[i]?.data.filter((item) => {
      return item?.code.includes(textConfig);
    });
  }
  // console.log(dataSearch);
  return dataSearch;
};

export default filterSearchInputHomePage;
