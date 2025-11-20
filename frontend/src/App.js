import React, { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./styles.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [page, setPage] = useState("login"); // ← controls login/register

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setPage("login");
  };

  // 1️⃣ No token → show login or register
  if (!token) {
    if (page === "register") {
      return <Register goToLogin={() => setPage("login")} />;
    }

    return (
      <Login
        onLogin={(newToken) => {
          setToken(newToken);
          setPage("dashboard");
        }}
        goToRegister={() => setPage("register")}
      />
    );
  }

  // 2️⃣ Token exists → show dashboard
  return <Dashboard onLogout={handleLogout} />;
}

export default App;
