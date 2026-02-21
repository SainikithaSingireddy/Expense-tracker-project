import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ExpenseChart = ({ expenses }) => {
  const monthlyData = {};

  expenses.forEach((exp) => {
    if (!exp.date) return;
    const dateObj = new Date(exp.date);
    const monthYear = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}`;
    if (!monthlyData[monthYear]) monthlyData[monthYear] = 0;
    monthlyData[monthYear] += Number(exp.amount);
  });

  const sortedMonths = Object.keys(monthlyData).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const data = {
    labels: sortedMonths.map((m) => {
      const [year, month] = m.split("-");
      return `${new Date(year, month - 1).toLocaleString("default", {
        month: "short",
      })} ${year}`;
    }),
    datasets: [
      {
        label: "Monthly Expenses",
        data: sortedMonths.map((m) => monthlyData[m]),
        backgroundColor: "#ea791d",
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ExpenseChart;