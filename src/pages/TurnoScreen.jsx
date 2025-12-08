import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { personasAdelanteEnLaFila, getTurnoById } from "../helpers/filaApi";
import { Users, Clock, LogOut } from "lucide-react";
import PageLayout from "../components/layout/PageLayout";

const TurnoPage = () => {
  const navigate = useNavigate();
  
  const [turnoActual, setTurnoActual] = useState("");
  const [esTurno, setEsTurno] = useState(false);
  const [personasAdelante, setPersonasAdelante] = useState(5);
  const [tiempoEspera, setTiempoEspera] = useState(10);
  const [progreso, setProgreso] = useState(0);
  const [datosTurno, setDatosTurno] = useState({ legajo: 0, tramite: "", NombreTurno: "" });
  const [porAtender, setPorAtender] = useState(false);

  const obtenerTurno = async (idTurno) => {
    try {
      let turnoData = await getTurnoById(idTurno);
      sessionStorage.setItem(`turno_${idTurno}`, JSON.stringify(turnoData));
      
      setDatosTurno(turnoData);
      fetchPersonasAdelante(turnoData);
      setTurnoActual(turnoData.nombreTurno);
    } catch (error) {
      console.error("Error obteniendo turno:", error);
    }
  };

  const fetchPersonasAdelante = async (turnoData) => {
    try {
      const personas = await personasAdelanteEnLaFila(turnoData.idTurno);
      setPersonasAdelante(personas);
      setTiempoEspera(personas * 3);
      setProgreso((( (personas + 1) - personas) / (personas + 1)) * 100);

      if(turnoData.idEstadoTurno == 3) navigate("/");

      if (personas === 0 && turnoData.idEstadoTurno == 1) {
        setPorAtender(true);
        setTurnoActual("Te están por atender");
      } else if (turnoData.idEstadoTurno == 2) {
        setEsTurno(true);
        setTurnoActual(`¡Es tu turno ${turnoData.nombreTurno}!`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const turnoGuardado = sessionStorage.getItem("turnoActivo");
    if (turnoGuardado) {
      const data = JSON.parse(turnoGuardado);
      obtenerTurno(data.idTurno);
      const interval = setInterval(() => obtenerTurno(data.idTurno), 5000);
      return () => clearInterval(interval);
    } else {
      navigate("/");
    }
  }, []);

  const getStatusColor = () => {
    if (esTurno) return "bg-green-500 shadow-green-200 dark:shadow-none";
    if (porAtender) return "bg-amber-500 shadow-amber-200 dark:shadow-none";
    return "bg-blue-600 shadow-blue-200 dark:shadow-none";
  };

  return (
    <PageLayout title={`Legajo: ${datosTurno.legajo}`}>
      <div className="max-w-2xl mx-auto text-center space-y-8">
        
        {/* Card Principal del Turno */}
        <div className={`transform transition-all duration-500 hover:scale-105 rounded-3xl p-8 shadow-2xl text-white ${getStatusColor()}`}>
          <h2 className="text-xl opacity-90 mb-2 font-medium">Tu número es</h2>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter drop-shadow-lg">
            {turnoActual}
          </h1>
          {esTurno && (
             <p className="mt-4 text-lg font-semibold bg-white/20 py-2 px-4 rounded-full inline-block backdrop-blur-sm animate-pulse">
                ¡Pasa a Dpto. Alumnos!
             </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Card Personas */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 flex flex-col items-center transition-colors">
            <Users className="w-8 h-8 text-blue-500 dark:text-blue-400 mb-2" />
            <span className="text-3xl font-bold text-slate-800 dark:text-white">{personasAdelante}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">Personas adelante</span>
          </div>

          {/* Card Tiempo */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 flex flex-col items-center transition-colors">
            <Clock className="w-8 h-8 text-orange-500 dark:text-orange-400 mb-2" />
            <span className="text-3xl font-bold text-slate-800 dark:text-white">{tiempoEspera}m</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">Tiempo estimado</span>
          </div>
        </div>

        {/* Progreso */}
        {!esTurno && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 transition-colors">
            <div className="flex justify-between mb-2">
              <h5 className="font-semibold text-slate-700 dark:text-white">Progreso en la fila</h5>
              <span className="text-blue-600 dark:text-blue-400 font-bold">{Math.round(progreso)}%</span>
            </div>
            {/* Barra de fondo */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-blue-600 dark:bg-blue-500 h-4 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${progreso}%` }}
              >
                <div className="w-full h-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12"></div>
              </div>
            </div>
          </div>
        )}

        {/* Botón Cancelar */}
        <button
          onClick={() => {
            sessionStorage.removeItem(`turno_${datosTurno.idTurno}`);
            navigate("/");
          }}
          className="group flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 mx-auto bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 dark:bg-red-900/10 dark:hover:bg-red-900/30 dark:text-red-400 dark:border-red-900/50 font-semibold rounded-xl transition-all"
        >
          <LogOut size={18} />
          Cancelar Turno
        </button>
      </div>
    </PageLayout>
  );
};

export default TurnoPage;