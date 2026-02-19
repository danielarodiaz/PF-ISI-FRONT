import axios from "axios";
import { BACKEND_URL } from "./config";
import { clearAuthTokens, getAccessToken, getRefreshToken, saveAuthTokens } from "./authStorage";

const API_BASE_URL = BACKEND_URL;

export const LogIn = async (user, password) => {
  const response = await axios.post(`${API_BASE_URL}/api/Autenticacion/LogIn`, {
    user,
    password,
  }, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const verificarToken = async (token) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/Autenticacion/ValidarToken`,
    JSON.stringify(token),
    {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    }
  );
  return Boolean(response?.data?.valid);
};

export const refrescarSesion = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await axios.post(`${API_BASE_URL}/api/Autenticacion/Refresh`, {
      refreshToken,
    });
    if (response?.data?.token) {
      saveAuthTokens(response.data);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const cerrarSesion = async () => {
  const token = getAccessToken();
  if (!token) return;

  try {
    await axios.post(
      `${API_BASE_URL}/api/Autenticacion/Logout`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch {
    // no-op: al cerrar sesión del cliente igual se deben limpiar tokens
  }
};

export const cerrarSesionLocal = () => {
  clearAuthTokens();
};
