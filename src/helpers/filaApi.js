import axios from "axios";
import { BACKEND_URL } from "./config";
import { createServiceError, SERVICE_ERROR_CODES } from "./serviceErrors";

const API_BASE_URL = BACKEND_URL;

const ensureBackendConfigured = () => {
  if (!API_BASE_URL) {
    throw createServiceError(
      SERVICE_ERROR_CODES.CONFIG_MISSING,
      "El servicio de turnos no está configurado (VITE_API_URL)."
    );
  }
};
 
// --- REPORTES (DASHBOARD) ---
export const getDatosReportes = async () => {
  try {
    const token = localStorage.getItem("token");
    // Endpoint que trae el historial completo
    const response = await axios.get(`${API_BASE_URL}/api/Turno/ObtenerTurnos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("📊 Datos recibidos para reportes:", response.data); 
    return response.data;
  } catch (error) {
    console.error("Error obteniendo datos para reportes:", error);
    return [];
  }
};

// --- FILA ---
export const getFila = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/api/Fila/ObtenerFila`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching fila:", error);
    throw error;
  }
};

export const postTurnoEnFila = async (legajo, idTramite) => {
  try {
    ensureBackendConfigured();
    const turnoData = {
      legajo: legajo,
      idTramite: idTramite
    };
    const response = await axios.post(`${API_BASE_URL}/api/Fila/AgregarTurnoAFila`, turnoData);
    return response.data;
  } catch (error) {
    console.error("Error posting turno:", error);
    if (error?.code === SERVICE_ERROR_CODES.CONFIG_MISSING) {
      throw error;
    }
    const backendMessage = error?.response?.data;
    if (typeof backendMessage === "string" && backendMessage.trim().length > 0) {
      throw new Error(backendMessage);
    }
    throw createServiceError(
      SERVICE_ERROR_CODES.SERVICE_UNAVAILABLE,
      "El servicio de turnos no está disponible.",
      error
    );
  }
};

export const validarLegajoDisponible = async (legajo) => {
  ensureBackendConfigured();
  const response = await axios.get(`${API_BASE_URL}/api/Fila/ValidarLegajoDisponible`, {
    params: { legajo },
  });
  return response.data;
};

export const personasAdelanteEnLaFila = async (idTurno) => {
  if (!idTurno) throw new Error("idTurno is required");

  try {
    const response = await axios.get(`${API_BASE_URL}/api/Fila/ObtenerCantidadDePersonasAdelante`, {
      params: { idTurno: idTurno }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching personas delante:", error);
    throw error;
  }
};

export const personasAdelantePorToken = async (publicToken) => {
  if (!publicToken) throw new Error("publicToken is required");

  try {
    const response = await axios.get(`${API_BASE_URL}/api/Fila/ObtenerCantidadDePersonasAdelantePorToken`, {
      params: { publicToken }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching personas por token:", error);
    throw error;
  }
};

export const atenderTurnoConId = async (idTurno) => {
  if (!idTurno) throw new Error("idTurno is required");

  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_BASE_URL}/api/Fila/${idTurno}/atender`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const putFinalizarAtencion = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_BASE_URL}/api/Fila/finalizarAtencion`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error finalizing atencion:", error);
    throw error;
  }
};

export const cancelarTurno = async (idTurno) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/Fila/${idTurno}/cancelar`);
    return response.data;
  } catch (error) {
    console.error(`Error cancelando turno ${idTurno}:`, error);
    throw error;
  }
};

export const cancelarTurnoPorToken = async (publicToken) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/Fila/cancelar-por-token`, {
      publicToken,
    });
    return response.data;
  } catch (error) {
    console.error("Error cancelando turno por token:", error);
    throw error;
  }
};
// --- TURNOS (Individuales) ---
export const getTurnos = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/api/Turno/ObtenerTurnos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching turnos:", error);
    throw error;
  }
};

export const getTurnoById = async (idTurno) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/api/Turno/ObtenerTurnoByID`, {
      params: { idTurno: idTurno },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching turno with id ${idTurno}:`, error);
    throw error;
  }
};

export const getTurnoActivoPorToken = async (publicToken) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/Turno/ObtenerTurnoActivo`, {
      params: { publicToken },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching turno por token:", error);
    throw error;
  }
};
export const getTurnoEnVentanilla = async () => {
  const resp = await axios.get(`${API_BASE_URL}/api/Fila/TurnoEnVentanilla`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return resp.data;
};
// --- WhatsApp ---
export const registrarTelefonoEnTurno = async (idTurno, telefono) => {
  try {
      // Usamos PUT porque estamos actualizando un recurso (el Turno) que ya existe
      const response = await axios.put(`${API_BASE_URL}/api/Fila/RegistrarTelefono`, {
          idTurno: idTurno,
          telefono: telefono
      });
      return response.data;
  } catch (error) {
      console.error("Error en registrarTelefonoEnTurno:", error);
      throw error;
  }
};

export const registrarTelefonoEnTurnoPorToken = async (publicToken, telefono) => {
  try {
      const response = await axios.put(`${API_BASE_URL}/api/Fila/RegistrarTelefono`, {
          publicToken,
          telefono
      });
      return response.data;
  } catch (error) {
      console.error("Error en registrarTelefonoEnTurnoPorToken:", error);
      throw error;
  }
};


// --- TRAMITES ---
export const getTramites = async () => {
  try {
    ensureBackendConfigured();
    const response = await axios.get(`${API_BASE_URL}/api/Tramite`);
    if (!Array.isArray(response.data)) {
      throw createServiceError(
        SERVICE_ERROR_CODES.SERVICE_UNAVAILABLE,
        "Formato de respuesta inválido para trámites."
      );
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching tramites:", error);
    if (error?.code === SERVICE_ERROR_CODES.CONFIG_MISSING) {
      throw error;
    }
    throw createServiceError(
      SERVICE_ERROR_CODES.SERVICE_UNAVAILABLE,
      "El servicio de turnos no está disponible.",
      error
    );
  }
};
