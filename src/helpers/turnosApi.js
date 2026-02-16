import axios from "axios";
import { BACKEND_URL } from "./config";
const API_BASE_URL = BACKEND_URL;

export const getTurnos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/Turno/ObtenerTurnos`);
    return response.data;
  } catch (error) {
    console.error("Error fetching turnos:", error);
    throw error;
  }
};
