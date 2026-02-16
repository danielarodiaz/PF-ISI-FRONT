import axios from 'axios';
import { BACKEND_URL } from "./config";

const baseURL = BACKEND_URL + '/api'; 

export const getDatosReportes = async () => {
  try {
    const token = localStorage.getItem("token");
    
    // Usamos el endpoint de Turnos para obtener el historial completo
    const response = await axios.get(`${baseURL}/Turno/ObtenerTurnos`, {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    });
    
    return response.data; // Devuelve el array de turnos
  } catch (error) {
    console.error("Error en getDatosReportes:", error);
    return [];
  }
};