import React from "react";

/**
 * props.stats should be an array of objects:
 * [{ title: "Distance", value: 40.98, unit: "km" }, ...]
 */
export default function VerticalStats({ stats = [] }) {
  // helper to format values (avoid long floats)
  const fmt = (v) => {
    if (v === null || v === undefined) return "-";
    if (typeof v === "number") {
      // if integer-like -> show as integer, else show 1 or 2 decimals intelligently
      return Math.abs(v) % 1 === 0 ? v.toString() : Number(v).toFixed(2);
    }
    return v.toString();
  };

  return (
    <div className="stats-vertical">
      {stats.map((s, idx) => (
        <div className="stat-card" key={idx}>
          <div className="stat-title">{s.title}</div>

          <div className="stat-body">
            <div className="stat-value">{fmt(s.value)}</div>
            {s.unit && <div className="stat-unit">{s.unit}</div>}
          </div>

          {s.sub && <div className="stat-sub">{s.sub}</div>}
        </div>
      ))}
    </div>
  );
}
