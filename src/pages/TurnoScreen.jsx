import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cancelarTurnoPorToken, createTurnoActivoStream } from "../helpers/filaApi";
import { Users, Clock, LogOut } from "lucide-react";
import PageLayout from "../components/layout/PageLayout";
import { clearTurnoActivo, getTurnoActivoRef, saveTurnoActivo } from "../helpers/turnoStorage";

const TurnoPage = () => {
  const navigate = useNavigate();
  
  const [numeroTurno, setNumeroTurno] = useState("");
  const [esTurno, setEsTurno] = useState(false);
  const [personasAdelante, setPersonasAdelante] = useState(5);
  const [tiempoEspera, setTiempoEspera] = useState(10);
  const [progreso, setProgreso] = useState(0);
  const [datosTurno, setDatosTurno] = useState({ legajo: 0, tramite: "", NombreTurno: "" });
  const [porAtender, setPorAtender] = useState(false);
  const streamRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const applyTurnoSnapshot = (turnoData, personas) => {
    if (!turnoData) {
      clearTurnoActivo();
      navigate("/");
      return;
    }

    saveTurnoActivo(turnoData);
    setDatosTurno(turnoData);
    setNumeroTurno(turnoData.nombreTurno);
    setPersonasAdelante(personas ?? 0);
    setTiempoEspera((personas ?? 0) * 3);
    setProgreso((( ((personas ?? 0) + 1) - (personas ?? 0)) / ((personas ?? 0) + 1)) * 100);

    if (turnoData.idEstadoTurno === 3 || turnoData.idEstadoTurno === 4) {
      clearTurnoActivo();
      navigate("/");
      return;
    }

    if ((personas ?? 0) === 0 && turnoData.idEstadoTurno === 1) {
      setEsTurno(false);
      setPorAtender(true);
    } else if (turnoData.idEstadoTurno === 2) {
      setEsTurno(true);
      setPorAtender(false);
    } else {
      setEsTurno(false);
      setPorAtender(false);
    }
  };

  const getTituloPrincipal = () => {
    if (esTurno) return "¡Es tu turno!";
    if (porAtender) return "Te están por atender";
    return "Tu número es";
  };

  useEffect(() => {
    const turnoRef = getTurnoActivoRef();
    if (!turnoRef?.publicToken) {
      navigate("/");
      return undefined;
    }

    const publicToken = turnoRef.publicToken;

    const connectStream = () => {
      try {
        const stream = createTurnoActivoStream(publicToken);
        streamRef.current = stream;

        stream.addEventListener("turno.snapshot", (event) => {
          try {
            const payload = JSON.parse(event.data);
            if (payload?.error) {
              clearTurnoActivo();
              navigate("/");
              return;
            }

            applyTurnoSnapshot(payload.turno, payload.personasAdelante ?? 0);
          } catch (error) {
            console.error("Error parseando SSE turno:", error);
          }
        });

        stream.onerror = () => {
          stream.close();
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          reconnectTimeoutRef.current = setTimeout(connectStream, 2000);
        };
      } catch (error) {
        console.error("No se pudo iniciar stream SSE turno:", error);
      }
    };

    connectStream();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (streamRef.current) {
        streamRef.current.close();
      }
    };
  }, [navigate]);

  const getStatusColor = () => {
    if (esTurno) return "bg-green-500 shadow-green-200 dark:shadow-none";
    if (porAtender) return "bg-amber-500 shadow-amber-200 dark:shadow-none";
    return "bg-blue-600 shadow-blue-200 dark:shadow-none";
  };

  // Función para cancelar manualmente
  const handleCancel = async () => {
    const turnoRef = getTurnoActivoRef();
    if (turnoRef?.publicToken) {
      try {
        await cancelarTurnoPorToken(turnoRef.publicToken); 
        clearTurnoActivo();
        navigate("/");
      } catch (error) {
        console.error("Error al cancelar el turno en el servidor:", error);
      }
    }
  };

  return (
    <PageLayout title={`Legajo: ${datosTurno.legajo && datosTurno.legajo !== 0 ? datosTurno.legajo : "Sin Legajo"}`}>
      <div className="max-w-2xl mx-auto text-center space-y-8">
        
        {/* Card Principal */}
        <div className={`transform transition-all duration-500 hover:scale-105 rounded-3xl p-8 shadow-2xl text-white ${getStatusColor()}`}>
          <h2 className="text-xl opacity-90 mb-2 font-medium">{getTituloPrincipal()}</h2>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter drop-shadow-lg">
            {numeroTurno}
          </h1>
          {esTurno && (
             <p className="mt-4 text-lg font-semibold bg-white/20 py-2 px-4 rounded-full inline-block backdrop-blur-sm animate-pulse">
                ¡Pasa a Dpto. Alumnos!
             </p>
          )}
        </div>

        {/* Stats Grid (Igual que antes) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 flex flex-col items-center transition-colors">
            <Users className="w-8 h-8 text-blue-500 dark:text-blue-400 mb-2" />
            <span className="text-3xl font-bold text-slate-800 dark:text-white">{personasAdelante}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">Personas adelante</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 flex flex-col items-center transition-colors">
            <Clock className="w-8 h-8 text-orange-500 dark:text-orange-400 mb-2" />
            <span className="text-3xl font-bold text-slate-800 dark:text-white">{tiempoEspera}m</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">Tiempo estimado</span>
          </div>
        </div>

        {/* Progreso (Igual que antes) */}
        {!esTurno && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 transition-colors">
            <div className="flex justify-between mb-2">
              <h5 className="font-semibold text-slate-700 dark:text-white">Progreso en la fila</h5>
              <span className="text-blue-600 dark:text-blue-400 font-bold">{Math.round(progreso)}%</span>
            </div>
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

        {/* Botón Cancelar corregido */}
        <button
          onClick={handleCancel}
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
