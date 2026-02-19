import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { verificarToken } from "../helpers/login";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";

const ProtectedRoutes = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      
      // 1. Si no hay token, rechazamos inmediatamente
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // 2. Verificamos con el backend
        const esValido = await verificarToken(token);
        
        if (!esValido) {
          throw new Error("Token no válido");
        }
        
        // 3. Si todo ok, autorizamos
        setIsAuthenticated(true);
      } catch (error) {
        // 4. Si falla (401), limpiamos y preparamos redirección
        console.warn("Sesión inválida, redirigiendo...");
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      } finally {
        // 5. Terminó la carga
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Muestra spinner mientras verifica (evita pantalla blanca momentánea)
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  // Si falló la verificación, manda al login
  if (!isAuthenticated) {
    return <Navigate to="/loginadmin" replace />;
  }

  // Si pasó, renderiza la página solicitada (HomeAdmin, Dashboard, etc.)
  return <Outlet />;
};

export default ProtectedRoutes;