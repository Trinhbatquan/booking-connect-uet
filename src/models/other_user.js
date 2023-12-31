"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OtherUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //   OtherUser.belongsTo(models.AllCode, {
      //     foreignKey: "positionId",
      //     targetKey: "keyMap",
      //     as: "positionData",
      //   }),
      // OtherUser.belongsTo(models.AllCode, {
      //   foreignKey: "gender",
      //   targetKey: "keyMap",
      //   as: "genderData",
      // }),
      OtherUser.hasOne(models.MarkDown, {
        foreignKey: "userId",
        as: "markdownData_other",
      });
      OtherUser.hasOne(models.Teacher, {
        foreignKey: "facultyId",
        as: "facultyData",
      });
      OtherUser.hasMany(models.Booking, {
        foreignKey: "managerId",
        as: "otherUserData",
      });
    }
  }
  OtherUser.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      fullName: DataTypes.STRING,
      address: DataTypes.STRING,
      //   gender: DataTypes.STRING,
      roleId: DataTypes.STRING,
      //   positionId: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      //   image: DataTypes.BLOB,
      //   verified: DataTypes.BOOLEAN,
      code_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "OtherUser",
    }
  );
  return OtherUser;
};
