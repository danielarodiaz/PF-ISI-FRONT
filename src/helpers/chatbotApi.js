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
export const sendMessageToChatbot = async (message, historial = [], conversationId = null) => {
  try {
    ensureChatbotConfigured();
    const response = await axios.post(
      `${API_BASE_URL}/chatbot/`,
      {
        historial: historial, // Array con mensajes previos
        mensaje: message, // Mensaje actual
        conversation_id: conversationId,
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
    if (error?.response?.status === 400) {
      const detail = error?.response?.data?.detail || "Solicitud inválida al asistente.";
      throw createServiceError(SERVICE_ERROR_CODES.BAD_REQUEST, detail, error);
    }
    if (error?.response?.status === 429) {
      const detail = error?.response?.data?.detail || "Demasiadas solicitudes al asistente. Intenta más tarde.";
      throw createServiceError(SERVICE_ERROR_CODES.TOO_MANY_REQUESTS, detail, error);
    }
    throw createServiceError(
      SERVICE_ERROR_CODES.SERVICE_UNAVAILABLE,
      "El servicio del asistente no está disponible.",
      error
    );
  }
};

export const sendMessageToChatbotStream = async (
  message,
  historial = [],
  conversationId = null,
  { onToken, onMetadata } = {}
) => {
  try {
    ensureChatbotConfigured();

    const response = await fetch(`${API_BASE_URL}/chatbot/messages/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        historial,
        mensaje: message,
        conversation_id: conversationId,
      }),
    });

    if (!response.ok || !response.body) {
      let detail = "El servicio del asistente no está disponible.";
      try {
        const errorPayload = await response.json();
        if (typeof errorPayload?.detail === "string" && errorPayload.detail.trim()) {
          detail = errorPayload.detail.trim();
        }
      } catch {
        // keep default detail
      }

      if (response.status === 400) {
        throw createServiceError(SERVICE_ERROR_CODES.BAD_REQUEST, detail);
      }
      if (response.status === 429) {
        throw createServiceError(SERVICE_ERROR_CODES.TOO_MANY_REQUESTS, detail);
      }
      throw createServiceError(
        SERVICE_ERROR_CODES.SERVICE_UNAVAILABLE,
        detail
      );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let answer = "";
    let metadata = {};

    const parseEvent = (rawEvent) => {
      const lines = rawEvent.split("\n");
      let eventName = "message";
      const dataLines = [];

      lines.forEach((line) => {
        if (line.startsWith("event:")) {
          eventName = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
          dataLines.push(line.slice(5).trim());
        }
      });

      const dataText = dataLines.join("\n");
      let data = {};
      if (dataText) {
        try {
          data = JSON.parse(dataText);
        } catch {
          data = {};
        }
      }

      return { eventName, data };
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const rawEvents = buffer.split("\n\n");
      buffer = rawEvents.pop() || "";

      rawEvents.forEach((rawEvent) => {
        const { eventName, data } = parseEvent(rawEvent);
        if (eventName === "token") {
          const tokenText = data?.text || "";
          answer += tokenText;
          if (onToken) onToken(answer);
          return;
        }

        if (eventName === "metadata") {
          metadata = data || {};
          if (onMetadata) onMetadata(metadata);
          return;
        }

        if (eventName === "error") {
          throw createServiceError(
            SERVICE_ERROR_CODES.SERVICE_UNAVAILABLE,
            data?.detail || "El servicio del asistente no está disponible."
          );
        }
      });
    }

    return {
      conversation_id: metadata?.conversation_id || conversationId,
      respuesta_bot: answer.trim(),
      sources: metadata?.sources || [],
      latency_ms: metadata?.latency_ms,
      retrieval_ms: metadata?.retrieval_ms,
      inference_ms: metadata?.inference_ms,
    };
  } catch (error) {
    console.error("Error al enviar mensaje por SSE al chatbot:", error);
    if (error?.code === SERVICE_ERROR_CODES.CONFIG_MISSING) {
      throw error;
    }
    if (error?.code === SERVICE_ERROR_CODES.BAD_REQUEST) {
      throw error;
    }
    if (error?.code === SERVICE_ERROR_CODES.TOO_MANY_REQUESTS) {
      throw error;
    }
    throw createServiceError(
      SERVICE_ERROR_CODES.SERVICE_UNAVAILABLE,
      "El servicio del asistente no está disponible.",
      error
    );
  }
};
