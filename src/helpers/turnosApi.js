import axios from "axios";

//const API_BASE_URL = "https://lucasdepetris.duckdns.org:8080";
const API_BASE_URL = "http://localhost:5132";

export const getTurnos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/Turno/ObtenerTurnos`);
    return response.data;
  } catch (error) {
    console.error("Error fetching turnos:", error);
    throw error;
  }
};
