import axios from "axios";
import { CHATBOT_URL } from "./config";
import { createServiceError, SERVICE_ERROR_CODES } from "./serviceErrors";
const API_BASE_URL = CHATBOT_URL;

const ensureChatbotConfigured = () => {
  if (!API_BASE_URL) {
    throw createServiceError(
      SERVICE_ERROR_CODES.CONFIG_MISSING,
      "El servicio del asistente no está configurado (VITE_CHATBOT_URL)."
    );
  }
};

// Función para enviar un mensaje al chatbot
export const sendMessageToChatbot = async (message, historial = []) => {
  try {
    ensureChatbotConfigured();
    const response = await axios.post(
      `${API_BASE_URL}/chatbot/`,
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
    if (error?.code === SERVICE_ERROR_CODES.CONFIG_MISSING) {
      throw error;
    }
    throw createServiceError(
      SERVICE_ERROR_CODES.SERVICE_UNAVAILABLE,
      "El servicio del asistente no está disponible.",
      error
    );
  }
};
