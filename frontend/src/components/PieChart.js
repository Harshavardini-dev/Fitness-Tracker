import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ activities }) {
  const types = {};
  activities.forEach(a => types[a.type] = (types[a.type] || 0) + 1);
  const labels = Object.keys(types);
  const values = Object.values(types);

  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: ["#4ce18f","#3b82f6","#ff6b6b","#fbbf24","#a78bfa"],
      borderColor: "transparent",
      borderWidth: 0
    }]
  };

  return (
    <div className="chart-container" style={{height:"260px"}}>
      <Pie
        data={data}
        options={{
          maintainAspectRatio:false,
          cutout: 60, // donut
          plugins:{
            legend:{ position: "right", labels:{ color:"#cbd5e1", boxWidth:12 } },
            tooltip:{ callbacks:{ label: (ctx) => {
              const total = values.reduce((s,n)=>s+n,0);
              const val = ctx.parsed || 0;
              const pct = total ? ((val/total)*100).toFixed(0) : 0;
              return `${ctx.label}: ${val} (${pct}%)`;
            } } }
          },
          animation:{ duration:700, easing:"easeOutQuart" }
        }}
      />
    </div>
  );
}

export default PieChart;
