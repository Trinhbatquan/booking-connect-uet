require("dotenv").config();

module.exports = {
  development: {
    // username: "root",
    // password: "Bodoicuho@1",
    // database: "bookingcare-uet",
    // host: "localhost",
    // port: "3308",
    // dialect: "mysql",
    // logging: false,
    // timezone: "+07:00",
    // query: {
    //   raw: true,
    // },
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
    timezone: "+07:00",
    query: {
      raw: true,
    },
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
    timezone: "+07:00",
    query: {
      raw: true,
    },
  },
};
