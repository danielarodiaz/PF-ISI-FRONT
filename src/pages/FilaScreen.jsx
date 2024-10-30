import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TitleFv from "../components/TitleFv";
import { initializeDatabase } from "../data/dataFila.js";

const FilaScreen = () => {
  const navigate = useNavigate();
  useEffect(() => {
    initializeDatabase();
  }, []);

  // Estado para almacenar el número de legajo, si no tiene legajo, el trámite seleccionado y el mensaje de advertencia.
  const [legajo, setLegajo] = useState("");
  const [noLegajo, setNoLegajo] = useState(false);
  const [tramite, setTramite] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  // Manejar el cambio del número de legajo
  const handleLegajoChange = (e) => {
    setLegajo(e.target.value);
  };

  // Manejar el cambio en el checkbox "No tengo legajo"
  const handleNoLegajoChange = (e) => {
    setNoLegajo(e.target.checked);
  };

  // Manejar el cambio del trámite seleccionado
  const handleTramiteChange = (e) => {
    const selectedTramite = e.target.value;
    setTramite(selectedTramite);
    // Mostrar advertencia si el trámite tiene un asterisco
    setShowWarning(selectedTramite.endsWith("*"));
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    const newTurn = {
      id: Math.floor(Math.random() * 1000) + 1, // Genera un número aleatorio
      legajo: noLegajo ? "Sin legajo" : legajo,
      tramite,
      fecha: new Date().toLocaleString(), // puedes añadir la fecha del turno si lo necesitas
      turno: `D${Math.floor(Math.random() * 100) + 1}`, // Genera un número aleatorio
      atendido: false,
    };

    // Obtén los datos actuales de LocalStorage o inicia una lista vacía
    const filaUsuarios = JSON.parse(localStorage.getItem("filaUsuarios")) || [];

    // Añade el nuevo turno
    filaUsuarios.push(newTurn);

    // Guarda los datos actualizados en LocalStorage
    localStorage.setItem("filaUsuarios", JSON.stringify(filaUsuarios));

    // Navegar a la página de turno
    navigate("/turno");
  };

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
                name="legajo"
                value={legajo}
                onChange={handleLegajoChange}
                disabled={noLegajo} // Desactiva el input si "No tengo legajo" está marcado
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
                <option value="Inscripción fuera de termino*">
                  Inscripción fuera de termino*
                </option>
                <option value="Cambio de comisión*">Cambio de comisión*</option>
                <option value="Cambio de extensión aulica">
                  Cambio de extensión aulica
                </option>
                <option value="Cambio de carrera*">Cambio de carrera*</option>
                <option value="Cambio de plan de estudio*">
                  Cambio de plan de estudio*
                </option>
                <option value="Ingreso por equivalencia*">
                  Ingreso por equivalencia*
                </option>
                <option value="Reconocimiento de equivalencia">
                  Reconocimiento de equivalencia
                </option>
                <option value="Pase de facultad">Pase de facultad</option>
                <option value="Recursado de materias*">
                  Recursado de materias*
                </option>
                <option value="Aplicación art. 531">Aplicación art. 531</option>
                <option value="Justificación de inasistencia">
                  Justificación de inasistencia
                </option>
                <option value="Excepción al regimen de correlativas*">
                  Excepción al régimen de correlativas*
                </option>
                <option value="Ampliación de cupo*">Ampliación de cupo*</option>
                <option value="Cursado simultaneo*">Cursado simultáneo*</option>
                <option value="Baja de matricula">Baja de matrícula</option>
                <option value="Sanciones disciplinarias">
                  Sanciones disciplinarias
                </option>
                <option value="Constancia de alumno regular">
                  Constancia de alumno regular
                </option>
                <option value="Constancias de inicio de ciclo lectivo">
                  Constancias de inicio de ciclo lectivo
                </option>
                <option value="Constancia de finalización de ciclo lectivo">
                  Constancia de finalización de ciclo lectivo
                </option>
                <option value="Solicitud de planes de estudios">
                  Solicitud de planes de estudios
                </option>
              </select>
            </div>
            {/* Mostrar advertencia si el trámite seleccionado tiene un asterisco */}
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
