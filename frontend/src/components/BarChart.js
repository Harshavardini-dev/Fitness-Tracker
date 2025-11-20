import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function BarChart({ activities }) {
  const last = activities.slice(-14); // last 14 items to avoid clutter
  const labels = last.map(a => new Date(a.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric"}));
  const steps = last.map(a => Number(a.steps) || 0);
  const calories = last.map(a => Number(a.calories) || 0);

  const data = {
    labels,
    datasets: [
      { label:"Steps", data:steps, backgroundColor:"rgba(99,102,241,0.85)" },
      { label:"Calories", data:calories, backgroundColor:"rgba(255,99,132,0.85)" }
    ]
  };

  return (
    <div className="chart-container" style={{height:"260px"}}>
      <Bar
        data={data}
        options={{
          maintainAspectRatio:false,
          animation:{ duration:800, easing:"easeOutQuart"},
          plugins:{ legend:{ labels:{ color:"#cbd5e1" } } },
          scales:{ x:{ ticks:{ color:"#9aa3ad" } }, y:{ ticks:{ color:"#9aa3ad" } } }
        }}
      />
    </div>
  );
}

export default BarChart;
