// src/api/fyda.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: `${BASE_URL}/api/fayda`, // ✅ matches backend route
  withCredentials: true,
});

// Add token if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
