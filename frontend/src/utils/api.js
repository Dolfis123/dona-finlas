import axios from "axios";

// Mengambil URL dari .env (VITE_API_BASE_URL)
// Jika tidak ada (mode development di laptop), dia akan pakai localhost:8000
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  // Opsional: Menangani token jika ada sistem login
  // withCredentials: true, 
});

// Interceptor (Opsional): Untuk menangani jika token expired atau error global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export default api;