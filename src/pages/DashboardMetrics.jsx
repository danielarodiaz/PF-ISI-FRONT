import { useEffect, useState, useMemo } from "react";
import { getDatosReportes } from "../helpers/filaApi";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, CartesianGrid 
} from 'recharts';

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

  // --- LÓGICA DE DATOS ---
  const turnosUltimos7Dias = useMemo(() => {
    const hace7Dias = new Date();
    hace7Dias.setDate(hace7Dias.getDate() - 7);
    return rawData.filter(t => new Date(t.fechaDeCreacion) >= hace7Dias);
  }, [rawData]);

 const datosTramites = useMemo(() => {
    const conteo = {};
    
    turnosUltimos7Dias.forEach(t => {
      // Accedemos al objeto anidado 'tramite' y sacamos su 'descripcion'
      // El ?. es por seguridad, por si algún turno llegara sin trámite
      const nombre = t.tramite?.descripcion || "Sin descripción"; 
      
      conteo[nombre] = (conteo[nombre] || 0) + 1;
    });

    return Object.keys(conteo).map(key => ({ 
      nombre: key, 
      cantidad: conteo[key] 
    })).sort((a, b) => b.cantidad - a.cantidad);
  }, [turnosUltimos7Dias]);

  const datosConcurrencia = useMemo(() => {
    let manana = 0, tarde = 0, noche = 0;
    turnosUltimos7Dias.forEach(t => {
      const hora = new Date(t.fechaDeCreacion).getHours();
      if (hora >= 6 && hora < 12) manana++;
      else if (hora >= 12 && hora < 20) tarde++;
      else noche++;
    });
    return [
      { name: 'Mañana', value: manana, color: '#94a3b8' },
      { name: 'Tarde', value: tarde, color: '#3b82f6' },
      { name: 'Noche', value: noche, color: '#1e3a8a' },
    ];
  }, [turnosUltimos7Dias]);

  const datosAtencion = useMemo(() => {
    const atendidos = turnosUltimos7Dias.filter(t => t.idEstadoTurno === 3);
    if (atendidos.length === 0) return 0;
    const total = atendidos.reduce((acc, t) => {
      const min = (new Date(t.fechaUltimaModificacion) - new Date(t.fechaDeCreacion)) / 60000;
      return acc + Math.max(0, min);
    }, 0);
    return Math.round(total / atendidos.length);
  }, [turnosUltimos7Dias]);

  if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Cargando métricas de InfoTrack...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* IZQUIERDA: PANEL PRINCIPAL GIGANTE */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col min-h-[600px]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Trámites más frecuentes</h2>
            <p className="text-slate-500">Demanda total de servicios en los últimos 7 días</p>
          </div>
          
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosTramites}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="nombre" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                {/* FIX HOVER: Cursor transparente para evitar el fondo blanco */}
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="cantidad" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DERECHA: COLUMNA DE INDICADORES */}
        <div className="flex flex-col gap-6">
          
          {/* DERECHA: COLUMNA DE INDICADORES */}
        <div className="flex flex-col gap-6">
          
          {/* Tarjeta 1: Concurrencia (Distribución de carga) */}
          <div className="bg-white dark:bg-slate-900 shadow-lg rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Concurrencia Total</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={datosConcurrencia} innerRadius={50} outerRadius={65} paddingAngle={8} dataKey="value">
                    {datosConcurrencia.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-500 uppercase">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-400" /> Mañana</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Tarde</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-900" /> Noche</span>
            </div>
          </div>

          {/* Tarjeta 2: Eficiencia Operativa (Tiempo de Atención) */}
          <div className="bg-white dark:bg-slate-900 shadow-lg rounded-2xl p-6 border border-slate-200 dark:border-slate-800 text-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Tiempo de Atención</h3>
            <div className="text-5xl font-black text-slate-800 dark:text-slate-100 mb-1">{datosAtencion}</div>
            <div className="text-[10px] text-emerald-500 font-bold uppercase mb-4">Minutos en Ventanilla</div>
            
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-1000 ${datosAtencion > 10 ? 'bg-orange-500' : 'bg-emerald-500'}`} 
                 style={{ width: `${Math.min((datosAtencion / 15) * 100, 100)}%` }}
               ></div>
            </div>
            <p className="text-[9px] text-slate-400 mt-2 uppercase">Promedio por Turno Finalizado</p>
          </div>

          {/* Tarjeta 3: Tiempo de Espera Promedio (Calidad de Servicio) */}
          <div className="bg-white dark:bg-slate-900 shadow-lg rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Espera Promedio</h3>
             <div className="space-y-4">
               {datosConcurrencia.map((item, i) => {
                 // Aquí calculamos el promedio de espera real para esa franja
                 // En tu tesis, esto ayuda a detectar cuándo la espera supera los límites
                 const turnosFranja = turnosUltimos7Dias.filter(t => {
                    const hora = new Date(t.fechaDeCreacion).getHours();
                    if (item.name === 'Mañana') return hora >= 6 && hora < 12;
                    if (item.name === 'Tarde') return hora >= 12 && hora < 20;
                    return hora >= 20 || hora < 6;
                 });
                 
                 const sumaEspera = turnosFranja.reduce((acc, t) => {
                    const diff = (new Date(t.fechaUltimaModificacion) - new Date(t.fechaDeCreacion)) / 60000;
                    return acc + Math.max(0, diff);
                 }, 0);
                 
                 const promedio = turnosFranja.length > 0 ? Math.round(sumaEspera / turnosFranja.length) : 0;

                 return (
                   <div key={i} className="flex flex-col">
                     <div className="flex justify-between items-center mb-1">
                       <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{item.name}</span>
                       <span className="text-sm font-black text-slate-800 dark:text-slate-100">{promedio} min</span>
                     </div>
                     <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${Math.min((promedio / 30) * 100, 100)}%` }} 
                        />
                     </div>
                   </div>
                 );
               })}
             </div>
             <p className="text-[9px] text-slate-400 mt-4 text-center uppercase">Objetivo de Fila: &lt; 20 min</p>
          </div>

        </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;