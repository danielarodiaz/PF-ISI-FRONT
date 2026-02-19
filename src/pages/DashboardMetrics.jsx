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
      let nombre = "Otros";
      if (t.tramite && typeof t.tramite === 'object') {
          nombre = t.tramite.descripcion || t.tramite.Descripcion || "Trámite";
      } else if (typeof t.tramite === 'string') {
          nombre = t.tramite;
      }
      conteo[nombre] = (conteo[nombre] || 0) + 1;
    });

    return Object.keys(conteo).map(key => ({
      // Aumentamos a 25 caracteres y agregamos "..." si es muy largo
      name: key.length > 25 ? key.substring(0, 25) + "..." : key,
      fullName: key, // Guardamos el nombre completo para el tooltip
      cantidad: conteo[key]
    })).sort((a, b) => b.cantidad - a.cantidad).slice(0, 10);
  }, [rawData]);

  // --- 2. CONCURRENCIA ---
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

  // --- 3. TIEMPO PROMEDIO ---
  const promedioEspera = useMemo(() => {
    // Filtramos turnos atendidos (Estado 3 o donde haya fecha fin válida)
    // En tu log veo fechaUltimaModificacion, usaremos esa como fin
    const turnosAtendidos = rawData.filter(t => t.fechaDeCreacion && t.fechaUltimaModificacion && t.idEstadoTurno !== 1); // Excluir pendientes
    
    if (turnosAtendidos.length === 0) return 0;

    const totalMinutos = turnosAtendidos.reduce((acc, curr) => {
      const inicio = new Date(curr.fechaDeCreacion);
      const fin = new Date(curr.fechaUltimaModificacion);
      const diff = (fin - inicio) / (1000 * 60); 
      return acc + (diff > 0 ? diff : 0);
    }, 0);

    return Math.round(totalMinutos / turnosAtendidos.length);
  }, [rawData]);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Cargando...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 transition-colors duration-300">
      
      {/* HEADER */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => navigate(-1)} 
                className="p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
                <ArrowLeft size={20} />
            </button>
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Reportes Detallados</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Basado en {rawData.length} turnos registrados</p>
            </div>
        </div>
      </header>

      {/* GRID DE GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. TRÁMITES MÁS FRECUENTES */}
        <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 h-full flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Trámites más solicitados</h3>
                
                {/* ⚠️ CAMBIO CLAVE: Altura fija explícita (h-80 = 320px) para asegurar renderizado */}
                <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataTramites} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }}
                                cursor={{fill: 'transparent'}}
                            />
                            <Bar dataKey="cantidad" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Cantidad" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* 2. CONCURRENCIA */}
        <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 h-full flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Concurrencia por Horario</h3>
                
                {/* ⚠️ CAMBIO CLAVE: Altura fija */}
                <div className="w-full h-64 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={dataConcurrencia}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {dataConcurrencia.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '12px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-bold text-slate-800 dark:text-white">{rawData.length}</span>
                        <span className="text-xs text-slate-500 font-medium">Turnos</span>
                    </div>
                </div>
                 <div className="flex justify-center gap-4 mt-4 flex-wrap">
                    {dataConcurrencia.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* 3. TIEMPO PROMEDIO (KPI) */}
        <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 h-full flex flex-col items-center justify-center text-center py-12">
                 <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Tiempo Promedio de Atención</h3>
                 <div className="text-5xl font-black text-orange-500 my-4">{promedioEspera} min</div>
                 <p className="text-sm text-slate-500">Desde ingreso a fila hasta finalización</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardMetrics;