import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TitleFv from "../components/TitleFv";
import { initializeDatabase } from "../data/dataFila.js";
import { getTramites, postTurnoEnFila } from "../helpers/filaApi.js";

const FilaScreen = () => {
  const navigate = useNavigate();
    const [legajo, setLegajo] = useState("");
  const [noLegajo, setNoLegajo] = useState(false);
  const [tramite, setTramite] = useState("");
  const[indexTramite, setIndexTramite] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
const [tramites, setTramites] = useState([]);

  useEffect(() => {
    initializeDatabase();
    // Obtener los trámites disponibles-----------------------------
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

  const handleLegajoChange = (e) => {
    setLegajo(e.target.value);
  };

// Manejar el cambio en el checkbox "No tengo legajo"
    const handleNoLegajoChange = (e) => {
    setNoLegajo(e.target.checked);
  };

  const handleTramiteChange = (e) => {
    const selectedTramite = e.target.value;
    setTramite(selectedTramite);
  
    // Find the index of the selected tramite
    const selectedIndex = tramites.findIndex(tramite => tramite.descripcion === selectedTramite) + 1;
    setIndexTramite(selectedIndex);
  
    // Mostrar advertencia si el trámite tiene un asterisco
    setShowWarning(selectedTramite.endsWith("*"));
  };

  // Manejar el envío del formulario--------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    const sendTurno = async () => {
      try {
        const turnoData = await postTurnoEnFila(legajo,indexTramite);
        console.log("Turno enviado:", turnoData);
        localStorage.clear()
        const filaUsuarios = JSON.parse(localStorage.getItem("filaUsuarios")) || [];
        filaUsuarios.push(turnoData);
        localStorage.setItem("filaUsuarios", JSON.stringify(filaUsuarios));
        navigate("/turno");
      } catch (error) {
        console.error("Error fetching tramites:", error);
      }
    };
    sendTurno();

    
  };


  //HTML-------------------------------------------------------------------------------------
  return (
    <div className="container">
      <div className="row mt-3">
        <TitleFv />
      </div>
      <div className="row">
        <div className="col col-md-6 offset-md-3">
          <form onSubmit={handleSubmit}>
            <div className="mb-3 d-grid">
              <label>Ingrese su número de legajo</label>
              <input
                type="number"
                required
                className="form-control"
                placeholder="Número de legajo: 50481"
                maxLength="5"
                name="legajo"
                value={legajo}
                onChange={handleLegajoChange}
                disabled={noLegajo}
              />
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="exampleCheck1"
                checked={noLegajo}
                onChange={handleNoLegajoChange}
              />
              <label className="form-check-label" htmlFor="exampleCheck1">
                No tengo número de legajo
              </label>
            </div>
            <div className="mb-3 d-grid">
              <label>Seleccione el tipo de trámite que desea realizar</label>
              <select
                className="form-select"
                aria-label="Default select example"
                value={tramite}
                onChange={handleTramiteChange}
                required
              >
                <option value="">Seleccionar el trámite aquí</option>
                {tramites.map((tramite, index) => (
                  <option key={index} value={tramite.descripcion}>
                    {tramite.descripcion}
                  </option>
                ))}
              </select>
            </div>
            {showWarning && (
              <div className="alert alert-warning" role="alert">
                *Para la presentación de notas, se deben respetar las fechas que
                dicta el calendario académico.
              </div>
            )}
            <div className="mb-3 d-flex justify-content-center">
              <button type="submit" className="btn btn-success w-50">
                Aceptar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FilaScreen;