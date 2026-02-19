import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { cerrarSesionLocal, refrescarSesion, verificarToken } from "../helpers/login";
import { getAccessToken } from "../helpers/authStorage";
import Swal from "sweetalert2";

const ProtectedRoutes = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = getAccessToken();
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const valido = await verificarToken(token);
        if (valido) {
          setIsAuthenticated(true);
          return;
        }

        const refreshed = await refrescarSesion();
        if (!refreshed) throw new Error("session refresh failed");
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error verifying token:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Expiró tu sesión. Vuelve a iniciar sesión para continuar",
        }).then(() => {
          cerrarSesionLocal();
          navigate("/loginAdmin"); // Redirigir sin recargar la página
        });
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, [location.pathname, navigate]); // Re-verify when path changes in protected routes

  if (isLoading) {
    // You could return a loading spinner here
    return <div className="text-center py-5">Verificando acceso...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/loginAdmin" />;
  }

  return children;
};

ProtectedRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoutes;
