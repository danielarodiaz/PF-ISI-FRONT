import { Play, CheckCircle, Clock, FileText, Lock } from "lucide-react";
import { formatInUserTimeZone } from "../helpers/dateTime";
import Swal from "sweetalert2";

// 👇 1. Recibimos 'turnoActual' en las propiedades
const TableFila = ({ fila, onAtenderTurno, turnoActual }) => {
  
  const formatFecha = (fecha) => {
    return formatInUserTimeZone(fecha, { hour: "2-digit", minute: "2-digit" });
  };

  const handleConfirmAtender = async (turno) => {
    const result = await Swal.fire({
      title: `¿Atender ${turno.turno}?`,
      text: "Este turno pasará al estado En ventanilla.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, atender",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#64748b",
      background: "#1e293b",
      color: "#fff",
    });

    if (result.isConfirmed) {
      onAtenderTurno(turno);
    }
  };

  // 👇 2. FUNCIÓN CLAVE: Comprueba si el turno de la fila es el que está en el panel
  const isEnVentanilla = (turno) => {
    return turno.atendiendo || (turnoActual && turnoActual.id === turno.id);
  };

  // 👇 3. Buscamos el próximo turno, ignorando los que ya están en ventanilla o atendidos
  const proximoTurnoId = fila.find(t => !t.atendido && !isEnVentanilla(t))?.id;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          
          <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 uppercase text-xs font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-3">Legajo</th>
              <th className="px-6 py-3">Trámite</th>
              <th className="px-6 py-3">
                <div className="flex items-center gap-1">
                    <Clock size={14} /> Hora
                </div>
              </th>
              <th className="px-6 py-3">Nro. Turno</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {fila.length > 0 ? (
              fila.map((turno) => (
                <tr 
                  key={turno.id} 
                  className={`group transition-colors duration-200 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 ${
                    turno.atendido 
                      ? "bg-slate-50 dark:bg-slate-950/30 opacity-70"
                      : "bg-white dark:bg-slate-900"
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                    {turno.legajo || <span className="text-slate-400 dark:text-slate-600 italic">S/L</span>}
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <FileText size={16} className="text-slate-400 dark:text-slate-600"/>
                        {turno.tramite}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono">
                    {formatFecha(turno.fecha)}
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded font-bold font-mono text-xs ${
                        turno.atendido 
                        ? "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500" 
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 dark:border dark:border-blue-800"
                    }`}>
                      {turno.turno}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    {/* 👇 4. RENDERIZADO INTELIGENTE DE BOTONES */}
                    {turno.atendido ? (
                      <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900 px-3 py-1 rounded-full text-xs font-bold">
                        <CheckCircle size={14} /> Atendido
                      </span>
                    ) : isEnVentanilla(turno) ? (
                      <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                        <Clock size={14} /> En ventanilla...
                      </span>
                    ) : turno.id === proximoTurnoId ? (
                      <button 
                        onClick={() => handleConfirmAtender(turno)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm shadow-blue-200 dark:shadow-none transition-all hover:scale-105 active:scale-95"
                      >
                        <Play size={14} fill="currentColor" /> Atender
                      </button>
                    ) : (
                      <button 
                        disabled
                        title="Debes atender los turnos anteriores primero"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold rounded-lg cursor-not-allowed border border-slate-200 dark:border-slate-700"
                      >
                        <Lock size={14} /> En espera
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                     <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                        <Clock size={24} className="text-slate-300 dark:text-slate-600"/>
                     </div>
                     <p>No hay turnos pendientes en la fila.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableFila;