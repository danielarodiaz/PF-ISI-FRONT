import axios from "axios";

const API_BASE_URL = "https://lucasdepetris.duckdns.org:8080";

export const verificarConexion = async () => {
  try {
    // Realiza la solicitud GET al endpoint /chatbot/ping
    const response = await axios.get(`${API_BASE_URL}/chatbot/ping`);
    if (response.status === 200) {
      console.log("El chatbot está en línea.");
    }
  } catch (error) {
    // Muestra el toast si hay un error (el servidor no está disponible)
    toast.error("El chatbot no está disponible. Por favor, intenta más tarde.");
  }
};

// Función para enviar un mensaje al chatbot
export const sendMessageToChatbot = async (message, historial = []) => {
  try {
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
    throw error;
  }
};
