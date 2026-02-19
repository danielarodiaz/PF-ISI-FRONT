import { useEffect,useState } from "react";
import TableFila from "../components/TableFila";
import { getFila, atenderTurnoConId, putFinalizarAtencion, getTurnoEnVentanilla } from "../helpers/filaApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { 
  RefreshCw, 
  CheckSquare, 
  LogOut, 
  BarChart2, 
  MessageCircleQuestion 
} from "lucide-react";

const HomeAdmin = () => {
  const [fila, setFila] = useState([]);
  const [turnoActual, setTurnoActual] = useState(null);
  const [atendiendo, setAtendiendo] = useState(false);
  const navigate = useNavigate();
  const pendientesCount = fila.filter((item) => !item.atendiendo && !item.atendido).length;

  useEffect(() => {
    document.title = pendientesCount > 0
      ? `(${pendientesCount}) Admin Turnos | InfoTrack`
      : "Admin Turnos | InfoTrack";
  }, [pendientesCount]);

  console.log("[admin-debug][HomeAdmin] render", {
    path: window.location.pathname,
    filaCount: fila.length,
    atendiendo,
    hasTurnoActual: !!turnoActual,
  });

  // --- LÓGICA DE DATOS ---
  const fetchFila = async () => {
    try {
      const filaDb = await getFila();
      const filaTransformada = filaDb.map((item) => ({
        id: item.idTurno,
        legajo: item.turno.legajo,
        tramite: item.turno.tramite.descripcion,
        fecha: item.turno.fechaDeCreacion,
        turno: item.turno.nombreTurno,
        atendiendo: item.turno.estadoTurno.descripcion === "Atendiendo",
        atendido: item.turno.estadoTurno.descripcion === "Atendido",
      }));
      setFila(filaTransformada);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/loginAdmin");
        Swal.fire("Error", "Sesión expirada. Por favor, inicie sesión nuevamente.", "error");
      }
      console.error("Error al obtener la fila:", error);
    }
  };

useEffect(() => {
  console.log("[admin-debug][HomeAdmin] useEffect:init");
  const inicializarPanel = async () => {
    await fetchFila();

    try {
      const turnoDb = await getTurnoEnVentanilla();
      
      if (turnoDb) {
        const turnoMapeado = {
          id: turnoDb.idTurno,
          legajo: turnoDb.legajo,
          tramite: turnoDb.tramite.descripcion,
          fecha: turnoDb.fechaDeCreacion,
          turno: turnoDb.nombreTurno,
          atendiendo: true,
          atendido: false,
        };

        setTurnoActual(turnoMapeado);
        setAtendiendo(true);
        console.log("Estado recuperado exitosamente:", turnoMapeado.turno);
      }
    } catch {
      console.log("No hay turno previo en ventanilla.");
    }
  };

  inicializarPanel();

  const interval = setInterval(fetchFila, 5000);
  return () => clearInterval(interval);
}, []);

  // --- ACCIONES ---
  const atenderTurno = async (turno) => {
    try {
      await atenderTurnoConId(turno.id);
      setTurnoActual(turno);
      setAtendiendo(true);

      await fetchFila();
      
      console.log("Turno atendido y WhatsApp disparado (Mock)");
    } catch {
      Swal.fire("Error", "No se pudo atender el turno. Verifique si ya hay uno en atención.", "error");
    }
  };

  const finalizarAtencion = async () => {
    if (turnoActual) {
      try {
        await putFinalizarAtencion();
        setAtendiendo(false);
        setTurnoActual(null);

        await fetchFila();
        
      } catch (error) {
        console.error("Error al finalizar:", error);
      }
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: "Tendrás que ingresar tus credenciales nuevamente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      background: '#1e293b', 
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        navigate("/loginAdmin");
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 transition-colors duration-300">
      
      <header className="flex flex-col xl:flex-row justify-between items-center mb-8 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors gap-4">
        
        <div className="w-full xl:w-auto">
           <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Panel de Administración</h2>
           <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
             <RefreshCw size={14} className="animate-spin-slow" /> Actualización en tiempo real
           </p>
        </div>
        
        <div className="flex flex-wrap items-center justify-end gap-3 w-full xl:w-auto">
            
            <button 
                onClick={() => navigate("/admin/dashboard")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 rounded-lg font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-100 dark:border-blue-900/50"
            >
                <BarChart2 size={18} />
                Ver Reportes
            </button>

            <button 
                onClick={() => navigate("/admin/faqs")}
                className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 rounded-lg font-semibold hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors border border-purple-100 dark:border-purple-900/50"
            >
                <MessageCircleQuestion size={18} />
                Gestionar FAQs
            </button>

            {/* Separador vertical (solo visible en desktop) */}
            <div className="hidden xl:block w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>

            <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg transition-all border border-red-200 dark:border-red-900/50"
            >
                <LogOut size={18} />
                Salir
            </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: Acción Actual */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-blue-100 dark:border-slate-800 transition-colors h-full">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-white mb-4 border-b dark:border-slate-800 pb-2">
                En Atención
            </h3>
            
            {turnoActual ? (
              <div className="text-center animate-in fade-in zoom-in duration-300">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl mb-6 transition-colors border border-blue-100 dark:border-blue-900/50">
                    <p className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-2">Llamando a</p>
                    <h1 className="text-6xl font-black text-blue-600 dark:text-blue-400 mb-2">{turnoActual.turno}</h1>
                    <p className="text-slate-800 dark:text-white font-bold text-lg">{turnoActual.tramite}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Legajo: {turnoActual.legajo}</p>
                </div>
                
                {atendiendo && (
                  <button 
                    onClick={finalizarAtencion}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-200 dark:shadow-none transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <CheckSquare size={20} /> Finalizar Atención
                  </button>
                )}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                <CheckSquare size={40} className="mb-3 opacity-50" />
                <p className="font-medium">Puesto Libre</p>
                <p className="text-xs mt-1">Selecciona un usuario de la lista</p>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Tabla */}
        <div className="lg:col-span-2">
           <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors flex flex-col h-full">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-700 dark:text-slate-200">Fila de Espera</h3>
                  <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">
                    Total: {fila.length}
                  </span>
              </div>
              
              <div className="p-0 overflow-x-auto flex-grow">
                 <TableFila fila={fila} onAtenderTurno={atenderTurno} />
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default HomeAdmin;
