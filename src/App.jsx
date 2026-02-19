import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

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
import DashboardMetrics from "./pages/DashboardMetrics";
import FaqsAdmin from "./pages/FaqsAdmin";


// Rutas Protegidas (Admin)
import RoutesApp from "./routes/RoutesApp";
import ProtectedRoutes from "./routes/ProtectedRoutes";

function App() {
  // Estado simple de login
  const [login, setLogin] = useState(!!localStorage.getItem("token"));
  const rawBasePath = import.meta.env.VITE_BASE_PATH || "/";
  const routerBaseName =
    rawBasePath === "/" ? "/" : rawBasePath.replace(/\/+$/, "");

  const cambiarLogin = () => {
    const token = localStorage.getItem("token");
    setLogin(!!token);
  };

  return (
    <ThemeProvider>
      <BrowserRouter basename={routerBaseName}>
        <Routes>
          {/* RUTAS PÚBLICAS
            Todas estas rutas comparten el Navbar y el fondo del PublicLayout 
          */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<MainScreen />} />
            <Route path="/fila" element={<FilaScreen />} />
            <Route path="/turno" element={<TurnoScreen />} />
            <Route path="/chatbot" element={<ChatbotScreen />} />
            <Route path="/faq" element={<FaqScreen />} />
            <Route path="/whatsapp" element={<WhatsAppScreen />} />
            <Route path="/admin/dashboard" element={<DashboardMetrics />} />
            <Route path="/admin/faqs" element={<FaqsAdmin />} />

            
          </Route>

          {/* LOGIN ADMINISTRADOR (Sin layout público) */}
          <Route 
            path="/loginAdmin" 
            element={<LoginAdmin cambiarLogin={cambiarLogin} />} 
          />

          {/* RUTAS ADMINISTRADOR (Protegidas) */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoutes login={login}>
                <RoutesApp />
              </ProtectedRoutes>
            }
          />
          
          {/* Redirección por defecto a Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
