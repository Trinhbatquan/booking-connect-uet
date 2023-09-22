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
          backgroundColor:
            type === "schedule"
              ? ["red", "blue", "yellow", "green"]
              : ["red", "blue"],
          label:
            type === "schedule"
              ? i18n.language === "en"
                ? "Structure Table of schedule"
                : "Bảng cơ cấu lịch hẹn"
              : i18n.language === "en"
              ? "Structure Table of question"
              : "Bảng cơ cấu câu hỏi",
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

  return <PieChart data={genPieData()} />;
};

export default Pie;
