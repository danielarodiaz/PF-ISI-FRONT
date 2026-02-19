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

// Paginas Admin
import LoginAdmin from "./pages/LoginAdmin";
import HomeAdmin from "./pages/HomeAdmin"; 
import DashboardMetrics from "./pages/DashboardMetrics";
import FaqsAdmin from "./pages/FaqsAdmin";

// Rutas Protegidas
import ProtectedRoutes from "./routes/ProtectedRoutes";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename="/PF-ISI-FRONT">
        <Routes>
          
          {/* =======================================================
              GRUPO 1: RUTAS PÚBLICAS (ALUMNOS)
              Usan PublicLayout (Tienen Navbar y fondo de alumnos)
             ======================================================= */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<MainScreen />} />
            <Route path="/fila" element={<FilaScreen />} />
            <Route path="/turno" element={<TurnoScreen />} />
            <Route path="/chatbot" element={<ChatbotScreen />} />
            <Route path="/faq" element={<FaqScreen />} />
            <Route path="/whatsapp" element={<WhatsAppScreen />} />
          </Route>


          {/* =======================================================
              GRUPO 2: LOGIN
              No tiene layout (Pantalla completa limpia)
             ======================================================= */}
          <Route path="/loginAdmin" element={<LoginAdmin />} />


          {/* =======================================================
              GRUPO 3: RUTAS PRIVADAS (ADMINISTRADOR)
              Están protegidas y NO usan PublicLayout (Header limpio)
             ======================================================= */}
          <Route path="/admin" element={<ProtectedRoutes />}>
            
            {/* Aquí definimos las sub-rutas de admin */}
            
            {/* Panel Principal: /admin/homeAdmin */}
            <Route path="homeAdmin" element={<HomeAdmin />} />
            
            {/* Reportes: /admin/dashboard */}
            <Route path="dashboard" element={<DashboardMetrics />} />
            
            {/* FAQs: /admin/faqs */}
            <Route path="faqs" element={<FaqsAdmin />} />

          </Route>


          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;