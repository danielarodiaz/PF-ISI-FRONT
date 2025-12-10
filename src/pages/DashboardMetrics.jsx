import React, { useEffect, useState, useMemo } from "react";
import { 
  BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from "recharts";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDatosReportes } from "../helpers/filaApi";

const DashboardMetrics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const turnos = await getDatosReportes();
        setRawData(turnos || []); 
      } catch (error) {
        console.error("Error cargando reportes");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 1. TRÁMITES MÁS FRECUENTES ---
  const dataTramites = useMemo(() => {
    const conteo = {};
    rawData.forEach(t => {
      // Usamos optional chaining por si el objeto tramite viene nulo
      const nombre = t.tramite?.descripcion || t.tramite || "Otros"; 
      conteo[nombre] = (conteo[nombre] || 0) + 1;
    });

    return Object.keys(conteo).map(key => ({
      name: key.substring(0, 15), 
      cantidad: conteo[key]
    })).sort((a, b) => b.cantidad - a.cantidad).slice(0, 10);
  }, [rawData]);

  // --- 2. CONCURRENCIA (Usando FechaDeCreacion real) ---
  const dataConcurrencia = useMemo(() => {
    let manana = 0; let tarde = 0; let noche = 0;

    rawData.forEach(t => {
      if (t.fechaDeCreacion) {
        const fecha = new Date(t.fechaDeCreacion);
        const hora = fecha.getHours();
        
        if (hora >= 7 && hora < 12) manana++;
        else if (hora >= 12 && hora < 18) tarde++;
        else noche++;
      }
    });

    return [
      { name: 'Mañana', value: manana, color: '#93c5fd' },
      { name: 'Tarde', value: tarde, color: '#4f46e5' },
      { name: 'Noche', value: noche, color: '#c7d2fe' },
    ].filter(d => d.value > 0);
  }, [rawData]);

  // --- 3. TIEMPO PROMEDIO (Calculado con fechas reales) ---
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
       {/* ... (El resto del JSX se mantiene igual que la versión anterior) ... */}
       {/* Solo asegúrate de usar {promedioEspera} en la tarjeta correspondiente */}
       
       {/* Ejemplo de uso en la tarjeta de Tiempo Promedio: */}
       {/* <div className="text-5xl font-black text-orange-500 my-4">
           {promedioEspera}m
       </div> 
       */}
    </div>
  );
};

export default DashboardMetrics;