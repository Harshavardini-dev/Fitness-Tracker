// src/pages/Register.js
import React, { useState } from "react";
import API from "../api";

export default function Register({ goToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", {
        username: name,
        email,
        password,
      });

      alert("Account created! Please login.");
      goToLogin();

    } catch (err) {
      console.error(err);
      alert("Registration failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Create Account</h2>
        <p className="login-sub">Join the Fitness Tracker</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-input-box">
            <span className="login-icon">👤</span>
            <input
              type="text"
              placeholder="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
            Register
          </button>
        </form>

        <p className="login-switch" onClick={goToLogin}>
          Already have an account? <span>Login</span>
        </p>
      </div>
    </div>
  );
}
