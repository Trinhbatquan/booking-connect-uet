"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AllCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //quan hệ 1 - nhiều (1 keyMap - nhiều user) chia làm 2 type là position và gender
      AllCode.hasMany(models.Teacher, {
        foreignKey: "positionId",
        as: "positionData",
      }),
        AllCode.hasMany(models.Teacher, {
          foreignKey: "gender",
          as: "genderData",
        }),
        AllCode.hasMany(models.Schedule, {
          foreignKey: "timeType",
          as: "timeData",
        }),
        AllCode.hasMany(models.Booking, {
          foreignKey: "timeType",
          as: "timeDataBooking",
        });
    }
  }
  AllCode.init(
    {
      keyMap: DataTypes.STRING,
      type: DataTypes.STRING,
      valueEn: DataTypes.STRING,
      valueVn: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AllCode",
    }
  );
  return AllCode;
};
