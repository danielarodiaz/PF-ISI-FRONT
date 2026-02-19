const readEnv = (key) => {
  const value = import.meta.env[key];
  return typeof value === "string" ? value.trim() : "";
};

// Configuración estándar vía .env (VITE_*)
export const BACKEND_URL = readEnv("VITE_API_URL");
export const CHATBOT_URL = readEnv("VITE_CHATBOT_URL");

// Debug para que veas en la consola a dónde le estás pegando mientras programas
console.log("🚀 Entorno configurado:", { BACKEND_URL, CHATBOT_URL });
