"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MarkDown extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //   MarkDown.belongsTo(models.AllCode, {
      //     foreignKey: "positionId",
      //     targetKey: "keyMap",
      //     as: "positionData"
      //   }),
      //   MarkDown.belongsTo(models.AllCode, {
      //     foreignKey: "gender",
      //     targetKey: "keyMap",
      //     as: "genderData"
      //   })
      MarkDown.belongsTo(models.OtherUser, {
        foreignKey: "userId",
        as: "markdownData_other",
      }),
        MarkDown.belongsTo(models.Teacher, {
          foreignKey: "userId",
          as: "markdownData_teacher",
        });
    }
  }
  MarkDown.init(
    {
      markdownHtml: DataTypes.TEXT("long"),
      markdownText: DataTypes.TEXT("long"),
      description: DataTypes.TEXT("long"),
      userId: DataTypes.INTEGER,
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "MarkDown",
    }
  );
  return MarkDown;
};
