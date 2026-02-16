// Vite carga automáticamente el archivo .env correcto según el modo (dev o prod)
export const BACKEND_URL = import.meta.env.VITE_API_URL;
export const CHATBOT_URL = import.meta.env.VITE_CHATBOT_URL;

// Debug para que veas en la consola a dónde le estás pegando mientras programas
console.log("🚀 Entorno configurado:", { BACKEND_URL, CHATBOT_URL });