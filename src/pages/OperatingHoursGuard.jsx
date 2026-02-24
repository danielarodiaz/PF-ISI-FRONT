import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { SHIFT_CONFIG, formatDecimalToTime, getInstitutionDecimalTime } from "../helpers/shiftConfig";

const checkOperatingHours = () => {
  const decimalTime = getInstitutionDecimalTime(); // Hora blindada de la institución
  
  const isMorningShift = decimalTime >= SHIFT_CONFIG.morningStart && decimalTime <= SHIFT_CONFIG.morningEnd;
  const isAfternoonShift = decimalTime >= SHIFT_CONFIG.afternoonStart && decimalTime <= SHIFT_CONFIG.afternoonEnd;

  return !isMorningShift && !isAfternoonShift;
};

const OperatingHoursGuard = () => {
  const [isOutOfService, setIsOutOfService] = useState(checkOperatingHours());

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOutOfService(checkOperatingHours());
    }, 60000); 
    return () => clearInterval(interval);
  }, []);

  if (isOutOfService) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center transition-colors duration-300">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl dark:shadow-none max-w-md w-full border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🌙</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Fuera de Servicio</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">
            La fila virtual se encuentra cerrada en este momento.
          </p>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-left space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-2">Horarios de Atención</h3>
            
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 font-medium">
              <span>Turno Mañana:</span>
              <span className="text-slate-800 dark:text-white font-bold">
                {formatDecimalToTime(SHIFT_CONFIG.morningStart)} - {formatDecimalToTime(SHIFT_CONFIG.morningEnd)} hs
              </span>
            </div>
            
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 font-medium">
              <span>Turno Tarde:</span>
              <span className="text-slate-800 dark:text-white font-bold">
                {formatDecimalToTime(SHIFT_CONFIG.afternoonStart)} - {formatDecimalToTime(SHIFT_CONFIG.afternoonEnd)} hs
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default OperatingHoursGuard;