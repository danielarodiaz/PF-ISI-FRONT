import axios from "axios";
import { clearAuthTokens, getAccessToken, getRefreshToken, saveAuthTokens } from "../helpers/authStorage";

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
    const token = getAccessToken();
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
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest?._retry &&
      !String(originalRequest?.url || "").includes("/api/Autenticacion/Refresh")
    ) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/api/Autenticacion/Refresh`, { refreshToken });
          if (response?.data?.token) {
            saveAuthTokens(response.data);
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            return api(originalRequest);
          }
        } catch {
          // fallback to local logout
        }
      }

      clearAuthTokens();
      window.location.href = "/loginAdmin";
    }
    return Promise.reject(error);
  }
);

export default api;
