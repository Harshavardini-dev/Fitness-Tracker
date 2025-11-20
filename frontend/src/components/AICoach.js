// src/components/AICoach.js
import React, { useMemo, useState } from "react";

export default function AICoach({ activities }) {
  const [extraTip, setExtraTip] = useState("");

  const quickTips = [
    "Stay hydrated — drink a glass of water now 💧",
    "5-minute stretching improves recovery 🧘‍♂️",
    "Walk 10 minutes after meals to improve digestion 🚶‍♂️",
    "Great progress — stay consistent! 🔥",
    "Take deep breaths to reduce stress 😮‍💨",
    "A light warm-up prevents injuries 💪",
    "Avoid heavy food late at night 🌙",
  ];

  const giveNewTip = () => {
    const tip = quickTips[Math.floor(Math.random() * quickTips.length)];
    setExtraTip(tip);
  };

  // Get most recent activity
  const recent = useMemo(() => {
    if (!activities?.length) return null;
    return [...activities].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];
  }, [activities]);

  // Rule-based suggestions
  const suggestion = useMemo(() => {
    if (!recent) {
      return {
        title: "No recent activity",
        summary: "Add an activity to get personalized suggestions.",
        recovery: ["Light walk today", "Drink enough water"],
        food: ["Balanced meal with protein & veggies"],
        nextWorkout: ["20–30 min light cardio"],
      };
    }

    const { type, durationMin, calories, intensity } = recent;

    let recovery = [];
    let food = [];
    let nextWorkout = [];

    // If activity was intense
    if (calories > 400 || intensity === "High") {
      recovery.push("Take rest or active recovery today");
      recovery.push("Stretch for 8–10 minutes");
      food.push("Eat protein + carbs (chicken + rice)");
      food.push("Drink 500–800ml water");
      nextWorkout.push("Try a 20–25 min light workout tomorrow");
    }

    // If activity was moderate
    else if (calories > 200) {
      recovery.push("Light stretching recommended");
      food.push("Eat a fruit or yogurt");
      nextWorkout.push("Increase duration by 5 minutes next time");
    }

    // If light
    else {
      recovery.push("Good job! Keep moving lightly today");
      food.push("Have a balanced snack");
      nextWorkout.push("Try a 20–30 min walk/run");
    }

    return {
      title: `Based on your recent ${type}`,
      summary: `You burned ${calories} kcal in ${durationMin} minutes.`,
      recovery,
      food,
      nextWorkout,
    };
  }, [recent]);

  return (
    <div className="card ai-card">
      <h3>AI Fitness Coach</h3>

      <p className="ai-summary">{suggestion.summary}</p>

      <h4>Recovery</h4>
      <ul>
        {suggestion.recovery.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>

      <h4>Food Suggestions</h4>
      <ul>
        {suggestion.food.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>

      <h4>Next Workout</h4>
      <ul>
        {suggestion.nextWorkout.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>

      {extraTip && (
        <p className="extra-tip">
          <strong>Tip:</strong> {extraTip}
        </p>
      )}

      <button className="tip-btn" onClick={giveNewTip}>
        New Tip
      </button>
    </div>
  );
}
