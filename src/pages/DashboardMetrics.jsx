import { useEffect, useState, useMemo } from "react";
import { getDatosReportes } from "../helpers/filaApi";

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

  // --- 1. TRÁMITES MÁS FRECUENTES ---
  // --- TIEMPO PROMEDIO (Calculado con fechas reales) ---
  const promedioEspera = useMemo(() => {
    // Filtramos solo los turnos que ya fueron atendidos (Estado 3 = Atendido, ajusta según tu Enum)
    const turnosAtendidos = rawData.filter(t => 
        t.idEstadoTurno === 3 && t.fechaDeCreacion && t.fechaUltimaModificacion
    );
    
    if (turnosAtendidos.length === 0) return 0;

    const totalMinutos = turnosAtendidos.reduce((acc, curr) => {
      const inicio = new Date(curr.fechaDeCreacion);
      const fin = new Date(curr.fechaUltimaModificacion);
      // Diferencia en milisegundos convertida a minutos
      const diff = (fin - inicio) / (1000 * 60); 
      // Filtramos valores negativos o absurdos (errores de data)
      return acc + (diff > 0 ? diff : 0);
    }, 0);

    return Math.round(totalMinutos / turnosAtendidos.length);
  }, [rawData]);

  if (loading) return <div className="p-10 text-center">Cargando métricas...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 transition-colors duration-300">
      <div className="text-center text-slate-700 dark:text-slate-200">
        Tiempo promedio estimado: <strong>{promedioEspera}m</strong>
      </div>
    </div>
  );
};

export default DashboardMetrics;
