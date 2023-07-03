"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //   Student.belongsTo(models.AllCode, {
      //     foreignKey: "positionId",
      //     targetKey: "keyMap",
      //     as: "positionData",
      //   }),
      Student.belongsTo(models.AllCode, {
        foreignKey: "gender",
        targetKey: "keyMap",
        as: "genderData",
      });
      // Student.hasOne(models.MarkDown, {
      //   foreignKey: "userId",
      //   as: "markdownData",
      // });
    }
  }
  Student.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      fullName: DataTypes.STRING,
      address: DataTypes.STRING,
      gender: DataTypes.STRING,
      faculty: DataTypes.STRING,
      classroom: DataTypes.STRING,
      //   roleId: DataTypes.STRING,
      //   positionId: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      image: DataTypes.BLOB,
      verified: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Student",
    }
  );
  return Student;
};
