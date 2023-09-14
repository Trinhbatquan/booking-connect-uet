"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TokenEmail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //quan hệ 1 - nhiều (1 keyMap - nhiều user) chia làm 2 type là position và gender
      //   TokenEmail.hasMany(models.User, {
      //     foreignKey: "positionId",
      //     as: "positionData",
      //   }),
      //     TokenEmail.hasMany(models.User, {
      //       foreignKey: "gender",
      //       as: "genderData",
      //     }),
      //     TokenEmail.hasMany(models.Schedule, {
      //       foreignKey: "timeType",
      //       as: "timeData",
      //     });
    }
  }
  TokenEmail.init(
    {
      userId: DataTypes.INTEGER,
      token: DataTypes.STRING,
      action: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "TokenEmail",
    }
  );
  return TokenEmail;
};
