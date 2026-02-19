import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { LogIn } from "../helpers/login";
import { User, Lock, LogIn as LogInIcon } from "lucide-react"; 

const LoginAdmin = ({ cambiarLogin }) => {
  const navigate = useNavigate();
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
      // Llamamos al helper
      const data = await LogIn(user, password);
      
      // Verificamos si data tiene la propiedad token
      if (data && data.token) {
        // Guardamos SOLO el string del token
        localStorage.setItem("token", data.token);
        
        // Si usas un estado global para login, actualízalo aquí
        if(cambiarLogin) cambiarLogin(); 
        
        navigate("/admin/homeAdmin");
      } else {
        throw new Error("Respuesta inválida del servidor");
      }
    } catch (error) {
      console.error(error);
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
    <div className="min-h-screen flex items-center justify-center bg-slate-900 bg-[url('https://source.unsplash.com/random/1920x1080/?technology')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full max-w-md p-8 bg-white/10 border border-white/20 rounded-2xl shadow-2xl backdrop-blur-md text-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Admin Panel</h2>
          <p className="text-gray-300">Ingresa tus credenciales para gestionar.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Usuario</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="user"
                className={`w-full pl-10 pr-4 py-2.5 bg-black/20 border ${errors.user ? 'border-red-500' : 'border-gray-500'} rounded-lg focus:outline-none focus:border-blue-400 text-white placeholder-gray-400 transition-colors`}
                placeholder="Ej. admin"
                onChange={handleChange}
              />
            </div>
            {errors.user && <span className="text-xs text-red-400 mt-1">Requerido</span>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                className={`w-full pl-10 pr-4 py-2.5 bg-black/20 border ${errors.password ? 'border-red-500' : 'border-gray-500'} rounded-lg focus:outline-none focus:border-blue-400 text-white placeholder-gray-400 transition-colors`}
                placeholder="••••••"
                onChange={handleChange}
              />
            </div>
            {errors.password && <span className="text-xs text-red-400 mt-1">Requerido</span>}
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