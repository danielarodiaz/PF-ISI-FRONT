import React from "react";
import { User, FileText, Megaphone } from "lucide-react";

const CardFilaNow = ({ turnoData }) => {
  const { legajo, tramite, turno } = turnoData;

  // Nota: La función formatFecha la quité porque estaba comentada en tu original,
  // pero si decides mostrar la hora, puedes descomentarla fácilmente.

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative transform transition-all duration-300 hover:shadow-2xl">
        
        {/* Barra superior decorativa con gradiente */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-green-500"></div>

        <div className="p-8 text-center">
          
          {/* Badge de estado "Atendiendo" */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-100 text-sm font-bold mb-6 animate-pulse">
            <Megaphone size={16} />
            <span className="tracking-wide uppercase">Atendiendo Ahora</span>
          </div>

          {/* Número de Turno (El dato más importante) */}
          <h1 className="text-7xl md:text-8xl font-black text-slate-800 tracking-tighter mb-2 leading-none">
            {turno}
          </h1>

          {/* Descripción del Trámite */}
          <div className="flex items-center justify-center gap-2 text-blue-600 font-medium text-lg mb-8">
            <FileText size={20} />
            <span>{tramite}</span>
          </div>

          {/* Separador */}
          <div className="border-t border-slate-100 w-full mb-6"></div>

          {/* Información del Alumno */}
          <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-center gap-3 text-slate-600">
            <div className="bg-white p-2 rounded-full shadow-sm">
                <User size={20} className="text-slate-400" />
            </div>
            <div className="text-left">
                <p className="text-xs text-slate-400 font-semibold uppercase">Alumno / Legajo</p>
                <p className="text-xl font-bold text-slate-800">{legajo}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CardFilaNow;