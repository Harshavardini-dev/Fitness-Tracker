// src/components/ActivityTable.js
import React from "react";

function ActivityTable({ activities = [] }) {
  return (
    <div>
      {activities.length === 0 ? (
        <p>No activities yet.</p>
      ) : (
        <table className="activity-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Intensity</th>
              <th>Minutes</th>
              <th>Calories</th>
              <th>Steps</th>
              <th>Distance (km)</th>
            </tr>
          </thead>

          <tbody>
            {activities.map((a) => (
              <tr key={a._id || a.createdAt}>
                <td>
                  {a.createdAt
                    ? new Date(a.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td>{a.type}</td>
                <td>{a.intensity}</td>
                <td>{a.durationMin}</td>
                <td>{a.calories}</td>
                <td>{a.steps}</td>
                <td>{a.distanceKm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ActivityTable;
