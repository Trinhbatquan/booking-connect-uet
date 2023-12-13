const express = require("express");
const sequelize = require("./config/connectDB");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv/config");
const cors = require("cors");
const configViewEngine = require("./config/viewEngine");
const { initWebRoutes } = require("./routes/web");
const { dashboardApi } = require("./routes/dashboard");
const db = require("./models");
const moment = require("moment");
const { convertTimeStamp } = require("./utils/convertTimeStamp");
const sendEmail = require("./utils/sendEmail");
const app = express();

//socket
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { connectSocket } = require("./utils/socket");
//use

const io = new Server(server,{
  cors: {
    origin: true,
    credentials: true,
    //fix cross blocked
    //response header return access-control-allow-credential: true ==> Oke
  },
});


// middleware
/* dữ liệu client gửi lên thường là JSON (vd: axios tự động convert từ oj sang json) 
   hay urlencoded khi người dùng nhập form html, vì vậy cần 2 packages để nodejs hiểu các
   dữ liệu trên và chuyển nó vào trong req.body
*/
app.use(bodyParser.json({ limit: "50mb" })); // cho phép phân tích req.body từ JSON
app.use(bodyParser.urlencoded({ limit: "50mb",extended: true })); //cho phép phân tích dạng form html-unlencoded

//cookie body config
app.use(cookieParser()); //set vào req.cookie một object với key là cookie's name

//config view and file status
configViewEngine(app);

//config client request
// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//     //fix cross blocked
//     //response header return access-control-allow-credential: true ==> Oke
//   })
// );
// app.use((req,res,next) => {
//   // res.header("Access-Control-Allow-Origin","*");
//   res.header("Access-Control-Allow-Methods","GET, POST, PUT, DELETE");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.header('Access-Control-Allow-Credentials','true');
//   next();
// });



app.use(cors({ origin: true,credentials: true,}));



//test connect database xampp
const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:",error);
  }
};
connectDatabase();

const PORT = process.env.PORT || 3000;
server.listen(PORT,() => {
  console.log("App running on port" + " " + PORT);
});

//api
initWebRoutes(app);
dashboardApi(app);
connectSocket(io);

