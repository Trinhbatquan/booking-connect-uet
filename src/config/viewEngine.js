const express = require("express")


const configViewEngine = (app) => {
    app.use(express.static("./src/public")) //báo client và express biết chỉ lấy được dữ liệu trong public qua url
    app.set('view engine', 'ejs');
    app.set("views", "./src/views");
}

module.exports = configViewEngine;