import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJs, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
ChartJs.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function WeeklyChart({ dataPoints }) {
  const labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const data = {
    labels,
    datasets: [{ label: 'Steps', data: dataPoints, barPercentage: 0.6 }]
  };
  return <div className="chart-box"><Bar data={data} /></div>;
}
