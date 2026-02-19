import axios from "axios";
import { CHATBOT_URL } from "./config";
import { createServiceError, SERVICE_ERROR_CODES } from "./serviceErrors";

const API_BASE_URL = CHATBOT_URL;

const ensureConfiguredBaseUrl = () => {
  if (!API_BASE_URL) {
    throw createServiceError(
      SERVICE_ERROR_CODES.CONFIG_MISSING,
      "El servicio de FAQ no está configurado (VITE_CHATBOT_URL)."
    );
  }
};

const toServiceError = (defaultMessage, error) => {
  if (error?.code === SERVICE_ERROR_CODES.CONFIG_MISSING) {
    return error;
  }

  const status = error?.response?.status;
  const detail = error?.response?.data?.detail;
  const message = detail || defaultMessage;

  if (status === 400) {
    return createServiceError(SERVICE_ERROR_CODES.BAD_REQUEST, message, error);
  }

  if (status === 429) {
    return createServiceError(SERVICE_ERROR_CODES.TOO_MANY_REQUESTS, message, error);
  }

  return createServiceError(
    SERVICE_ERROR_CODES.SERVICE_UNAVAILABLE,
    message,
    error
  );
};

export const getFaqs = async () => {
  try {
    ensureConfiguredBaseUrl();

    const response = await axios.get(`${API_BASE_URL}/faq/`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener faqs:", error);
    throw toServiceError("El servicio de FAQ no está disponible.", error);
  }
};

export const postFaq = async (data) => {
  try {
    ensureConfiguredBaseUrl();
    const response = await axios.post(`${API_BASE_URL}/faq/`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear faq:", error);
    throw toServiceError("No se pudo crear la FAQ.", error);
  }
};

export const putFaq = async (id, data) => {
  try {
    ensureConfiguredBaseUrl();
    const response = await axios.put(`${API_BASE_URL}/faq/${id}/`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar faq:", error);
    throw toServiceError("No se pudo actualizar la FAQ.", error);
  }
};

export const deleteFaq = async (id) => {
  try {
    ensureConfiguredBaseUrl();
    await axios.delete(`${API_BASE_URL}/faq/${id}/`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al eliminar faq:", error);
    throw toServiceError("No se pudo eliminar la FAQ.", error);
  }
};
