// frontend/src/pages/Dashboard.js
import React, { useEffect, useState, useCallback } from "react";
import API from "../api/index.js";
import backend from "../api/backend";
import AddActivity from "./AddActivity";
import ActivityChart from "../components/ActivityChart";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import ActivityTable from "../components/ActivityTable";

// ---------- ICONS ----------
function Icon({ name, size = 18, color = "#fff" }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none" };

  switch (name) {
    case "steps":
      return <svg {...common}><path d="M5 13c1-3 4-5 7-5s6 2 7 5" stroke={color} strokeWidth="1.6" /></svg>;
    case "calories":
      return <svg {...common}><path d="M12 3c0 4-5 5-5 9a5 5 0 0010 0C17 8 12 7 12 3z" stroke={color} strokeWidth="1.6" /></svg>;
    case "active":
      return <svg {...common}><circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.6" /></svg>;
    case "sleep":
      return <svg {...common}><path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" stroke={color} strokeWidth="1.6" /></svg>;
    case "hr":
      return <svg {...common}><path d="M3 12h3l2-4 4 8 3-6 3 6" stroke={color} strokeWidth="1.6" /></svg>;
    case "distance":
      return <svg {...common}><path d="M3 12c4-6 8-6 12 0 2 3 4 4 6 4" stroke={color} strokeWidth="1.6" /></svg>;
    case "trash":
      return <svg {...common}><path d="M3 6h18M8 6v14M16 6v14M10 6V4a2 2 0 012-2a2 2 0 012 2v2" stroke={color} strokeWidth="1.6" /></svg>;
    default:
      return null;
  }
}

// ---------- STAT CARD ----------
function StatCard({ id, title, value, unit, color, iconName }) {
  const fmt = (v) => (v === null || v === undefined ? "-" : Number(v).toLocaleString());

  return (
    <div className="stat-hero-card" id={id}>
      <div className="stat-hero-top">
        <div className="stat-icon" style={{ background: `${color}14`, color }}>
          <Icon name={iconName} color={color} />
        </div>
        <div className="stat-hero-title">{title}</div>
      </div>

      <div className="stat-hero-value">
        <span className="stat-number" style={{ color }}>{fmt(value)}</span>
        {unit && <span className="stat-unit">{unit}</span>}
      </div>
    </div>
  );
}

