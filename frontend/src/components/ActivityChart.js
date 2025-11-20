// frontend/src/components/ActivityChart.js
import React from "react";
import {
  Line
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

function ActivityChart({ activities }) {

  const labels = activities.map(a =>
    new Date(a.createdAt).toLocaleDateString()
  );

  const caloriesData = activities.map(a => Number(a.calories) || 0);
  const distanceData = activities.map(a => Number(a.distanceKm) || 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Calories Burned",
        data: caloriesData,
        borderColor: "#4ce18f",
        backgroundColor: "rgba(76, 225, 143, 0.2)",
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: "#4ce18f",
        pointBorderColor: "#111",
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "#22d07a",
        pointHoverBorderColor: "#fff",
        fill: false
      },
      {
        label: "Distance (km)",
        data: distanceData,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.25)",
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#111",
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "#60a5fa",
        pointHoverBorderColor: "#fff",
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#e5e7eb",
          font: { size: 14, weight: "600" },
          padding: 20,
          usePointStyle: true,
          pointStyle: "round"
        }
      },
      tooltip: {
        backgroundColor: "rgba(17,17,17,0.9)",
        titleColor: "#fff",
        bodyColor: "#ccc",
        borderColor: "#333",
        borderWidth: 1,
        padding: 12,
        displayColors: false
      }
    },

    scales: {
      x: {
        ticks: {
          color: "#cbd5e1",
          font: { size: 12 },
          maxRotation: 0,
          minRotation: 0
        },
        grid: {
          color: "rgba(255,255,255,0.08)"
        }
      },
      y: {
        ticks: {
          color: "#cbd5e1",
          font: { size: 12 }
        },
        grid: {
          color: "rgba(255,255,255,0.08)"
        }
      }
    },

    layout: {
      padding: {
        top: 20,
        bottom: 10,
        left: 10,
        right: 20
      }
    }
  };

  return (
    <div style={{ height: "350px", padding: "10px" }}>
      <Line data={data} options={options} />
    </div>
  );
}

export default ActivityChart;
