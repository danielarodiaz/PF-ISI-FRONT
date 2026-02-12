import axios from "axios";
import { API_BASE_URL_CHATBOT } from "../config/api";

// Función para enviar un mensaje al chatbot
export const sendMessageToChatbot = async (message, historial = []) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL_CHATBOT}/chatbot/`,
      {
        historial: historial, // Array con mensajes previos
        mensaje: message, // Mensaje actual
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Retorna la respuesta del servidor
  } catch (error) {
    console.error("Error al enviar un mensaje al chatbot:", error);
    throw error;
  }
};
