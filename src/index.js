const express = require("express");
const sequelize = require("./config/connectDB");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv/config");
const cors = require("cors");
const configViewEngine = require("./config/viewEngine");
const { initWebRoutes } = require("./routes/web");

const app = express();

// middleware
/* dữ liệu client gửi lên thường là JSON (vd: axios tự động convert từ oj sang json) 
   hay urlencoded khi người dùng nhập form html, vì vậy cần 2 packages để nodejs hiểu các
   dữ liệu trên và chuyển nó vào trong req.body
*/
app.use(bodyParser.json({ limit: "50mb" })); // cho phép phân tích req.body từ JSON
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); //cho phép phân tích dạng form html-unlencoded

//cookie body config
app.use(cookieParser()); //set vào req.cookie một object với key là cookie's name

//config view and file status
configViewEngine(app);

//config client request
app.use(
  cors({
    origin: true,
    credentials: true,
    //fix cross blocked
    //response header return access-control-allow-credential: true ==> Oke
  })
);

//test connect database xampp
const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
connectDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("App running on port" + " " + PORT);
});

//api
initWebRoutes(app);
