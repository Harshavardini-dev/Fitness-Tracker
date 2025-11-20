import React from "react";

function Navbar({ onLogout, onToggleDark }) {
  return (
    <nav className="navbar">
      <div className="nav-title">Fitness Tracker</div>

      <div className="nav-actions">
        <button className="toggle-btn" onClick={onToggleDark}>🌙</button>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
