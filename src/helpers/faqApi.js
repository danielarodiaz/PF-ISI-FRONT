import axios from "axios";
import { CHATBOT_URL } from "./config";
import { createServiceError, SERVICE_ERROR_CODES } from "./serviceErrors";

const API_BASE_URL = CHATBOT_URL;

export const getFaqs = async () => {
  try {
    if (!API_BASE_URL) {
      throw createServiceError(
        SERVICE_ERROR_CODES.CONFIG_MISSING,
        "El servicio de FAQ no está configurado (VITE_CHATBOT_URL)."
      );
    }

    const response = await axios.get(`${API_BASE_URL}/faq/`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener faqs:", error);
    if (error?.code === SERVICE_ERROR_CODES.CONFIG_MISSING) {
      throw error;
    }
    throw createServiceError(
      SERVICE_ERROR_CODES.SERVICE_UNAVAILABLE,
      "El servicio de FAQ no está disponible.",
      error
    );
  }
};
