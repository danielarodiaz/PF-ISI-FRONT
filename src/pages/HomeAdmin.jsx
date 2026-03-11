import { useEffect, useRef, useState } from "react";
import TableFila from "../components/TableFila";
// 👇 Agregamos getTramites a la importación
import { atenderTurnoConId, putFinalizarAtencion, createAdminFilaStream, getTramites } from "../helpers/filaApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import confetti from "canvas-confetti";
import { ClipboardList } from "lucide-react";
import { cerrarSesion, cerrarSesionLocal } from "../helpers/login";
import { 
  RefreshCw, 
  CheckSquare, 
  LogOut, 
  BarChart2, 
  MessageCircleQuestion ,
  Moon, 
  Sun
} from "lucide-react";

import Loader from "../components/Loader";

const shootSuccessConfetti = () => {
  const count = 180;
  const defaults = {
    origin: { y: 0.75 },
    spread: 80,
    ticks: 220,
    scalar: 1.1,
    zIndex: 2000,
  };

  confetti({ ...defaults, particleCount: Math.floor(count * 0.6), origin: { x: 0.15, y: 0.75 } });
  confetti({ ...defaults, particleCount: Math.floor(count * 0.4), origin: { x: 0.85, y: 0.75 } });
};

const HomeAdmin = () => {
  const [fila, setFila] = useState([]);
  const [turnoActual, setTurnoActual] = useState(null);
  const [atendiendo, setAtendiendo] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  
  // 👇 NUEVO ESTADO: Para guardar la lista de todos los trámites posibles
  const [listaTramites, setListaTramites] = useState([]);
  
  const streamRef = useRef(null);
  const navigate = useNavigate();
  const pendientesCount = fila.filter((item) => !item.atendiendo && !item.atendido).length;

  useEffect(() => {
    document.title = pendientesCount > 0
      ? `(${pendientesCount}) Admin Turnos | InfoTrack`
      : "Admin Turnos | InfoTrack";
  }, [pendientesCount]);

  // 👇 NUEVO EFECTO: Cargamos los trámites al inicio para tenerlos listos en el modal
  useEffect(() => {
    const fetchTramites = async () => {
      try {
        const data = await getTramites();
        setListaTramites(data || []);
      } catch (error) {
        console.error("Error al cargar lista de trámites:", error);
      }
    };
    fetchTramites();
  }, []);

  const mapTurno = (turnoDb) => {
    if (!turnoDb) return null;
    return {
      id: turnoDb.idTurno,
      legajo: turnoDb.legajo,
      tramite: turnoDb.tramite.descripcion,
      fecha: turnoDb.fechaDeCreacion,
      turno: turnoDb.nombreTurno,
      atendiendo: turnoDb.estadoTurno?.descripcion === "Atendiendo",
      atendido: turnoDb.estadoTurno?.descripcion === "Atendido",
    };
  };

  const mapFila = (filaDb = []) =>
    filaDb.map((item) => ({
      id: item.idTurno,
      legajo: item.turno.legajo,
      tramite: item.turno.tramite.descripcion,
      fecha: item.turno.fechaDeCreacion,
      turno: item.turno.nombreTurno,
      atendiendo: item.turno.estadoTurno.descripcion === "Atendiendo",
      atendido: item.turno.estadoTurno.descripcion === "Atendido",
    }));

  useEffect(() => {
    try {
      const stream = createAdminFilaStream();
      streamRef.current = stream;

      stream.addEventListener("fila.snapshot", (event) => {
        try {
          const payload = JSON.parse(event.data);
          setFila(mapFila(payload.fila || []));
          setTurnoActual(mapTurno(payload.turnoEnVentanilla));
          setAtendiendo(Boolean(payload.turnoEnVentanilla));
        } catch (error) {
          console.error("Error parseando SSE admin:", error);
        }
      });

      stream.onerror = () => {};
    } catch (error) {
      console.error("No se pudo iniciar stream SSE admin:", error);
      if (error.response && error.response.status === 401) {
        cerrarSesionLocal();
        navigate("/loginAdmin");
        Swal.fire("Error", "Sesión expirada. Por favor, inicie sesión nuevamente.", "error");
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.close();
      }
    };
  }, [navigate]);

  const atenderTurno = async (turno) => {
    try {
      await atenderTurnoConId(turno.id);
      setTurnoActual(turno);
      setAtendiendo(true);
    } catch {
      Swal.fire("Error", "No se pudo atender el turno. Verifique si ya hay uno en atención.", "error");
    }
  };

  // 👇 LÓGICA MODIFICADA: El modal inteligente para auditar el trámite
  const finalizarAtencion = async () => {
    if (!turnoActual) return;

    // Detectamos si el body tiene la clase 'dark' (asumiendo que tu ThemeContext la pone ahí)
    const isDarkMode = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');

    const opcionesHTML = listaTramites.map(t => 
      `<option value="${t.descripcion}" ${t.descripcion === turnoActual.tramite ? 'selected' : ''}>
        ${t.descripcion}
      </option>`
    ).join('');

    const { value: formValues, isConfirmed } = await Swal.fire({
      title: 'Finalizar Atención',
      // 👇 PROPIEDADES PARA EL MODO OSCURO
      background: isDarkMode ? '#1e293b' : '#fff', // slate-800 o blanco
      color: isDarkMode ? '#f8fafc' : '#1e293b',    // slate-50 o slate-800
      html: `
        <div class="text-left mt-4 space-y-4">
          <div>
            <label class="block mb-2 text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}">¿El trámite consultado es correcto?</label>
            <select id="swal-tramite" class="w-full px-4 py-3 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              ${opcionesHTML}
            </select>
          </div>
          <div>
            <label class="block mb-2 text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}">Comentarios (Opcional)</label>
            <textarea id="swal-comentario" rows="3" class="w-full px-4 py-3 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Escriba aquí comentarios sobre el turno"></textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar y Finalizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#16a34a',
      // 👇 Color del botón de cancelar en modo oscuro
      cancelButtonColor: isDarkMode ? '#475569' : '#64748b', 
      preConfirm: () => {
        return {
          tramiteReal: document.getElementById('swal-tramite').value,
          comentario: document.getElementById('swal-comentario').value
        };
      }
    });

    if (isConfirmed && formValues) {
      try {
        await putFinalizarAtencion(turnoActual.id, formValues.tramiteReal, formValues.comentario);
        setAtendiendo(false);
        setTurnoActual(null);
        shootSuccessConfetti();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al guardar.",
          icon: "error",
          background: isDarkMode ? '#1e293b' : '#fff',
          color: isDarkMode ? '#f8fafc' : '#1e293b'
        });
      }
    }
  };

  const handleLogout = async () => {
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        await cerrarSesion();
        cerrarSesionLocal();
        navigate("/loginAdmin");
      }
    });
  };

  if (loading) {
    return <Loader mensaje="Cargando inicio del administrador..." />;
  }

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

            <button 
              onClick={() => navigate("/admin/historial")}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 rounded-lg font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors border border-emerald-100 dark:border-emerald-900/50"
            >
                  <ClipboardList size={18} />
                  Ver Historial
           </button>

           <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Cambiar tema"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

            {/* Separador vertical */}
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
                 <TableFila fila={fila} onAtenderTurno={atenderTurno} turnoActual={turnoActual} />
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default HomeAdmin;