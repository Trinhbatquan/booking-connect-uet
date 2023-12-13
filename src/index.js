import React from "react";
import ReactDOM from "react-dom/client";
import App from "./containers/App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

// import Cookies from "universal-cookie";

//socket
import { io } from "socket.io-client";

//sass
import "./styles/styles.scss";

//language
import "./i18n";
import store from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// const cookies = new Cookies();
// console.log(cookies.get("access_token_booking_UET"));

//connect_socket_backend
const socket = io(process.env.REACT_APP_URL_API);
socket.on("connected",() => {
  // console.log("client connected");
});
export { socket };
