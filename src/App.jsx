import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import OperatingHoursGuard from "./pages/OperatingHoursGuard";

// Layouts
import PublicLayout from "./components/layout/PublicLayout";

// Paginas Publicas
import MainScreen from "./pages/MainScreen";
import FilaScreen from "./pages/FilaScreen";
import TurnoScreen from "./pages/TurnoScreen";
import ChatbotScreen from "./pages/ChatbotScreen";
import FaqScreen from "./pages/FaqScreen";
import WhatsAppScreen from "./pages/WhatsAppScreen";
import LoginAdmin from "./pages/LoginAdmin";


// Rutas Protegidas (Admin)
import RoutesApp from "./routes/RoutesApp";
import ProtectedRoutes from "./routes/ProtectedRoutes";

function App() {
  // Estado simple de login
  const [login, setLogin] = useState(!!localStorage.getItem("token"));
  const rawBasePath = import.meta.env.VITE_BASE_PATH || "/";
  const routerBaseName =
    rawBasePath === "/" ? "/" : rawBasePath.replace(/\/+$/, "");

  console.log("[admin-debug][App] render", {
    path: window.location.pathname,
    routerBaseName,
    hasToken: !!localStorage.getItem("token"),
    loginState: login,
  });

  const cambiarLogin = () => {
    const token = localStorage.getItem("token");
    setLogin(!!token);
  };

  return (
    <ThemeProvider>
      <BrowserRouter basename={routerBaseName}>
        <Routes>
          
          {/* =========================================
              RUTAS PÚBLICAS (Alumnos)
              ========================================= */}
          <Route element={<PublicLayout />}>
            {/* <Route element={<OperatingHoursGuard />}> */}
                <Route path="/" element={<MainScreen />} />
                <Route path="/fila" element={<FilaScreen />} />
                <Route path="/turno" element={<TurnoScreen />} />
                <Route path="/chatbot" element={<ChatbotScreen />} />
                <Route path="/faq" element={<FaqScreen />} />
                <Route path="/whatsapp" element={<WhatsAppScreen />} />
            </Route> 
            
          {/* </Route> */}

          <Route
            path="/admin/*"
            element={
              <ProtectedRoutes login={login}>
                <RoutesApp />
              </ProtectedRoutes>
            }
          /> 

          {/* LOGIN ADMINISTRADOR */}
          <Route 
            path="/loginAdmin" 
            element={<LoginAdmin cambiarLogin={cambiarLogin} />} 
          />

          {/* Redirección por defecto a Home para cualquier ruta inventada */}
          <Route path="*" element={<Navigate to="/" />} />
          
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
