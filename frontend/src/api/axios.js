import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

console.log("🌍 Axios BASE_URL:", BASE_URL);

const api = axios.create({
  baseURL: `${BASE_URL}/api`, // ✅ no double slashes
  withCredentials: true,
});

// Token interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
