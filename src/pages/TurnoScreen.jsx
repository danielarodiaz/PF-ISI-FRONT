import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cancelarTurnoPorToken, createTurnoActivoStream } from "../helpers/filaApi";
import { Users, Clock, LogOut } from "lucide-react";
import PageLayout from "../components/layout/PageLayout";
import { clearTurnoActivo, getTurnoActivoRef, saveTurnoActivo, updateTurnoActivoRef } from "../helpers/turnoStorage";
import { getFila, getDatosReportes } from "../helpers/filaApi";
// 👇 Importamos SweetAlert2
import Swal from "sweetalert2";


export const TurnoPage = () => {
  const navigate = useNavigate();
  const [posicionInicial, setPosicionInicial] = useState(null);
  const [promedioFranja, setPromedioFranja] = useState(15);

  const [numeroTurno, setNumeroTurno] = useState("");
  const [esTurno, setEsTurno] = useState(false);
  const [personasAdelante, setPersonasAdelante] = useState(5);
  const [tiempoEspera, setTiempoEspera] = useState(10);
  const [progreso, setProgreso] = useState(0);
  const [datosTurno, setDatosTurno] = useState({ legajo: 0, tramite: "", NombreTurno: "" });
  const [porAtender, setPorAtender] = useState(false);
  const streamRef = useRef(null);
  const initialAheadRef = useRef(null);

  const applyTurnoSnapshot = (turnoData, personas) => {
    if (!turnoData) {
      clearTurnoActivo();
      navigate("/");
      return;
    }

    saveTurnoActivo(turnoData);
    setDatosTurno(turnoData);
    setNumeroTurno(turnoData.nombreTurno);
    
    const personasActual = personas ?? 0;

    // --- LÓGICA DE BARRA DE PROGRESO (HÍBRIDA) ---
    if (initialAheadRef.current === null) {
      const ref = getTurnoActivoRef();
      const persistedInitial = Number(ref?.initialPersonasAdelante);
      
      if (Number.isFinite(persistedInitial) && persistedInitial > 0) {
        initialAheadRef.current = persistedInitial;
      } else if (personasActual > 0) {
        initialAheadRef.current = personasActual;
        updateTurnoActivoRef({ initialPersonasAdelante: personasActual });
      }
    }

    const initialAhead = Math.max(1, Number(initialAheadRef.current));
    const progressed = Math.max(0, initialAhead - personasActual);
    
    const progresoMatematico = Math.round((progressed / initialAhead) * 100);
    const progresoUX = 100 - (personasActual * 10);

    let progresoReal;
    
    if (personasActual === 0) {
      progresoReal = 100;
    } else {
      progresoReal = Math.max(5, progresoMatematico, progresoUX);
      progresoReal = Math.min(98, progresoReal);
    }

    setPersonasAdelante(personasActual);
    setTiempoEspera(personasActual * promedioFranja); 
    setProgreso(progresoReal);

    if (turnoData.idEstadoTurno === 3 || turnoData.idEstadoTurno === 4) {
      clearTurnoActivo();
      navigate("/");
      return;
    }

    if (personasActual === 0 && turnoData.idEstadoTurno === 1) {
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

      stream.onerror = () => {};
    } catch (error) {
      console.error("No se pudo iniciar stream SSE turno:", error);
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.close();
      }
    };
  }, [navigate]);

  useEffect(() => {
    const fetchPromedio = async () => {
      try {
        const reportes = await getDatosReportes();
        if (!reportes || reportes.length === 0) return;

        const ahora = new Date();
        const horaDecimal = ahora.getHours() + ahora.getMinutes() / 60;

        const esManana = horaDecimal >= 9 && horaDecimal <= 13;
        const esTarde = horaDecimal >= 15.5 && horaDecimal <= 20.5;

        const hace7Dias = new Date();
        hace7Dias.setDate(hace7Dias.getDate() - 7);

        const atendidosFranja = reportes.filter(t => {
           if (t.idEstadoTurno !== 3 || !t.fechaDeCreacion || !t.fechaUltimaModificacion) return false;
           const fechaCreacion = new Date(t.fechaDeCreacion);
           if (fechaCreacion < hace7Dias) return false;

           const tHoraDec = fechaCreacion.getHours() + fechaCreacion.getMinutes() / 60;
           if (esManana) return tHoraDec >= 9 && tHoraDec <= 13;
           if (esTarde) return tHoraDec >= 15.5 && tHoraDec <= 20.5;
           return false;
        });

        if (atendidosFranja.length > 0) {
           const sumaMinutos = atendidosFranja.reduce((acc, t) => {
              const diff = (new Date(t.fechaUltimaModificacion) - new Date(t.fechaDeCreacion)) / 60000;
              return acc + Math.max(0, diff);
           }, 0);
           const promedioReal = Math.round(sumaMinutos / atendidosFranja.length);
           setPromedioFranja(Math.max(2, promedioReal)); 
        }
      } catch (error) {
        console.error("Error calculando el promedio:", error);
      }
    };

    fetchPromedio();
  }, []);

  const getStatusColor = () => {
    if (esTurno) return "bg-green-500 shadow-green-200 dark:shadow-none";
    if (porAtender) return "bg-amber-500 shadow-amber-200 dark:shadow-none";
    return "bg-blue-600 shadow-blue-200 dark:shadow-none";
  };

  // 👇 LÓGICA DE CANCELACIÓN NUEVA (UN SOLO MODAL DINÁMICO)
  const handleCancel = async () => {
    const turnoRef = getTurnoActivoRef();
    if (!turnoRef?.publicToken) return;

    const isDarkMode = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');

    // Clases de Tailwind para que los inputs queden hermosos en Claro y Oscuro
    const inputClasses = 'w-full p-3 mt-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none outline-none transition-all';

    const { value: motivoFinal, isConfirmed } = await Swal.fire({
      title: 'Cancelar Turno',
      text: 'Por favor, indicanos el motivo de la cancelación para ayudarnos a mejorar:',
      // 👇 Armamos nuestro propio HTML para controlar exactamente cómo se ve
      html: `
        <select id="swal-select-motivo" class="${inputClasses}">
          <option value="" disabled selected>Seleccione un motivo...</option>
          <option value="Tiempo de espera excesivo">Tiempo de espera excesivo</option>
          <option value="Trámite resuelto por otro medio">Trámite resuelto por otro medio</option>
          <option value="El Chatbot resolvió mi consulta">El Chatbot resolvió mi consulta</option>
          <option value="Error al solicitar / Turno duplicado">Error al solicitar / Turno duplicado</option>
          <option value="Decidí postergar el trámite">Decidí postergar el trámite</option>
          <option value="Otro">Otro motivo...</option>
        </select>
        
        <textarea id="swal-input-otro" class="${inputClasses} resize-none hidden" rows="3" placeholder="Escriba el motivo aquí..."></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirmar Cancelación',
      cancelButtonText: 'Volver',
      confirmButtonColor: '#d33',
      cancelButtonColor: isDarkMode ? '#475569' : '#64748b',
      background: isDarkMode ? '#1e293b' : '#fff',
      color: isDarkMode ? '#f8fafc' : '#1e293b',
      
      // 👇 Esta función se ejecuta apenas se abre el cartel
      didOpen: () => {
        const select = document.getElementById('swal-select-motivo');
        const textarea = document.getElementById('swal-input-otro');
        
        // Escuchamos cuando cambia el select
        select.addEventListener('change', (e) => {
          if (e.target.value === 'Otro') {
            textarea.classList.remove('hidden'); // Mostramos el campo de texto
            textarea.focus();
          } else {
            textarea.classList.add('hidden'); // Lo ocultamos
            textarea.value = ''; // Limpiamos lo que haya escrito
          }
        });
      },
      
      // 👇 Esta función valida y extrae el valor antes de cerrar
      preConfirm: () => {
        const selectValue = document.getElementById('swal-select-motivo').value;
        const textValue = document.getElementById('swal-input-otro').value;

        if (!selectValue) {
          Swal.showValidationMessage('Debes seleccionar un motivo');
          return false;
        }

        if (selectValue === 'Otro') {
          if (!textValue.trim()) {
            Swal.showValidationMessage('Por favor, escribe el motivo');
            return false;
          }
          return textValue.trim(); // Mandamos el texto libre
        }

        return selectValue; // Mandamos la opción del select
      }
    });

    if (isConfirmed && motivoFinal) {
      // Llamamos a la API con el token y el motivo final
      try {
        await cancelarTurnoPorToken(turnoRef.publicToken, motivoFinal); 
        clearTurnoActivo();
        
        // Cartelito de éxito antes de redirigir
        await Swal.fire({
          title: 'Turno Cancelado',
          text: 'El turno ha sido cancelado exitosamente.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          background: isDarkMode ? '#1e293b' : '#fff',
          color: isDarkMode ? '#f8fafc' : '#1e293b',
        });

        navigate("/");
      } catch (error) {
        console.error("Error al cancelar el turno en el servidor:", error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cancelar el turno. Intente nuevamente.',
          icon: 'error',
          background: isDarkMode ? '#1e293b' : '#fff',
          color: isDarkMode ? '#f8fafc' : '#1e293b',
        });
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

        {/* Stats Grid */}
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

        {/* Progreso */}
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

        {/* Botón Cancelar */}
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