// ---------- DASHBOARD ----------
export default function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  const [fitbitSyncing, setFitbitSyncing] = useState(false);
  const [fitbitData, setFitbitData] = useState(null);

  // ---------- CONNECT FITBIT ----------
  const connectFitbit = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("User ID missing — login again.");

    const popup = window.open(
      `http://localhost:5000/api/fitbit/auth?userId=${userId}`,
      "fitbitAuth",
      "width=800,height=700"
    );

    if (!popup) return alert("Please allow popups to connect Fitbit.");

    setFitbitSyncing(true);

    const check = setInterval(async () => {
      if (popup.closed) {
        clearInterval(check);
        try {
          const res = await fetch(`http://localhost:5000/api/fitbit/sync`);
          const data = await res.json();

          if (!data || !data.success) {
            alert("Fitbit sync failed");
            setFitbitSyncing(false);
            return;
          }

          setFitbitData(data.data); // this gives 'summary'
          alert("Fitbit synced successfully!");
        } catch (err) {
          console.error("Sync fetch error:", err);
          alert("Fitbit sync failed. Check backend.");
        }

        setFitbitSyncing(false);
      }
    }, 1000);
  };

  // ---------- LOGOUT ----------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  // ---------- LOAD ACTIVITIES ----------
  const loadActivities = useCallback(async () => {
    try {
      const res = await API.get("/activities");
      const list = Array.isArray(res.data) ? res.data : res.data.activities || [];
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setActivities(list);
    } catch {}
  }, []);

  useEffect(() => { loadActivities(); }, [loadActivities]);

  // ---------- CALCULATIONS ----------
  const totalCalories = activities.reduce((s, a) => s + (Number(a.calories) || 0), 0);
  const totalSteps = activities.reduce((s, a) => s + (Number(a.steps) || 0), 0);
  const totalDistance = activities.reduce((s, a) => s + (Number(a.distanceKm) || 0), 0);
  const totalMinutes = activities.reduce((s, a) => s + (Number(a.durationMin) || 0), 0);

  const avgSleep = 6.8;
  const restingHR = 60;

  const recent = activities.slice(0, 6);

  const colors = {
    steps: "#19b86b",
    calories: "#ff4d4f",
    active: "#ffcf56",
    sleep: "#5b8cff",
    hr: "#17d4ff",
    distance: "#4177f6",
  };

  // ---------- DELETE ----------
  const deleteActivity = async (id) => {
    if (!window.confirm("Delete this activity?")) return;
    try {
      await API.delete(`/activities/${id}`);
      loadActivities();
    } catch {}
  };

  return (
    <div className={darkMode ? "dashboard-root premium-dark" : "dashboard-root premium-light"}>
      <header className="dash-topbar">
        <div></div>

        <div className="dash-controls">
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light" : "Dark"}
          </button>

          <button className="fitbit-connect-btn" onClick={connectFitbit}>
            {fitbitSyncing ? "Syncing..." : "Connect Fitbit"}
          </button>
        </div>

        <h1 className="main-title">Fitness Dashboard</h1>

        <button className="logout-btn" onClick={handleLogout}>
          <span className="logout-icon">🚪</span>
          Logout
        </button>
      </header>

      <main className="dashboard-wrapper">
        {/* HERO CARDS */}
        <section className="stats-hero">
          <div className="stats-hero-inner">

            <StatCard
              id="st-cal"
              title="Calories Burned"
              value={fitbitData?.summary?.caloriesOut ?? totalCalories}
              unit="kcal"
              color={colors.calories}
              iconName="calories"
            />

            <StatCard
              id="st-steps"
              title="Steps"
              value={fitbitData?.summary?.steps ?? totalSteps}
              unit="steps"
              color={colors.steps}
              iconName="steps"
            />

            <StatCard
              id="st-distance"
              title="Distance"
              value={((fitbitData?.summary?.distances?.[0]?.distance ?? totalDistance)).toFixed(2)}
              unit="km"
              color={colors.distance}
              iconName="distance"
            />

            <StatCard
              id="st-duration"
              title="Active Minutes"
              value={totalMinutes}
              unit="min"
              color={colors.active}
              iconName="active"
            />

          </div>
        </section>

        {/* ADD ACTIVITY + RIGHT COLUMN */}
        <div className="first-row">
          <div className="card add-activity-card">
            <h2>● Add Activity</h2>
            <AddActivity onAdded={loadActivities} />
          </div>

          {/* RIGHT SIDE */}
          <aside className="right-stats-column card">

            <div className="stat-box">
              <div className="stat-box-row">
                <div className="stat-box-left">
                  <Icon name="distance" color={colors.distance} /> <strong>Distance</strong>
                </div>
                <div className="stat-box-right">
                  <span className="big-num" style={{ color: colors.distance }}>
                    {((fitbitData?.summary?.distances?.[0]?.distance ?? totalDistance)).toFixed(2)}
                  </span>
                  <span className="muted"> km</span>
                </div>
              </div>
            </div>

            {/* HEART RATE - fallback */}
            <div className="stat-box">
              <div className="stat-box-row">
                <div className="stat-box-left">
                  <Icon name="hr" color={colors.hr} /> <strong>Resting HR</strong>
                </div>
                <div className="stat-box-right">
                  <span className="big-num" style={{ color: colors.hr }}>
                    {restingHR}
                  </span>
                  <span className="muted"> bpm</span>
                </div>
              </div>
            </div>

            {/* SLEEP - fallback */}
            <div className="stat-box">
              <div className="stat-box-row">
                <div className="stat-box-left">
                  <Icon name="sleep" color={colors.sleep} /> <strong>Last Night’s Sleep</strong>
                </div>
                <div className="stat-box-right">
                  <span className="big-num" style={{ color: colors.sleep }}>
                    {avgSleep.toFixed(1)}
                  </span>
                  <span className="muted"> hrs</span>
                </div>
              </div>
            </div>

            {/* TOTAL CALORIES */}
            <div className="stat-box">
              <div className="stat-box-row">
                <div className="stat-box-left">
                  <Icon name="calories" color={colors.calories} /> <strong>Total Calories</strong>
                </div>
                <div className="stat-box-right">
                  <span className="big-num" style={{ color: colors.calories }}>
                    {totalCalories}
                  </span>
                  <span className="muted"> kcal</span>
                </div>
              </div>
            </div>

          </aside>
        </div>

        {/* WEEKLY CHART + RECENT */}
        <div className="row-equal">
          <div className="card big-chart">
            <h3>Weekly Activity</h3>
            <ActivityChart activities={activities} />
          </div>

          <div className="card neon-recent-card">
            <div className="neon-recent-title">Recent Workouts</div>
            <div className="neon-recent-list">
              {recent.length === 0 ? (
                <div className="neon-empty">No workouts logged</div>
              ) : (
                recent.map(a => (
                  <div key={a._id} className="neon-recent-item">
                    <div className="neon-left">
                      <div className="neon-icon">
                        <Icon
                          name={
                            a.type.toLowerCase().includes("run")
                              ? "steps"
                              : a.type.toLowerCase().includes("yoga")
                                ? "sleep"
                                : "active"
                          }
                          color={colors.steps}
                        />
                      </div>
                      <div>
                        <div className="neon-type">{a.type}</div>
                        <div className="neon-meta">{a.durationMin} min • {a.intensity}</div>
                      </div>
                    </div>

                    <div className="neon-right">
                      <div className="neon-cal">{a.calories} kcal</div>
                      <button className="delete-btn" onClick={() => deleteActivity(a._id)}>
                        <Icon name="trash" color="#fff" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* CHARTS */}
        <div className="two-charts equal-row" style={{ marginTop: 18 }}>
          <div className="card small-chart">
            <h3>Steps vs Calories</h3>
            <BarChart activities={activities} />
          </div>

          <div className="card small-chart">
            <h3>Activity Type Distribution</h3>
            <PieChart activities={activities} />
          </div>
        </div>

        {/* ACTIVITY TABLE */}
        <div className="card table-card" style={{ marginTop: 18 }}>
          <h3>Your Activities</h3>
          <ActivityTable activities={activities} />
        </div>

        {/* AI COACH */}
        <div className="ai-coach-bar" style={{ marginTop: 28 }}>
          <div className="ai-text">
            Keep going champ! Stay hydrated and avoid late-night heavy meals.
          </div>
          <button className="tip-btn" onClick={() => alert("Tip: Try a 10-minute walk later!")}>
            New Tip
          </button>
        </div>

      </main>
    </div>
  );
}
