import axios from "axios";

// ✅ CONFIRMADO: Puerto 5132
const API_BASE_URL = "http://localhost:5132"; 

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
    const turnoData = {
      legajo: legajo,
      idTramite: idTramite
    };
    const response = await axios.post(`${API_BASE_URL}/api/Fila/AgregarTurnoAFila`, turnoData);
    return response.data;
  } catch (error) {
    console.error("Error posting turno:", error);
    throw error;
  }
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

export const atenderTurnoConId = async (idTurno) => {
  if (!idTurno) throw new Error("idTurno is required");

  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_BASE_URL}/api/Fila/${idTurno}/atender`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
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


// --- TRAMITES ---
export const getTramites = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/Tramite`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tramites:", error);
    throw error;
  }
};