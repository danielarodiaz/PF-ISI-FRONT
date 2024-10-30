import axios from "axios";

const API_BASE_URL = "https://lucasdepetris.duckdns.org:8080";

export const getFaqs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/faq`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener faqs:", error);
    // Agrega un log aquí para debuggear
    console.log("Error en la solicitud de faqs:", error);
    throw error;
  }
};
