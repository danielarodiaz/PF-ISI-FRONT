import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

// --- Lógica de verificación de horario ---
const checkOperatingHours = () => {
  const now = new Date();
  const decimalTime = now.getHours() + now.getMinutes() / 60;
  
  // Mañana: 09:00 a 13:00 (13.00)
  const isMorningShift = decimalTime >= 9 && decimalTime <= 13;
  
  // Tarde: 15:30 (15.50) a 20:30 (20.50)
  const isAfternoonShift = decimalTime >= 15.5 && decimalTime <= 20.5;

  // Logs para debug (opcional, podés borrarlos después)
  console.log(`[Guardia] Hora: ${now.toLocaleTimeString()} (Dec: ${decimalTime.toFixed(2)})`);
  console.log(`[Guardia] ¿Bloqueado?: ${!isMorningShift && !isAfternoonShift}`);

  // Devuelve TRUE si está fuera de servicio
  return !isMorningShift && !isAfternoonShift;
};

const OperatingHoursGuard = () => {
  // Inicializamos el estado ejecutando la función directamente
  const [isOutOfService, setIsOutOfService] = useState(checkOperatingHours());

  useEffect(() => {
    // Revisa cada 1 minuto
    const interval = setInterval(() => {
      setIsOutOfService(checkOperatingHours());
    }, 60000); 

    return () => clearInterval(interval);
  }, []);

  // --- Renderizado del Cartel (Ahora con Dark Mode) ---
  if (isOutOfService) {
    return (
      // Contenedor principal: fondo claro vs fondo muy oscuro
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center transition-colors duration-300">
        
        {/* Tarjeta: blanco vs gris oscuro, ajustando bordes y sombras */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl dark:shadow-none max-w-md w-full border border-slate-200 dark:border-slate-800">
          
          {/* Círculo del ícono */}
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🌙</span>
          </div>
          
          {/* Títulos y textos */}
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
            Fuera de Servicio
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">
            La fila virtual se encuentra cerrada en este momento.
          </p>
          
          {/* Caja de horarios */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-left space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-2">
              Horarios de Atención
            </h3>
            
            {/* Horario Mañana */}
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 font-medium">
              <span>Turno Mañana:</span>
              <span className="text-slate-800 dark:text-white font-bold">09:00 - 13:00 hs</span>
            </div>
            
            {/* Horario Tarde */}
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 font-medium">
              <span>Turno Tarde:</span>
              <span className="text-slate-800 dark:text-white font-bold">15:30 - 20:30 hs</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si está en horario, deja pasar a la app normal
  return <Outlet />;
};

export default OperatingHoursGuard;