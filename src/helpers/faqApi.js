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
/* ---------------------TODO: ANALIZAR DE AGREGAR CON LE DB DE LUCAS--------
import axios from 'axios';

const baseURL = 'http://localhost:7122/api/Faq'; // Ajusta la URL a tu controlador de FAQs

// Obtener todas
export const getFaqs = async () => {
  const response = await axios.get(`${baseURL}`);
  return response.data;
};

// Crear nueva
export const postFaq = async (data) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${baseURL}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Editar existente
export const putFaq = async (id, data) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${baseURL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Eliminar
export const deleteFaq = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${baseURL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
*/