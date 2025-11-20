import React from "react";

function StatsCard({ title, value, unit }) {
  return (
    <div className="stats-card">
      <h3>{title}</h3>
      <p className="stats-value">
        {value} <span className="unit">{unit}</span>
      </p>
    </div>
  );
}

export default StatsCard;
