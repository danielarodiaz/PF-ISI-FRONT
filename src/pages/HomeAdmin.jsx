import React, { useState, useEffect } from "react";
import TableFila from "../components/TableFila";
// import CardFilaNow from "../components/CardFilaNow"; // Ya no se usa explícitamente aquí, lo hiciste inline
import { getFila, atenderTurnoConId, putFinalizarAtencion } from "../helpers/filaApi";
import { useNavigate } from "react-router-dom";
import { verificarToken } from "../helpers/login";
import Swal from "sweetalert2";
import { RefreshCw, CheckSquare } from "lucide-react";

const HomeAdmin = () => {
  const [fila, setFila] = useState([]);
  const [turnoActual, setTurnoActual] = useState(null);
  const [atendiendo, setAtendiendo] = useState(false);
  // const [segundos, setSegundos] = useState(0); // No se usa en el render, se puede omitir si quieres limpiar
  const navigate = useNavigate();

  const fetchFila = async () => {
    try {
      const filaDb = await getFila();
      const filaTransformada = filaDb.map((item) => ({
        id: item.idTurno,
        legajo: item.turno.legajo,
        tramite: item.turno.tramite.descripcion,
        fecha: item.turno.fechaDeCreacion,
        turno: item.turno.nombreTurno,
        atendido: item.turno.estadoTurno.descripcion === "Atendido",
      }));
      setFila(filaTransformada);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Sesión Expirada",
        text: "Vuelve a iniciar sesión.",
      }).then(() => window.location.reload());
    }
  };

  useEffect(() => {
    fetchFila();
    const interval = setInterval(fetchFila, 5000);
    return () => clearInterval(interval);
  }, []);

  const atenderTurno = (turno) => {
    atenderTurnoConId(turno.id);
    setTurnoActual(turno);
    setAtendiendo(true);
    // setSegundos(60); 
  };

  const finalizarAtencion = () => {
    if (turnoActual) {
      const nuevaFila = fila.map((t) => t.id === turnoActual.id ? { ...t, atendido: true } : t);
      putFinalizarAtencion();
      setFila(nuevaFila);
      setAtendiendo(false);
      setTurnoActual(null);
      // setSegundos(0);
    }
  };

  return (
    // 1. FONDO GENERAL: dark:bg-slate-950
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 transition-colors duration-300">
      
      {/* 2. HEADER: Fondo blanco -> Fondo oscuro, Borde sutil, Texto blanco */}
      <header className="flex justify-between items-center mb-8 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Panel de Administración</h2>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <RefreshCw size={16} className="animate-spin-slow" /> Actualización automática
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Acción Actual */}
        <div className="lg:col-span-1 space-y-6">
          {/* 3. CARD DE ACCIÓN: Fondo oscuro */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-blue-100 dark:border-slate-800 transition-colors">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-white mb-4 border-b dark:border-slate-800 pb-2">
                En Atención
            </h3>
            
            {turnoActual ? (
              <div className="text-center">
                {/* 4. TARJETA INTERNA (Turno activo): 
                    - dark:bg-blue-900/20: Fondo azul transparente oscuro
                    - Textos adaptados a claro
                */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-4 transition-colors">
                    <h1 className="text-5xl font-black text-blue-600 dark:text-blue-400 mb-2">{turnoActual.turno}</h1>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">{turnoActual.tramite}</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500">Legajo: {turnoActual.legajo}</p>
                </div>
                
                {atendiendo && (
                  <button 
                    onClick={finalizarAtencion}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md shadow-green-200 dark:shadow-none transition-all"
                  >
                    <CheckSquare size={20} /> Finalizar Atención
                  </button>
                )}
              </div>
            ) : (
              // 5. ESTADO VACÍO (Placeholder): Fondo y bordes oscuros
              <div className="py-12 text-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                <p>No hay turno seleccionado</p>
                <p className="text-xs mt-2">Selecciona uno de la lista</p>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Tabla de Fila */}
        <div className="lg:col-span-2">
           {/* 6. CONTENEDOR TABLA: Fondo oscuro */}
           <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-700 dark:text-slate-200">Fila de Espera</h3>
              </div>
              
              <div className="p-0 overflow-x-auto">
                 {/* TableFila ya tiene su propia lógica dark: implementada, así que aquí solo la llamamos */}
                 <TableFila fila={fila} onAtenderTurno={atenderTurno} />
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default HomeAdmin;