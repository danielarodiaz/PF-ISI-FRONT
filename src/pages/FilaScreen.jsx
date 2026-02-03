import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import { initializeDatabase } from "../data/dataFila.js";
import { getTramites, postTurnoEnFila } from "../helpers/filaApi.js";
import { AlertCircle, CheckCircle } from "lucide-react";

const FilaScreen = () => {
  const navigate = useNavigate();
  const [legajo, setLegajo] = useState("");
  const [noLegajo, setNoLegajo] = useState(false);
  const [tramite, setTramite] = useState("");
  const [indexTramite, setIndexTramite] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [tramites, setTramites] = useState([]);
  const [errorLegajo, setErrorLegajo] = useState("");

  useEffect(() => {
    initializeDatabase();
    const fetchTramites = async () => {
      try {
        const tramitesData = await getTramites();
        setTramites(tramitesData);
      } catch (error) {
        console.error("Error fetching tramites:", error);
      }
    };
    fetchTramites();
  }, []);

  const handleTramiteChange = (e) => {
    const selectedTramite = e.target.value;
    setTramite(selectedTramite);
    const selectedIndex = tramites.findIndex(t => t.descripcion === selectedTramite) + 1;
    setIndexTramite(selectedIndex);
    setShowWarning(selectedTramite.endsWith("*"));
  };
  const handleLegajoChange = (e) => {
    const value = e.target.value;
    setLegajo(value);
    if(value.length > 0 && value.length !== 5){
      setErrorLegajo("El número de legajo debe tener 5 dígitos. Ingrese nuevamente");
    } else {
      setErrorLegajo("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!noLegajo && legajo.length !== 5) return;
    try {
      const legajoAEnviar = noLegajo ? null : legajo;
      const turnoData = await postTurnoEnFila(legajoAEnviar, indexTramite);
      sessionStorage.setItem("turnoActivo", JSON.stringify(turnoData));
      navigate("/whatsapp");
    } catch (error) {
      console.error("Error creando turno:", error);
    }
  };

  return (
    <PageLayout title="Solicitar Turno">
    
    <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Input Legajo */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Número de Legajo
          </label>
          
          <input
            type="number"
            required={!noLegajo}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all disabled:opacity-50 disabled:bg-slate-200 dark:disabled:bg-slate-700"
            placeholder="Ej: 50481"
            maxLength="5"
            value={legajo}
            onChange={handleLegajoChange}
            disabled={noLegajo}
          />
          {errorLegajo && !noLegajo && <p className="text-red-500 text-xs mt-1 font-medium">{errorLegajo}</p>}
        </div>

          {/* Checkbox */}
          {/* CORRECCIÓN 1: Agregado dark:border-slate-700 para que el borde azul claro no brille */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-slate-800 rounded-lg border border-blue-100 dark:border-slate-700">
            <input
              type="checkbox"
              id="noLegajo"
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              checked={noLegajo}
              onChange={(e) => {
                setNoLegajo(e.target.checked);
                if(e.target.checked) {
                  setLegajo(""); // Limpiamos legajo si marca que no tiene
                  setErrorLegajo("");
                }
              }}
            />
            <label htmlFor="noLegajo" className="text-sm font-medium text-blue-800 dark:text-blue-200 cursor-pointer select-none">
              No tengo número de legajo
            </label>
          </div>

          {/* Select Tramite */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 dark:text-white">Tipo de Trámite</label>
            <div className="relative">
              <select
                className="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                value={tramite}
                onChange={handleTramiteChange}
                required
              >
                <option value="">Seleccione una opción...</option>
                {tramites.map((t, index) => (
                  <option key={index} value={t.descripcion}>{t.descripcion}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {/* Warning Alert */}
          {/* CORRECCIÓN 2: Adaptación completa a modo oscuro (Fondo transparente oscuro y texto claro) */}
          {showWarning && (
            <div className="flex gap-3 p-4 bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 text-amber-800 dark:text-amber-200 rounded-r-lg transition-colors">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <p className="text-sm">
                * Para la presentación de notas, se deben respetar las fechas del calendario académico.
              </p>
            </div>
          )}

          {/* Submit Button */}
          {/* CORRECCIÓN 3: dark:shadow-none para evitar sombras blancas brillantes */}
          <button
            type="submit"
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-200 dark:shadow-none transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            Confirmar Turno
            <CheckCircle size={20} />
          </button>
        </form>
      </div>
    </PageLayout>
  );
};

export default FilaScreen;