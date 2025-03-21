import axios from "axios";

//const API_BASE_URL = "https://lucasdepetris.duckdns.org:8080";
const API_BASE_URL = "http://localhost:5132";


export const getFila = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/api/Fila/ObtenerFila`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching fila:", error);
    throw error;
  }
};


export const getTurnos = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/turnos` , {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
      params: { idTurno: idTurno }
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching turno with id ${idTurno}:`, error);
    throw error;
  }
};

export const createTurno = async (turnoData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/turnos`, turnoData);
    return response.data;
  } catch (error) {
    console.error("Error creating turno:", error);
    throw error;
  }
};

export const updateTurno = async (id, turnoData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/turnos/${id}`, turnoData);
    return response.data;
  } catch (error) {
    console.error(`Error updating turno with id ${id}:`, error);
    throw error;
  }
};

export const deleteTurno = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/turnos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting turno with id ${id}:`, error);
    throw error;
  }
};

export const getTramites = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/tramite`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tramites:", error);
    throw error;
  }
};

export const postTurnoEnFila = async (legajo, idTramite) => {
  try {
    const turnoData = {
      legajo: legajo,
      idTramite: idTramite
    };
    const response = await axios.post(`${API_BASE_URL}/api/fila/agregarturnoafila`, turnoData);
    return response.data;
  } catch (error) {
    console.error("Error posting turno:", error);
    throw error;
  }
};

export const personasAdelanteEnLaFila = async (idTurno) => {
  if (!idTurno) {
    throw new Error("numeroTurno is required");
  }

  try {
    const url = `${API_BASE_URL}/api/Fila/ObtenerCantidadDePersonasAdelante`;
    //console.log("Request URL:", url);
    //console.log("Request Params:", { idTurno });

    const response = await axios.get(url, {
      params: { idTurno: idTurno }
    });
    //console.log("Response Data:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching personas delante en la fila:", error);
    throw error;
  }
};

export const atenderTurnoConId = async (idTurno) => {
  if (!idTurno) {
    throw new Error("numeroTurno is required");
  }

  try {
    const token = localStorage.getItem("token");
    //console.log("Token:", token);
    const url = `${API_BASE_URL}/api/Fila/${idTurno}/atender`;
    const response = await axios.put(url, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const putFinalizarAtencion = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_BASE_URL}/api/fila/finalizaratencion`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching put finalizar atencion:", error);
    throw error;
  }
};

