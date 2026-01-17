import axios from "axios";

// Mengambil URL dari .env. Jika tidak ada (mode dev), fallback ke localhost
const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;