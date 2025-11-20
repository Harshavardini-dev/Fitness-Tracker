import React, { useState } from 'react';
import API from '../api';

export default function ProfileModal({ onClose, refresh, profile }) {
  const [stepGoal, setStepGoal] = useState(profile.stepGoal || 10000);
  const [calGoal, setCalGoal] = useState(profile.calGoal || 2500);
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState(profile.workoutsPerWeek || 4);

  const submit = async () => {
    await API.put('/users/goals', { stepGoal, calGoal, workoutsPerWeek });
    refresh();
    onClose();
  };

  return (
    <div className="modal">
      <h2>Profile & Goals</h2>
      <label>Daily Steps Goal</label>
      <input type="number" value={stepGoal} onChange={e => setStepGoal(e.target.value)} />
      <label>Daily Calories Goal</label>
      <input type="number" value={calGoal} onChange={e => setCalGoal(e.target.value)} />
      <label>Workouts per Week</label>
      <input type="number" value={workoutsPerWeek} onChange={e => setWorkoutsPerWeek(e.target.value)} />
      <div className="modal-actions">
        <button onClick={onClose} className="btn-cancel">Cancel</button>
        <button onClick={submit} className="btn-primary">Save Changes</button>
      </div>
    </div>
  );
}
