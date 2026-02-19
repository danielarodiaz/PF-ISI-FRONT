import axios from "axios";
import { CHATBOT_URL } from "./config";
import { SERVICE_ERROR_CODES } from "./serviceErrors";
const API_BASE_URL = CHATBOT_URL;

export const verificarConexionChat = async () => {
  if (!API_BASE_URL) {
    return { ok: false, reason: SERVICE_ERROR_CODES.CONFIG_MISSING };
  }

  try {
    // Health endpoint canónico del chatbot.
    const response = await axios.get(`${API_BASE_URL}/health`);
    if (response.status === 200) {
      console.log("El chatbot está en línea.");
      return { ok: true };
    }
    return { ok: false, reason: SERVICE_ERROR_CODES.SERVICE_UNAVAILABLE };
  } catch {
    return { ok: false, reason: SERVICE_ERROR_CODES.SERVICE_UNAVAILABLE };
  }
};
