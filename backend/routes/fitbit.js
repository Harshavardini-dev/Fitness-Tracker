const express = require("express");
const axios = require("axios");
const qs = require("querystring");
const User = require("../models/User");

const router = express.Router();

const CLIENT_ID = process.env.FITBIT_CLIENT_ID;
const CLIENT_SECRET = process.env.FITBIT_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:5000/api/fitbit/callback";

// =========================
// 1) START AUTH
// =========================
router.get("/auth", (req, res) => {
  const authUrl =
    "https://www.fitbit.com/oauth2/authorize?" +
    qs.stringify({
      client_id: CLIENT_ID,
      response_type: "code",
      scope: "activity heartrate nutrition sleep",
      redirect_uri: REDIRECT_URI,
    });

  res.redirect(authUrl);
});

// =========================
// 2) CALLBACK — EXCHANGE CODE
// =========================
router.get("/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const tokenUrl = "https://api.fitbit.com/oauth2/token";
    const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

    const body = {
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    };

    const tokenRes = await axios.post(tokenUrl, qs.stringify(body), {
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = tokenRes.data;

    const expiresAt = new Date(Date.now() + data.expires_in * 1000);

    // Save to ANY user (for now)
    let user = await User.findOne();
    if (!user) return res.send("No user in DB — register a user first!");

    user.fitbit = {
      isConnected: true,
      userId: data.user_id,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      tokenExpiresAt: expiresAt,
    };

    await user.save();

    res.send(`
      <h2>Fitbit connected ✔️</h2>
      <pre>${JSON.stringify(data, null, 2)}</pre>
      <p>Close this window and return to your app.</p>
    `);
  } catch (err) {
    console.error("FITBIT CALLBACK ERR:", err.response?.data || err);
    res.status(500).send("OAuth Failed");
  }
});

// =========================
// 3) SYNC LATEST DATA
// =========================
router.get("/sync", async (req, res) => {
  try {
    let user = await User.findOne();

    if (!user || !user.fitbit?.accessToken)
      return res.status(400).json({ error: "Fitbit not connected" });

    const token = user.fitbit.accessToken;
    const fitbitUserId = user.fitbit.userId;

    const today = new Date().toISOString().split("T")[0];

    const summary = await axios.get(
      `https://api.fitbit.com/1/user/${fitbitUserId}/activities/date/${today}.json`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json({ success: true, data: summary.data });
  } catch (err) {
    console.error("FITBIT SYNC ERROR:", err.response?.data || err);
    res.status(500).json({ error: "Fitbit sync failed" });
  }
});

module.exports = router;
