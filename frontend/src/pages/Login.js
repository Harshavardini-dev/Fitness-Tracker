// src/pages/Login.js
import React, { useState } from "react";
import API from "../api";

export default function Login({ onLogin, goToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });

      // save JWT & user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("userId", res.data.user._id); // ⭐ IMPORTANT

      // login OK → move to dashboard
      if (onLogin) onLogin(res.data.token);

      window.location.href = "/dashboard";  // ⭐ REDIRECT FIX
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Welcome Back 👋</h2>
        <p className="login-sub">Login to Fitness Tracker</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-input-box">
            <span className="login-icon">📧</span>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-input-box">
            <span className="login-icon">🔒</span>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>

        <p className="login-switch" onClick={goToRegister}>
          Don’t have an account? <span>Create one</span>
        </p>
      </div>
    </div>
  );
}
