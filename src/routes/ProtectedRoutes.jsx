import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { verificarToken } from "../helpers/login";
import Swal from "sweetalert2";

const ProtectedRoutes = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  console.log("[admin-debug][ProtectedRoutes] render", {
    path: location.pathname,
    isLoading,
    isAuthenticated,
    hasToken: !!localStorage.getItem("token"),
  });

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      console.log("[admin-debug][ProtectedRoutes] checkToken:start", {
        path: location.pathname,
        hasToken: !!token,
      });
      
      if (!token) {
        console.log("[admin-debug][ProtectedRoutes] checkToken:no-token");
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const valido = await verificarToken(token);
        console.log("[admin-debug][ProtectedRoutes] checkToken:response", {
          valido,
        });
        
        if (!valido) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Expiró tu sesión. Vuelve a iniciar sesión para continuar",
          }).then(() => {
            localStorage.removeItem("token");
            navigate("/loginAdmin");
          });
          //localStorage.removeItem("token");
          setIsAuthenticated(false);
        } else {
          console.log("[admin-debug][ProtectedRoutes] checkToken:authenticated");
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("[admin-debug][ProtectedRoutes] checkToken:error", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Expiró tu sesión. Vuelve a iniciar sesión para continuar",
        }).then(() => {
          localStorage.removeItem("token");
          navigate("/loginAdmin"); // Redirigir sin recargar la página
        });
        //console.error("Error verifying token:", error);
        //localStorage.removeItem("token");
        setIsAuthenticated(false);
      } finally {
        console.log("[admin-debug][ProtectedRoutes] checkToken:finally");
        setIsLoading(false);
      }
    };

    checkToken();
  }, [location.pathname, navigate]); // Re-verify when path changes in protected routes

  if (isLoading) {
    console.log("[admin-debug][ProtectedRoutes] loading-screen");
    // You could return a loading spinner here
    return <div className="text-center py-5">Verificando acceso...</div>;
  }

  if (!isAuthenticated) {
    console.log("[admin-debug][ProtectedRoutes] redirect-login");
    return <Navigate to="/loginAdmin" />;
  }

  console.log("[admin-debug][ProtectedRoutes] allow-children");
  return children;
};

ProtectedRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoutes;
