import axios from "axios";

// Usamos variables de entorno para que sea facil cambiar entre Local y Prod
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5132";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Antes de cada petición, inyecta el token si existe
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

// Interceptor: Si la API devuelve 401 (No autorizado), limpia la sesión
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/loginAdmin"; // O usa un evento para redirigir
    }
    return Promise.reject(error);
  }
);

export default api;