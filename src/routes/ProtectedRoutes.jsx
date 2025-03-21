import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { verificarToken } from "../helpers/login";
import Swal from "sweetalert2";

const ProtectedRoutes = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const valido = await verificarToken(token);
        
        if (!valido) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Expiro tu sesion. Vuelve a iniciar sesion para continuar",
          }).then(() => {
            window.location.reload();
          });
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Expiro tu sesion. Vuelve a iniciar sesion para continuar",
        }).then(() => {
          window.location.reload();
        });
        console.error("Error verifying token:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, [location.pathname]); // Re-verify when path changes in protected routes

  if (isLoading) {
    // You could return a loading spinner here
    return <div className="text-center py-5">Verificando acceso...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/loginAdmin" />;
  }

  return children;
};

export default ProtectedRoutes;