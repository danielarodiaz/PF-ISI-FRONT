import axios from 'axios';

// Asegúrate de que este puerto sea el mismo que usa tu .NET (ej: 7122, 5173, etc)
const baseURL = 'http://localhost:5132/api'; 

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