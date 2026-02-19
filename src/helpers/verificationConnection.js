import axios from "axios";
import { toast } from "react-toastify";
import { CHATBOT_URL } from "./config";
const API_BASE_URL = CHATBOT_URL;

export const verificarConexionChat = async () => {
  try {
    // Health endpoint canónico del chatbot.
    const response = await axios.get(`${API_BASE_URL}/health`);
    if (response.status === 200) {
      console.log("El chatbot está en línea.");
    }
  } catch {
    // Muestra el toast si hay un error (el servidor no está disponible)
    toast.error("El chatbot no está disponible. Por favor, intenta más tarde.");
  }
};
