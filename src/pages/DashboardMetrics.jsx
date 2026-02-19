import { useEffect, useState, useMemo } from "react";
import { getDatosReportes } from "../helpers/filaApi";
import TurnosChart from "./TurnosChart"; // 1. IMPORTAMOS LOS GRÁFICOS

const DashboardMetrics = () => {
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const turnos = await getDatosReportes();
        setRawData(turnos || []); 
      } catch {
        console.error("Error cargando reportes");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const promedioEspera = useMemo(() => {
    const turnosAtendidos = rawData.filter(t => 
        t.idEstadoTurno === 3 && t.fechaDeCreacion && t.fechaUltimaModificacion
    );
    
    if (turnosAtendidos.length === 0) return 0;

    const totalMinutos = turnosAtendidos.reduce((acc, curr) => {
      const inicio = new Date(curr.fechaDeCreacion);
      const fin = new Date(curr.fechaUltimaModificacion);
      const diff = (fin - inicio) / (1000 * 60); 
      return acc + (diff > 0 ? diff : 0);
    }, 0);

    return Math.round(totalMinutos / turnosAtendidos.length);
  }, [rawData]);

  if (loading) return <div className="p-10 text-center">Cargando métricas...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 transition-colors duration-300">
      
      {/* TARJETA DE MÉTRICAS */}
      <div className="bg-white dark:bg-slate-900 shadow rounded-lg p-6 mb-8 text-center border-l-4 border-blue-500">
        <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400">Tiempo Promedio de Atención</h3>
        <p className="text-4xl font-bold text-slate-800 dark:text-slate-100 mt-2">
          {promedioEspera} <span className="text-xl font-normal">min</span>
        </p>
      </div>

      {/* SECCIÓN DE GRÁFICOS */}
      <div className="bg-white dark:bg-slate-900 shadow rounded-lg p-6">
        <TurnosChart />
      </div>

    </div>
  );
};

export default DashboardMetrics;