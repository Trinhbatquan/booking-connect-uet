import React from "react";

import { Pie as PieChart } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  scales,
  ArcElement,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  scales,
  ArcElement
);

const Pie = ({ data, type }) => {
  const { i18n } = useTranslation();

  const genPieData = () => {
    return {
      datasets: [
        {
          data:
            type === "schedule"
              ? [
                  data.new.length,
                  data.process.length,
                  data.done.length,
                  data.cancel.length,
                ]
              : [data.new.length, data.done.length],
          backgroundColor: ["orange", "blue", "red", "purple", "green"],
          hoverBackgroundColor: ["orange", "blue", "red", "purple", "green"],
          borderColor: ["orange", "blue", "red", "purple", "green"],
        },
      ],
      labels:
        type === "schedule"
          ? i18n.language === "en"
            ? [
                "New Schedule",
                "Progress Schedule",
                "Completed Schedule",
                "Canceled Schedule",
              ]
            : [
                "Lịch mới",
                "Lịch đang tiến hành",
                "Lịch đã hoàn thành",
                "Lịch bị huỷ",
              ]
          : i18n.language === "en"
          ? ["New Question", "Completed Question"]
          : ["Câu hỏi mới", "Câu hỏi đã trả lời"],
    };
  };

  return (
    <div className="flex flex-col items-center justify-start gap-2 w-full">
      <h3 className="" style={{ color: "rgb(123, 128, 154)" }}>
        {type === "schedule"
          ? "Bảng cơ cấu về lịch hẹn của sinh viên"
          : "Bảng cơ cấu về câu hỏi của sinh viên"}
      </h3>
      <div className="px-4 flex items-center justify-center w-[70%]">
        <PieChart data={genPieData()} style={{ fontSize: "20px" }} />
      </div>
    </div>
  );
};

export default Pie;
