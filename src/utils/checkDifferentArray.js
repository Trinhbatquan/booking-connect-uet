const lodash = require("lodash");

function getDifference(arrayOne, arrayTwo) {
  // return array1.filter((object1) => {
  //   return !array2.some((object2) => {
  //     return object1.id === object2.id;
  //   });
  // });

  // return arrayOne.filter(
  //   ({ value: id1 }) => !arrayTwo.some(({ value: id2 }) => id2 === id1)
  // );

  var Obj3 = lodash.differenceWith(arrayOne, arrayTwo, function (o1, o2) {
    return o1["timeType"] === o2["timeType"];
  });
  return Obj3;
}

module.exports = {
  getDifference,
};
