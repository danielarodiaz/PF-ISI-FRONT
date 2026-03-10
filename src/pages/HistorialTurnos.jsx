import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, FileText, Clock, CheckCircle, CalendarDays } from "lucide-react";
import { getDatosReportes } from "../helpers/filaApi";
import { formatInUserTimeZone, diffMinutesBetweenUtcDates } from "../helpers/dateTime";
import Loader from "../components/Loader";

const HistorialTurnos = () => {
  const navigate = useNavigate();
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const data = await getDatosReportes();
        // Filtramos SOLO los turnos que ya fueron atendidos (idEstadoTurno === 3)
        const atendidos = (data || []).filter(t => t.idEstadoTurno === 3);
        
        // Los ordenamos por fecha (los más recientes primero)
        atendidos.sort((a, b) => new Date(b.fechaUltimaModificacion) - new Date(a.fechaUltimaModificacion));
        
        setTurnos(atendidos);
      } catch (error) {
        console.error("Error cargando historial:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistorial();
  }, []);

  // Lógica de filtrado por Legajo o Trámite
  const turnosFiltrados = useMemo(() => {
    if (!searchTerm) return turnos;
    return turnos.filter(t => 
      (t.legajo && t.legajo.toString().includes(searchTerm)) ||
      (t.tramite?.descripcion && t.tramite.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.nombreTurno && t.nombreTurno.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [turnos, searchTerm]);

  // Función para calcular los tiempos
  const calcularTiempos = (turno) => {
    // NOTA: Asumimos que el backend devuelve fechaInicioAtencion o similar. 
    // Si no lo devuelve, calculamos el tiempo total de punta a punta.
    const creacion = turno.fechaDeCreacion;
    const inicioAtencion = turno.fechaInicioAtencion || turno.fechaLlamado; // Reemplazá con el nombre real de tu campo
    const finAtencion = turno.fechaUltimaModificacion;

    let espera = 0;
    let duracion = 0;

    if (inicioAtencion) {
      espera = diffMinutesBetweenUtcDates(creacion, inicioAtencion) || 0;
      duracion = diffMinutesBetweenUtcDates(inicioAtencion, finAtencion) || 0;
    } else {
      // Si el backend aún no tiene el campo de "inicioAtencion", mostramos el tiempo total como espera por ahora
      espera = diffMinutesBetweenUtcDates(creacion, finAtencion) || 0;
      duracion = "N/A"; 
    }

    return { espera: Math.max(0, espera), duracion: duracion !== "N/A" ? Math.max(0, duracion) : "N/A" };
  };

  // 👇 Función para convertir decimales a minutos y segundos legibles
  const formatearTiempo = (minutosDecimales) => {
    if (minutosDecimales === "N/A" || isNaN(minutosDecimales)) return "N/A";
    
    const totalSegundos = Math.round(minutosDecimales * 60);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;

    if (minutos === 0) return `${segundos} seg`;
    if (segundos === 0) return `${minutos} min`;
    
    return `${minutos} min ${segundos} seg`;
  };


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 transition-colors duration-300">
      
      {/* ENCABEZADO */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 gap-4">
         <div className="flex items-center gap-4">
           <button
             onClick={() => navigate(-1)}
             className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
           >
             <ArrowLeft size={24} />
           </button>
           <div>
             <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
               <CheckCircle className="text-emerald-500" />
               Historial de Atenciones
             </h2>
             <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
               Registro detallado de todos los turnos finalizados
             </p>
           </div>
         </div>

         {/* BUSCADOR */}
         <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Buscar por Legajo o Trámite..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors dark:text-white"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </header>

      {/* TABLA DE RESULTADOS */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-20">
            <Loader texto="Cargando historial de turnos..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 uppercase text-xs font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Legajo</th>
                  <th className="px-6 py-4">Nro. Turno</th>
                  <th className="px-6 py-4">Trámite Realizado</th>
                  <th className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1"><Clock size={14}/> Espera</div>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1"><Clock size={14}/> Duración</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {turnosFiltrados.length > 0 ? (
                  turnosFiltrados.map((turno) => {
                    const tiempos = calcularTiempos(turno);
                    return (
                      <tr key={turno.idTurno || turno.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 font-medium flex items-center gap-2">
                          <CalendarDays size={16} className="text-slate-400"/>
                          {formatInUserTimeZone(turno.fechaUltimaModificacion, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">
                          {turno.legajo || "S/L"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-1 rounded font-mono text-xs font-bold">
                            {turno.nombreTurno}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-slate-400"/>
                            {turno.tramite?.descripcion || "Sin descripción"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                        <span className={`font-bold ${tiempos.espera > 20 ? 'text-red-500' : 'text-emerald-500'}`}>
                            {formatearTiempo(tiempos.espera)}
                        </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                            {formatearTiempo(tiempos.duracion)}
                        </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                      No se encontraron turnos en el historial.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialTurnos;