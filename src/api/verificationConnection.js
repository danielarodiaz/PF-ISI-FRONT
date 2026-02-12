import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL_CHATBOT } from "../config/api";

export const verificarConexionChat = async () => {
  try {
    // Realiza la solicitud GET al endpoint /chatbot/ping
    const response = await axios.get(`${API_BASE_URL_CHATBOT}/chatbot/ping`);
    if (response.status === 200) {
      console.log("El chatbot está en línea.");
    }
  } catch (error) {
    // Muestra el toast si hay un error (el servidor no está disponible)
    toast.error("El chatbot no está disponible. Por favor, intenta más tarde.");
  }
};
