import { useEffect } from "react";

const APP_NAME = "InfoTrack";

const TITLES = {
  "/": "Inicio",
  "/fila": "Solicitar Turno",
  "/turno": "Mi Turno",
  "/faq": "Preguntas Frecuentes",
  "/chatbot": "Asistente Virtual",
  "/whatsapp": "Notificaciones WhatsApp",
  "/loginAdmin": "Login Admin",
  "/admin/homeAdmin": "Admin Turnos",
  "/admin/reportes": "Admin Reportes",
  "/admin/dashboard": "Admin Dashboard",
  "/admin/faqs": "Admin FAQs",
};

const getBasePath = () => {
  const raw = import.meta.env.VITE_BASE_PATH || "/";
  if (raw === "/") return "/";
  return raw.replace(/\/+$/, "");
};

const normalizePath = (pathname) => {
  const basePath = getBasePath();
  let path = pathname || "/";

  if (basePath !== "/" && path.startsWith(basePath)) {
    path = path.slice(basePath.length) || "/";
  }

  if (path.length > 1) path = path.replace(/\/+$/, "");
  return path || "/";
};

const resolveTitle = (pathname) => {
  const path = normalizePath(pathname);
  if (TITLES[path]) return `${TITLES[path]} | ${APP_NAME}`;
  if (path.startsWith("/admin/")) return `Administración | ${APP_NAME}`;
  return APP_NAME;
};

const patchHistoryEvents = () => {
  if (window.__infotrackHistoryPatched) return;

  const originalPushState = window.history.pushState;
  const originalReplaceState = window.history.replaceState;

  window.history.pushState = function pushStateWrapper(...args) {
    const result = originalPushState.apply(this, args);
    window.dispatchEvent(new Event("locationchange"));
    return result;
  };

  window.history.replaceState = function replaceStateWrapper(...args) {
    const result = originalReplaceState.apply(this, args);
    window.dispatchEvent(new Event("locationchange"));
    return result;
  };

  window.__infotrackHistoryPatched = true;
};

const RouteTitleManager = () => {
  useEffect(() => {
    patchHistoryEvents();

    const syncTitle = () => {
      document.title = resolveTitle(window.location.pathname);
    };

    syncTitle();
    window.addEventListener("popstate", syncTitle);
    window.addEventListener("locationchange", syncTitle);

    return () => {
      window.removeEventListener("popstate", syncTitle);
      window.removeEventListener("locationchange", syncTitle);
    };
  }, []);

  return null;
};

export default RouteTitleManager;
