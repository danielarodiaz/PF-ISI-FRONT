import axios from "axios";
import { API_BASE_URL_CORE } from "../config/api";

export const getTurnos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL_CORE}/api/Turno/ObtenerTurnos`);
    return response.data;
  } catch (error) {
    console.error("Error fetching turnos:", error);
    throw error;
  }
};
