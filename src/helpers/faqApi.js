import axios from "axios";
import { CHATBOT_URL } from "./config";

const API_BASE_URL = CHATBOT_URL;

export const getFaqs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/faq/`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener faqs:", error);
    throw error;
  }
};
