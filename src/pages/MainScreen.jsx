import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import filavirtual from "../assets/filavirtual.jpg"; // Asegúrate de tener estas imágenes
import FAQ from "../assets/FAQ.png";
import chatbot from "../assets/chatbot.png";
import { Clock, Info, MapPin } from "lucide-react"; // Iconos nuevos

// Componente de Tarjeta reutilizable (lo que ya tenías pero más limpio)
const CardOption = ({ to, img, title, subtitle, colorInfo }) => (
  <Link to={to} className="group relative block h-64 overflow-hidden rounded-3xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
    <img src={img} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
    <div className={`absolute inset-0 bg-gradient-to-t ${colorInfo} opacity-90 transition-opacity group-hover:opacity-95`}></div>
    <div className="absolute inset-0 p-6 flex flex-col justify-end">
      <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">{title}</h3>
      <p className="text-white/80 text-sm font-medium">{subtitle}</p>
    </div>
  </Link>
);

const MainScreen = () => {
  // Simulación de estado (esto vendría de tu lógica real o API)
  const [turnoActivo, setTurnoActivo] = useState(null); 
  const [estaAbierto, setEstaAbierto] = useState(true); // Deberías calcular esto con la hora actual

  useEffect(() => {
    // Verificar si hay turno en sessionStorage al cargar
    const turno = sessionStorage.getItem("turnoActivo");
    if (turno) setTurnoActivo(JSON.parse(turno));
  }, []);

  return (
    <div className="space-y-8">
      
      {/* 1. HERO SECTION: Bienvenida y Estado */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors">
        <div className="space-y-4 max-w-lg">
          <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">
            Gestión de Alumnos <span className="text-blue-600">UTN FRT</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Bienvenido al sistema de atención virtual. Gestiona tus trámites sin filas físicas.
          </p>
          
          {/* Indicadores de Estado */}
          <div className="flex flex-wrap gap-4 pt-2">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${estaAbierto ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' : 'bg-red-50 text-red-700 border-red-200'}`}>
               <Clock size={16} />
               {estaAbierto ? "Atención: Abierto" : "Cerrado ahora"}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-slate-50 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
               <MapPin size={16} />
               Dpto. Alumnos
            </div>
          </div>
        </div>

        {/* Tarjeta de "Turno Activo" (Si existe) */}
        {turnoActivo && (
           <div className="w-full md:w-auto bg-blue-600 dark:bg-blue-700 p-6 rounded-2xl text-white shadow-lg shadow-blue-200 dark:shadow-none min-w-[280px] animate-in slide-in-from-right duration-500">
              <p className="text-blue-100 text-sm font-medium mb-1">Tu turno actual</p>
              <div className="text-4xl font-black mb-2">{turnoActivo.nombreTurno || "A-00"}</div>
              <Link to="/turno" className="inline-block bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-sm">
                 Ver estado completo →
              </Link>
           </div>
        )}
      </section>

      {/* 2. GRID PRINCIPAL (Tus tarjetas mejoradas) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardOption 
          to="/fila" 
          img={filavirtual} 
          title="Fila Virtual" 
          subtitle="Solicita un turno o consulta tu espera"
          colorInfo="from-orange-600 to-orange-400/50" 
        />
        <CardOption 
          to="/faq" 
          img={FAQ} 
          title="Preguntas Frecuentes" 
          subtitle="Documentación y requisitos"
          colorInfo="from-blue-600 to-blue-400/50" 
        />
        <CardOption 
          to="/chatbot" 
          img={chatbot} 
          title="Asistente Virtual" 
          subtitle="Ayuda inteligente 24/7"
          colorInfo="from-yellow-500 to-yellow-300/50" 
        />
      </section>

      {/* 3. FOOTER INFORMATIVO (Requisito de documentación) */}
      <section className="text-center py-6">
         <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
            <Info size={16} />
            ¿Necesitas saber qué papeles traer? <Link to="/faq" className="text-blue-600 font-semibold hover:underline">Revisar requisitos</Link>
         </p>
      </section>

    </div>
  );
};

export default MainScreen;