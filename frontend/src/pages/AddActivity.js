// src/components/AddActivity.js (or src/pages/AddActivity.js)
import React, { useState } from "react";
import API from "../api/index.js";

// Small inline SVG icons
const Svg = {
  steps: (c = "#19b86b") => (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path d="M5 13c1-3 4-5 7-5s6 2 7 5" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  stopwatch: (c = "#5b8cff") => (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path d="M12 8v4" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 2v2" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="13" r="7" stroke={c} strokeWidth="1.6" />
    </svg>
  ),
  bolt: (c = "#ffcf56") => (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  flame: (c = "#ff4d4f") => (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path d="M12 3s1.5 2 1.5 4.5S12 11 12 11s-3-1-3-4 3-4 3-4z" stroke={c} strokeWidth="1.4" />
      <path d="M7 13a5 5 0 0010 0c0-3-5-5-5-5" stroke={c} strokeWidth="1.4" />
    </svg>
  ),
  footprint: (c = "#19b86b") => (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path d="M16 11c1-2 3-3 4-3" stroke={c} strokeWidth="1.6" />
      <path d="M8 13c0 3 3 6 4 6s4-3 4-6" stroke={c} strokeWidth="1.6" />
    </svg>
  ),
  ruler: (c = "#4177f6") => (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path d="M4 20l16-16" stroke={c} strokeWidth="1.6" />
      <path d="M8 4l0 0M12 8l0 0M16 12l0 0" stroke={c} strokeWidth="1.6" />
    </svg>
  ),
};

export default function AddActivity({ onAdded = () => {} }) {
  const [form, setForm] = useState({
    type: "",
    duration: "",
    intensity: "",
    calories: "",
    steps: "",
    distanceKm: ""
  });

  const [loading, setLoading] = useState(false);

  const change = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔥 FIXED: Correct backend fields
      const payload = {
        type: form.type,
        duration: form.duration,        // backend wants "duration"
        intensity: form.intensity,
        calories: form.calories,
        steps: form.steps,
        distance: form.distanceKm       // backend wants "distance"
      };

      await API.post("/activities", payload);

      // reset fields
      setForm({
        type: "",
        duration: "",
        intensity: "",
        calories: "",
        steps: "",
        distanceKm: ""
      });

      onAdded();
    } catch (err) {
  console.log("ADD ACTIVITY ERROR:", err.response?.data || err.message);
  alert("Failed to add activity");


    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-activity-form" onSubmit={submit}>
      <label className="input-row">
        <span className="input-icon">{Svg.steps()}</span>
        <input
          placeholder="Activity Type (Running)"
          value={form.type}
          onChange={change("type")}
          required
        />
      </label>

      <label className="input-row">
        <span className="input-icon">{Svg.stopwatch()}</span>
        <input
          type="number"
          placeholder="Duration (min)"
          value={form.duration}
          onChange={change("duration")}
        />
      </label>

      <label className="input-row">
        <span className="input-icon">{Svg.bolt()}</span>
        <select value={form.intensity} onChange={change("intensity")}>
          <option value="">Intensity (Low / Medium / High)</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </label>

      <label className="input-row">
        <span className="input-icon">{Svg.flame()}</span>
        <input
          type="number"
          placeholder="Calories Burned"
          value={form.calories}
          onChange={change("calories")}
        />
      </label>

      <label className="input-row">
        <span className="input-icon">{Svg.footprint()}</span>
        <input
          type="number"
          placeholder="Steps"
          value={form.steps}
          onChange={change("steps")}
        />
      </label>

      <label className="input-row">
        <span className="input-icon">{Svg.ruler()}</span>
        <input
          type="number"
          placeholder="Distance (km)"
          step="0.01"
          value={form.distanceKm}
          onChange={change("distanceKm")}
        />
      </label>

      <button className="add-btn" type="submit" disabled={loading}>
        {loading ? "Saving..." : "+ Add Activity"}
      </button>
    </form>
  );
}
