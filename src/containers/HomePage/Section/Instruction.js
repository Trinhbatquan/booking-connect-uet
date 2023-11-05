import React from "react";
import "./Section.scss";
import { useTranslation } from "react-i18next";
const Instruction = ({ type }) => {
  const { i18n } = useTranslation();
  return (
    <div
      className="instruction_main w-full mt-[50px] min-h-[132px]"
      style={
        type === "question"
          ? {
              background:
                "url('https://i-vn2.joboko.com/okoimg/resource.joboko.com/xurl/images/common/bg-2.png') no-repeat center/cover,#d65650",
              display: "flex",
              alignItems: "center",
              padding: "21px 27px 15px",
              borderRadius: "5px",
            }
          : {
              background:
                "url('https://i-vn2.joboko.com/okoimg/resource.joboko.com/xurl/images/common/bg-2.png') no-repeat center/cover,#1d5193",
              display: "flex",
              alignItems: "center",
              padding: "21px 27px 15px",
              borderRadius: "5px",
            }
      }
    >
      <h2
        className=""
        style={{
          paddingLeft: "33px",
          maxWidth: "220px",
          marginBottom: "8px",
          color: "#fff",
          position: "relative",
          fontSize: "22px",
        }}
      >
        {i18n.language === "en"
          ? type === "question"
            ? "How to make a question?"
            : "How to schedule an appointment?"
          : type === "question"
          ? "Hướng dẫn đặt câu hỏi"
          : "Hướng dẫn đặt lịch hẹn"}
        <div
          className=""
          style={{
            position: "absolute",
            top: "8px",
            bottom: "8px",
            left: 0,
            width: "10px",
            backgroundColor: type === "question" ? "#d29641" : "#f68500",
          }}
        ></div>
      </h2>

      <div
        className="instruction_list"
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexGrow: "1",
        }}
      >
        <div className="instruction_list_item relative mt-0 w-[25%]">
          <div
            className="instruction_count"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              width: "49px",
              height: "49px",
              margin: "0 auto 9px",
              backgroundColor: type === "question" ? "#d29641" : "#7ccbfe",
              color: "#1d5193",
            }}
          >
            <span
              style={{
                fontSize: "22px",
                lineHeight: "1.5",
                fontWeight: "700",
              }}
            >
              01
            </span>
          </div>
          <p
            style={{
              fontSize: "14px",
              lineHeight: "1.5",
              textAlign: "center",
              color: "#fff",
            }}
          >
            {i18n.language === "en"
              ? "Select person or institution"
              : "Chọn cá nhân hoặc đơn vị"}
          </p>
          <div
            style={{
              position: "absolute",
              top: "5px",
              right: "-30px",
              width: "61px",
              height: "15px",
              background:
                "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAAPCAYAAABX0MdPAAAABmJLR0QA/wD/AP+gvaeTAAABh0lEQVRIid3WP4jPcRwG8Of9Q/Kv6+4oyXAWdaXOeov4DRQTpURhcMtlucFqwMJgl02W28SISzZishlMDIoMVnoZfE6XlDt+398vnuXzfZ76vJ/n3efP91MZArA+yWSSL1X1EZNJppJ8qqo3w8jQOdDHLZxufAHvcaXxY3iBG40fwQfcaXwchzE2ui5+gxbwARYa72Me02uosQNT7XsaT/C48XHMojppYJUBN+MczjQ+i5MY78hvP17hXuPDa76dzeBEW9n+0My/+25p4wUs4VCXZttwE887M1kDsAGncLTxXQNbfaxr40Zcxc6BFB4wcBfPsOdvC83gZadbaEBAtTtlU+Nb/7TQPM4PMtwwgH14u7z1VzNhDJfR6zhbp8ABzP1Cn8Ol3gqhkjxMsj3JP910VT2tqtvo4fqKu2gyycTyL6iqCo5X1bvRxR04JPmc5BFmlsVeewUtofefNZyqUlXXkhysqq8/9CTB3qp6PbJ0HaGd64kV0tkk90f3lh0CcDHJ7p/kxW9aIku65dGODwAAAABJRU5ErkJggg==')",
            }}
          ></div>
        </div>

        <div className="instruction_list_item relative mt-0 w-[25%]">
          <div
            className="instruction_count"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              width: "49px",
              height: "49px",
              margin: "0 auto 9px",
              backgroundColor: type === "question" ? "#d29641" : "#7ccbfe",
              color: "#1d5193",
            }}
          >
            <span
              style={{
                fontSize: "22px",
                lineHeight: "1.5",
                fontWeight: "700",
              }}
            >
              02
            </span>
          </div>
          <p
            style={{
              fontSize: "14px",
              lineHeight: "1.5",
              textAlign: "center",
              color: "#fff",
            }}
          >
            {i18n.language === "en"
              ? type === "question"
                ? "Choose make question"
                : "Choose date and time for appointment"
              : type === "question"
              ? "Chọn phần đặt câu hỏi"
              : "Chọn ngày và thời gian cho lịch hẹn"}
          </p>
          <div
            style={{
              position: "absolute",
              top: "15px",
              right: "-30px",
              width: "61px",
              height: "15px",
              background:
                "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAAPCAYAAABX0MdPAAAABmJLR0QA/wD/AP+gvaeTAAABi0lEQVRIid3WT4hPURQH8HN+w0T588NQQv1iYyE7skGzGKZEWNkNRVbKRlnMXs3e3mxs7JSxsCQLlLK2kMROKUs/H5vz0/SrWTDvvTG+9Tr3e+6753xP7977TsZ/DFyLiD1j7qUNNTnIzA+dq2of/YjYsYxfjoh+YIDn6K2RsNaBftm7uNerL3w6M39ifCuse+BORLzAxMjXi4iogjMinmBh+QvrGVXHvoiYzczhyP97S2emiDgbET+6l9cscAJzmTnMzNuZ+ammvtWz4sLruNKJygaBI/iCS3+z+BjeYboFbY0DF7Cpxv3VBNpYdhLzmGpIY6PAIt7iYJNBt+M+3jQWdBXABC5ipvigtV8uJsuexyOcbCXRyvlH2/cGXo6K7ir5NtzE1eLH60xtaSnfUbzG4+Jr30jhHJ5VIxA4Vbf/oT+IsRX7a3wYT7FUfBem/+n+AbN4gLnit/AR88Vn8AoLxc/gOx4W31lHaHcb+rKNoOPA5oiYiohhZn7G3og4EBFfM/M9spqjTvALBlRHKs+487QAAAAASUVORK5CYII=')",
            }}
          ></div>
        </div>

        <div className="instruction_list_item relative mt-0 w-[25%]">
          <div
            className="instruction_count"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              width: "49px",
              height: "49px",
              margin: "0 auto 9px",
              backgroundColor: type === "question" ? "#d29641" : "#7ccbfe",
              color: "#1d5193",
            }}
          >
            <span
              style={{
                fontSize: "22px",
                lineHeight: "1.5",
                fontWeight: "700",
              }}
            >
              03
            </span>
          </div>
          <p
            style={{
              fontSize: "14px",
              lineHeight: "1.5",
              textAlign: "center",
              color: "#fff",
            }}
          >
            {i18n.language === "en"
              ? "Enter information fulfillmentally"
              : "Nhập thông tin đầy đủ"}
          </p>
          <div
            style={{
              position: "absolute",
              top: "5px",
              right: "-30px",
              width: "61px",
              height: "15px",
              background:
                "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAAPCAYAAABX0MdPAAAABmJLR0QA/wD/AP+gvaeTAAABh0lEQVRIid3WP4jPcRwG8Of9Q/Kv6+4oyXAWdaXOeov4DRQTpURhcMtlucFqwMJgl02W28SISzZishlMDIoMVnoZfE6XlDt+398vnuXzfZ76vJ/n3efP91MZArA+yWSSL1X1EZNJppJ8qqo3w8jQOdDHLZxufAHvcaXxY3iBG40fwQfcaXwchzE2ui5+gxbwARYa72Me02uosQNT7XsaT/C48XHMojppYJUBN+MczjQ+i5MY78hvP17hXuPDa76dzeBEW9n+0My/+25p4wUs4VCXZttwE887M1kDsAGncLTxXQNbfaxr40Zcxc6BFB4wcBfPsOdvC83gZadbaEBAtTtlU+Nb/7TQPM4PMtwwgH14u7z1VzNhDJfR6zhbp8ABzP1Cn8Ol3gqhkjxMsj3JP910VT2tqtvo4fqKu2gyycTyL6iqCo5X1bvRxR04JPmc5BFmlsVeewUtofefNZyqUlXXkhysqq8/9CTB3qp6PbJ0HaGd64kV0tkk90f3lh0CcDHJ7p/kxW9aIku65dGODwAAAABJRU5ErkJggg==')",
            }}
          ></div>
        </div>

        <div className="instruction_list_item relative mt-0 w-[25%]">
          <div
            className="instruction_count"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              width: "49px",
              height: "49px",
              margin: "0 auto 9px",
              backgroundColor: type === "question" ? "#d29641" : "#7ccbfe",
              color: "#1d5193",
            }}
          >
            <span
              style={{
                fontSize: "22px",
                lineHeight: "1.5",
                fontWeight: "700",
              }}
            >
              04
            </span>
          </div>
          <p
            style={{
              fontSize: "14px",
              lineHeight: "1.5",
              textAlign: "center",
              color: "#fff",
            }}
          >
            {i18n.language === "en"
              ? type === "question"
                ? "Make question and check your email"
                : "Booking appointment and check your email"
              : type === "question"
              ? "Đặt câu hỏi và kiểm tra hòm thư của bạn"
              : "Đặt lịch và kiểm tra hòm thư của bạn"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Instruction;
