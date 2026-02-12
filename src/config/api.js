const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const coreBaseUrl = import.meta.env.VITE_API_BASE_URL_CORE || "http://localhost:5132";
const chatbotBaseUrl =
  import.meta.env.VITE_API_BASE_URL_CHATBOT || "https://lucasdepetris.duckdns.org:8080";

export const API_BASE_URL_CORE = trimTrailingSlash(coreBaseUrl);
export const API_BASE_URL_CHATBOT = trimTrailingSlash(chatbotBaseUrl);
