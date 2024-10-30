import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import WhatsAppScreen from "./pages/WhatsAppScreen";
import FilaScreen from "./pages/FilaScreen";
import TurnoScreen from "./pages/TurnoScreen";
import MainScreen from "./pages/MainScreen";

import RoutesApp from "./routes/RoutesApp";
import ProtectedRoutes from "./routes/ProtectedRoutes";

import LoginAdmin from "./pages/LoginAdmin";
import ChatbotScreen from "./pages/ChatbotScreen";
import FaqScreen from "./pages/FaqScreen";

function App() {
  const [login, setLogin] = useState(false);

  const cambiarLogin = () => {
    setLogin(!login);
  };

  return (
    <>
      <div className="footer-container">
        <BrowserRouter basename="/PF-ISI-FRONT">
          <NavBar cambiarLogin={cambiarLogin} />
          <div className="flex-grow-1">
            <Routes>
              <Route path="/" element={<MainScreen />} />
              <Route path="/fila" element={<FilaScreen />} />
              <Route path="/whatsapp" element={<WhatsAppScreen />} />
              <Route path="/turno" element={<TurnoScreen />} />
              <Route path="/chatbot" element={<ChatbotScreen />} />
              <Route path="/faq" element={<FaqScreen />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoutes login={login}>
                    <RoutesApp />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/loginAdmin"
                element={<LoginAdmin cambiarLogin={cambiarLogin} />}
              />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
