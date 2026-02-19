import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { LogIn } from "../helpers/login";
import { User, Lock, LogIn as LogInIcon } from "lucide-react"; // Iconos modernos
import { useTheme } from "../context/ThemeContext";

const LoginAdmin = ({ cambiarLogin }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [formValues, setFormValues] = useState({ user: "", password: "" });
  const [errors, setErrors] = useState({ user: false, password: false });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { user, password } = formValues;

    if (!user || !password) {
      setErrors({ user: !user, password: !password });
      return;
    }

    setLoading(true);
    try {
      const token = await LogIn(user, password);
      if (token) {
        localStorage.setItem("token", token.token);
        cambiarLogin();
        navigate("/admin/homeAdmin");
      } else {
        throw new Error("Credenciales inválidas");
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Acceso Denegado",
        text: "Usuario o contraseña incorrectos.",
        confirmButtonColor: "#3b82f6"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 bg-[url('https://source.unsplash.com/random/1920x1080/?technology')] bg-cover bg-center transition-colors">
      <div className={`absolute inset-0 backdrop-blur-sm ${theme === "dark" ? "bg-black/60" : "bg-white/55"}`}></div>
      
      <div className={`relative z-10 w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-md border transition-colors ${
        theme === "dark"
          ? "bg-white/10 border-white/20 text-white"
          : "bg-white/85 border-slate-200 text-slate-800"
      }`}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Admin Panel</h2>
          <p className={theme === "dark" ? "text-gray-300" : "text-slate-600"}>
            Ingresa tus credenciales para gestionar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-slate-700"}`}>Usuario</label>
            <div className="relative">
              <User className={`absolute left-3 top-3 h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`} />
              <input
                type="text"
                name="user"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:border-blue-400 transition-colors ${
                  theme === "dark"
                    ? `bg-black/20 text-white placeholder-gray-400 ${errors.user ? "border-red-500" : "border-gray-500"}`
                    : `bg-white text-slate-900 placeholder-slate-400 ${errors.user ? "border-red-500" : "border-slate-300"}`
                }`}
                placeholder="Ej. admin"
                onChange={handleChange}
              />
            </div>
            {errors.user && <span className={`text-xs mt-1 ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>Requerido</span>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-slate-700"}`}>Contraseña</label>
            <div className="relative">
              <Lock className={`absolute left-3 top-3 h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`} />
              <input
                type="password"
                name="password"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:border-blue-400 transition-colors ${
                  theme === "dark"
                    ? `bg-black/20 text-white placeholder-gray-400 ${errors.password ? "border-red-500" : "border-gray-500"}`
                    : `bg-white text-slate-900 placeholder-slate-400 ${errors.password ? "border-red-500" : "border-slate-300"}`
                }`}
                placeholder="••••••"
                onChange={handleChange}
              />
            </div>
            {errors.password && <span className={`text-xs mt-1 ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>Requerido</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Ingresando..." : "Iniciar Sesión"}
            {!loading && <LogInIcon size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;
