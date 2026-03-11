import { useEffect, useState, useMemo } from "react";
import { SHIFT_CONFIG, getInstitutionDecimalTime } from "../helpers/shiftConfig";
import { getDatosReportes } from "../helpers/filaApi";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, CartesianGrid, Legend
} from 'recharts';
import {
  parseBackendUtcDate,
  getHourInUserTimeZone,
  diffMinutesBetweenUtcDates,
} from "../helpers/dateTime";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart2, XCircle } from "lucide-react";
import Loader from "../components/Loader"; 



const DashboardMetrics = () => {
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState([]);
  
  
  const navigate = useNavigate();

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
    return rawData.filter((t) => {
      const createdAt = parseBackendUtcDate(t.fechaDeCreacion);
      return createdAt && createdAt >= hace7Dias;
    });
  }, [rawData]);

  const datosTramites = useMemo(() => {
    const conteo = {};
    turnosUltimos7Dias.forEach(t => {
      const nombre = t.tramite?.descripcion || "Sin descripción"; 
      conteo[nombre] = (conteo[nombre] || 0) + 1;
    });

    return Object.keys(conteo).map(key => ({ 
      nombre: key, 
      cantidad: conteo[key] 
    })).sort((a, b) => b.cantidad - a.cantidad);
  }, [turnosUltimos7Dias]);

 const datosConcurrencia = useMemo(() => {
    let manana = 0, tarde = 0;
    turnosUltimos7Dias.forEach(t => {
      const hora = getInstitutionDecimalTime(new Date(t.fechaDeCreacion));
      if (isNaN(hora)) return;
      if (hora <= SHIFT_CONFIG.morningEnd) manana++;
      else tarde++;
    });
    return [
      { name: 'Mañana', value: manana, color: '#94a3b8' },
      { name: 'Tarde', value: tarde, color: '#3b82f6' }
    ];
  }, [turnosUltimos7Dias]);

  const datosAtencion = useMemo(() => {
    const atendidos = turnosUltimos7Dias.filter(t => t.idEstadoTurno === 3 && t.fechaInicioAtencion);
    if (atendidos.length === 0) return 0;
    const total = atendidos.reduce((acc, t) => {
      const min = diffMinutesBetweenUtcDates(t.fechaInicioAtencion, t.fechaUltimaModificacion);
      if (min === null) return acc;
      return acc + Math.max(0, min);
    }, 0);
    return Math.round(total / atendidos.length);
  }, [turnosUltimos7Dias]);

  // 👇 Contamos solo el TOTAL para la tarjetita de la derecha
  const totalCancelados = useMemo(() => {
    return turnosUltimos7Dias.filter(t => 
      t.idEstadoTurno === 4 || 
      (t.estadoTurno?.descripcion && t.estadoTurno.descripcion.toLowerCase().includes("cancelado"))
    ).length;
  }, [turnosUltimos7Dias]);

  // 👇 Armamos los datos para el NUEVO GRÁFICO de abajo
  const datosCanceladosGrafico = useMemo(() => {
    const cancelados = turnosUltimos7Dias.filter(t => 
      t.idEstadoTurno === 4 || 
      (t.estadoTurno?.descripcion && t.estadoTurno.descripcion.toLowerCase().includes("cancelado"))
    );

    const agrupados = {};
    cancelados.forEach(t => {
      // Intentamos leerlo en minúscula o mayúscula por si el backend lo manda distinto
      const motivoBruto = t.motivoCancelacion || t.MotivoCancelacion;
      const motivo = motivoBruto?.trim() || "Sin motivo registrado";
      agrupados[motivo] = (agrupados[motivo] || 0) + 1;
    });

    return Object.keys(agrupados).map(motivo => ({ 
      // Acortamos el texto para que entre bien en el eje Y del gráfico
      nombreCorto: motivo.length > 25 ? motivo.substring(0, 25) + '...' : motivo,
      motivoCompleto: motivo, // Lo guardamos por si queremos mostrarlo en el Tooltip
      cantidad: agrupados[motivo] 
    })).sort((a, b) => b.cantidad - a.cantidad);
  }, [turnosUltimos7Dias]);


  const datosCarrerasComisiones = useMemo(() => {
    const turnosValidos = turnosUltimos7Dias.filter(t => t.carreraAlumno);
    const agrupados = {};

    turnosValidos.forEach(t => {
      // Etiqueta para el eje Y: "Carrera (Comisión)"
      const etiqueta = `${t.carreraAlumno}${t.comisionAlumno ? ` (${t.comisionAlumno})` : ''}`;
      
      if (!agrupados[etiqueta]) {
        agrupados[etiqueta] = { 
          nombre: etiqueta, 
          cantidad: 0, 
          carrera: t.carreraAlumno // Guardamos la carrera para decidir el color
        };
      }
      agrupados[etiqueta].cantidad += 1;
    });

    return Object.values(agrupados).sort((a, b) => b.cantidad - a.cantidad);
  }, [turnosUltimos7Dias]);

  // Definimos los colores por carrera
  const coloresCarreras = {
    "Ingeniería en Sistemas de Información": "#3b82f6", // Azul
    "Ingeniería Mecánica": "#ef4444",                 // Rojo
    "Ingeniería Eléctrica": "#f59e0b",                 // Naranja/Ámbar
    "Otro": "#94a3b8"                                   // Gris
  };


  if (loading) return <Loader mensaje="Cargando métricas de InfoTrack..." />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 transition-colors duration-300 pb-20">
      
      {/* ENCABEZADO */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors gap-4">
         <div className="flex items-center gap-4">
           <button
             onClick={() => navigate("/admin/homeAdmin")}
             className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
             title="Volver al panel principal"
           >
             <ArrowLeft size={24} />
           </button>
           <div>
             <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
               <BarChart2 className="text-blue-500" />
               Dashboard de Métricas
             </h2>
             <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
               Análisis de concurrencia y tiempos de atención de los últimos 7 días
             </p>
           </div>
         </div>
      </header>

      {/* DISPOSICIÓN CLÁSICA: 2 Columnas Izq / 1 Columna Der */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-6">
        
        {/* IZQUIERDA: PANEL PRINCIPAL GIGANTE (Trámites) */}
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
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="cantidad" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DERECHA: COLUMNA DE INDICADORES (Originales) */}
        <div className="flex flex-col gap-6">
          
          {/* Tarjeta 1: Concurrencia */}
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
            <div className="flex justify-around mt-4 text-[10px] font-bold text-slate-500 uppercase">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-400" /> Mañana</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Tarde</span>
            </div>
          </div>

          {/* Tarjeta 2: Eficiencia Operativa */}
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

          {/* Tarjeta 3: Tiempo de Espera */}
          <div className="bg-white dark:bg-slate-900 shadow-lg rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Espera Promedio</h3>
             <div className="space-y-4">
               {datosConcurrencia.map((item, i) => {
                 const turnosFranja = turnosUltimos7Dias.filter(t => {
                    const hora = getHourInUserTimeZone(t.fechaDeCreacion);
                    if (hora === null || (!t.fechaInicioAtencion && t.idEstadoTurno !== 3)) return false;
                    if (item.name === 'Mañana') return hora < 14;
                    if (item.name === 'Tarde') return hora >= 14;
                    return false;
                 });
                 
                 const sumaEspera = turnosFranja.reduce((acc, t) => {
                    const end = t.fechaInicioAtencion || t.fechaUltimaModificacion;
                    const diff = diffMinutesBetweenUtcDates(t.fechaDeCreacion, end);
                    if (diff === null) return acc;
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

          {/* Tarjeta 4: Turnos Cancelados (Mini) */}
          <div className="bg-white dark:bg-slate-900 shadow-lg rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Turnos Cancelados</h3>
              <div className="text-3xl font-black text-red-500 dark:text-red-400">{totalCancelados}</div>
              <p className="text-[10px] text-slate-500 uppercase mt-1">En los últimos 7 días</p>
            </div>
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <XCircle className="text-red-500 dark:text-red-400" size={24} />
            </div>
          </div>

        </div>
      </div>

     {/* GRÁFICO DE CANCELACIONES */}
      <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col min-h-[400px] mb-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Motivos de Cancelación</h2>
          <p className="text-slate-500">Distribución de las razones por las cuales los turnos no fueron completados</p>
        </div>
        
        <div className="flex-grow w-full h-[350px]">
          {datosCanceladosGrafico.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={datosCanceladosGrafico} margin={{ top: 0, right: 30, left: 50, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis dataKey="nombreCorto" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13}} width={220} />
                <Tooltip 
                  cursor={{fill: 'transparent'}} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value, name, props) => [value, props.payload.motivoCompleto]} 
                />
                <Bar dataKey="cantidad" fill="#ef4444" radius={[0, 6, 6, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <XCircle size={48} className="mb-4 opacity-20" />
              <p className="text-lg">No hay turnos cancelados registrados en este período.</p>
            </div>
          )}
        </div>
      </div>
{/* 👇 GRÁFICO ACTUALIZADO: POR COMISIÓN Y COLOR POR CARRERA */}
      <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col min-h-[500px]">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Trámites por Comisión</h2>
          <p className="text-slate-500">Volumen total de atención segmentado por grupo y carrera</p>
        </div>
        
        <div className="flex-grow w-full h-[400px]">
          {datosCarrerasComisiones.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={datosCarrerasComisiones} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis dataKey="nombre" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} width={200} />
                <Tooltip 
                  cursor={{fill: 'transparent'}} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                
                <Bar dataKey="cantidad" radius={[0, 6, 6, 0]} barSize={25}>
                  {/* Aquí asignamos el color dinámico a cada barra individual */}
                  {datosCarrerasComisiones.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={coloresCarreras[entry.carrera] || coloresCarreras["Otro"]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <BarChart2 size={48} className="mb-4 opacity-20" />
              <p className="text-lg">Aún no hay datos de comisiones registrados.</p>
            </div>
          )}
        </div>

        {/* LEYENDA MANUAL DE COLORES */}
        <div className="flex flex-wrap gap-4 mt-6 justify-center">
          {Object.keys(coloresCarreras).map(c => c !== "Otro" && (
            <div key={c} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: coloresCarreras[c] }} />
              <span className="text-xs text-slate-500 font-medium">{c}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DashboardMetrics;