const Sequelize = require("sequelize");
require("dotenv").config();

// Option 3: Passing parameters separately (other dialects)
const customDB = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  logging: false,
  timezone: "+07:00",
  query: {
    raw: true,
  },
};
const sequelize = new Sequelize(
  process.env.DB_DATABASE_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    ...customDB,
  }
);

module.exports = sequelize;
