// import React from 'react'
import "./Loading.scss";

import React from "react";

const Loading = ({ type }) => {
  return (
    <div class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loading;
