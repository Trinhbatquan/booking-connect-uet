import React from "react";

import { Line, Bar } from "react-chartjs-2";
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
  BarElement,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  scales,
  BarElement
);

const Chart = ({ data, type }) => {
  let { i18n } = useTranslation();

  let months_VN = [
    "T1",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "T8",
    "T9",
    "T10",
    "T11",
    "T12",
  ];
  let months_EN = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const keyData = Object.keys(data);
  const valueData = Object.values(data);
  const labelChart = [];
  const valueChart = [];
  keyData.forEach((item) => {
    if (i18n.language === "en") {
      labelChart.push(`${months_EN[+item?.split("-")[1] - 1]}`);
    } else {
      labelChart.push(`${months_VN[+item?.split("-")[1] - 1]}`);
    }
  });
  valueData.forEach((item) => {
    valueChart.push(item?.length);
  });

  let chartData = {
    data: (canvas) => {
      return {
        labels: labelChart,
        datasets: [
          {
            label:
              type === "schedule"
                ? i18n.language === "en"
                  ? "Total of schedules"
                  : "Tổng số lịch hẹn"
                : i18n.language === "en"
                ? "Total of question"
                : "Tổng số câu hỏi",
            fill: true,
            // backgroundColor: type === "schedule" ? "blue" : "green",
            // borderColor: type === "schedule" ? "#1f8ef1" : "#dc9922",
            // borderWidth: 2,
            // borderDash: [],
            // borderDashOffset: 0.0,
            // pointBackgroundColor: type === "schedule" ? "#1f8ef1" : "#dc9922",
            // pointBorderColor: "rgba(255,255,255,0)",
            // pointHoverBackgroundColor:
            //   type === "schedule" ? "#1f8ef1" : "#dc9922",
            // pointBorderWidth: 20,
            // pointHoverRadius: 4,
            // pointHoverBorderWidth: 15,
            // pointRadius: 4,
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 2,
            hoverBackgroundColor: "rgba(255,99,132,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            data: valueChart,
          },
        ],
      };
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      tooltips: {
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
      },
      scales: {
        yAxes: [
          {
            stacked: true,
            gridLines: {
              display: true,
              color: "rgba(255,99,132,0.2)",
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              display: true,
              color: "rgba(255,99,132,0.2)",
            },
          },
        ],
      },
      elements: {
        line: {
          tension: 0.1, // bezier curves
        },
      },
    },
  };

  return (
    <>
      {type === "schedule" ? (
        <Line data={chartData.data()} />
      ) : (
        <Bar data={chartData.data()} />
      )}
    </>
  );
};

export default Chart;
