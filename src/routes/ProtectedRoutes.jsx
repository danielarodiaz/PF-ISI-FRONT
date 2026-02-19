import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { cerrarSesionLocal, refrescarSesion, verificarToken } from "../helpers/login";
import { getAccessToken } from "../helpers/authStorage";
import Swal from "sweetalert2";

const TOKEN_VALIDATION_CACHE_KEY = "adminTokenValidationCache";
const TOKEN_VALIDATION_TTL_MS = 2 * 60 * 1000;

const ProtectedRoutes = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const token = getAccessToken();

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const now = Date.now();
      try {
        const rawCache = sessionStorage.getItem(TOKEN_VALIDATION_CACHE_KEY);
        if (rawCache) {
          const cache = JSON.parse(rawCache);
          const isSameToken = cache?.token === token;
          const isFresh = typeof cache?.validatedAt === "number" && now - cache.validatedAt < TOKEN_VALIDATION_TTL_MS;
          if (isSameToken && isFresh) {
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Ignore cache parsing issues and continue with normal validation.
      }

      try {
        const valido = await verificarToken(token);
        if (valido) {
          setIsAuthenticated(true);
          sessionStorage.setItem(
            TOKEN_VALIDATION_CACHE_KEY,
            JSON.stringify({ token, validatedAt: now })
          );
          return;
        }

        const refreshed = await refrescarSesion();
        if (!refreshed) throw new Error("session refresh failed");
        setIsAuthenticated(true);
        const refreshedToken = getAccessToken();
        if (refreshedToken) {
          sessionStorage.setItem(
            TOKEN_VALIDATION_CACHE_KEY,
            JSON.stringify({ token: refreshedToken, validatedAt: Date.now() })
          );
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        sessionStorage.removeItem(TOKEN_VALIDATION_CACHE_KEY);
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
  }, [token, navigate]);

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
