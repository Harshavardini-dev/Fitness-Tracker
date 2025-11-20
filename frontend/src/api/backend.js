// frontend/src/api/backend.js
import axios from "axios";

const BACKEND = axios.create({
  baseURL: "http://localhost:5000/api", // <-- backend root
  withCredentials: false,
});

BACKEND.interceptors.request.use((req) => {
  const token = localStorage.getItem("token"); // if you use auth tokens
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default BACKEND;
