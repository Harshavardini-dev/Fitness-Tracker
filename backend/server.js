require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// ROUTES
const fitbitRoutes = require("./routes/fitbit");
const fitbitDataRoutes = require("./routes/fitbitData");
const authRoutes = require("./routes/auth");
const activityRoutes = require("./routes/activities");
const userRoutes = require("./routes/users");


// INIT APP
const app = express();
connectDB();

// MIDDLEWARE
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// HEALTH CHECK
app.get("/", (req, res) => res.send("Fitness Tracker API running"));
app.get("/api/health", (req, res) =>
  res.json({ status: "OK", message: "Backend is running" })
);

// API ROUTES
app.use("/api/fitbit", fitbitRoutes);          // Authentication + callback
app.use("/api/fitbit-data", fitbitDataRoutes); // Fitbit data sync
app.use("/api/auth", authRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/users", userRoutes);


// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
