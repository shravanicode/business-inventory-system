// src/api/client.ts
import axios from "axios";

const baseURL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, "") ||
  "https://inventory-backend-lnk0.onrender.com/";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

export default api;
