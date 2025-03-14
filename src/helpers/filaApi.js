import axios from "axios";

//const API_BASE_URL = "https://lucasdepetris.duckdns.org:8080";
const API_BASE_URL = "http://localhost:5132";

export const getTurnos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/turnos`);
    return response.data;
  } catch (error) {
    console.error("Error fetching turnos:", error);
    throw error;
  }
};

export const getTurnoById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/turnos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching turno with id ${id}:`, error);
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

//export const personasDelanteEnLaFila
