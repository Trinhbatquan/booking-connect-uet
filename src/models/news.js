"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class New extends Model {
    static associate(models) {}
  }
  New.init(
    {
      title: DataTypes.STRING,
      contentHtml: DataTypes.TEXT("long"),
      content: DataTypes.TEXT("long"),
      avatarNew: DataTypes.BLOB("long"),
    },
    {
      sequelize,
      modelName: "New",
    }
  );
  return New;
};
