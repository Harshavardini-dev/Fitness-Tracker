import React, { useState } from 'react';
import API from '../api';

export default function ActivityModal({ onClose, refresh }) {
  const [type, setType] = useState('Running');
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState('Medium');
  const [calories, setCalories] = useState(300);
  const [steps, setSteps] = useState(0);

  const submit = async () => {
    try {
      await API.post('/activities', {
        type, duration, intensity, calories, steps
      });
      refresh();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to log activity');
    }
  };

  return (
    <div className="modal">
      <h2>Log New Activity</h2>
      <label>Activity Type</label>
      <select value={type} onChange={e=>setType(e.target.value)}>
        <option>Running</option><option>Cycling</option><option>Walking</option><option>Strength Training</option><option>Yoga</option>
      </select>

      <label>Duration (minutes)</label>
      <input type="number" value={duration} onChange={e=>setDuration(e.target.value)} />

      <label>Intensity</label>
      <select value={intensity} onChange={e=>setIntensity(e.target.value)}>
        <option>Low</option><option>Medium</option><option>High</option>
      </select>

      <label>Calories Burned (estimate)</label>
      <input type="number" value={calories} onChange={e=>setCalories(e.target.value)} />

      <label>Steps</label>
      <input type="number" value={steps} onChange={e=>setSteps(e.target.value)} />

      <div className="modal-actions">
        <button onClick={onClose} className="btn-cancel">Cancel</button>
        <button onClick={submit} className="btn-primary">Log Activity</button>
      </div>
    </div>
  );
}
