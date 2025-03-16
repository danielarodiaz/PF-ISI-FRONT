import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import "../css/turno.css";
import { personasAdelanteEnLaFila } from "../helpers/filaApi";

const TurnoPage = () => {
  const navigate = useNavigate();

  const [turnoActual, setTurnoActual] = useState("");
  const [esTurno, setEsTurno] = useState(false);
  const [personasAdelante, setPersonasAdelante] = useState(5); // Personas por defecto en la fila
  const [tiempoEspera, setTiempoEspera] = useState(10); // Tiempo estimado en minutos
  const [progreso, setProgreso] = useState(0);
  const [datosTurno, setDatosTurno] = useState({ legajo: 0, tramite: "" , NombreTurno: ""});
  const [totalPersonas, setTotalPersonas] = useState(0);

  const fetchPersonasAdelante = async (nombreTurno) => {
    try {
      const personasAdelanteData = await personasAdelanteEnLaFila(nombreTurno);
      console.log("Personas adelante:", personasAdelanteData);
      setPersonasAdelante(personasAdelanteData);
    } catch (error) {
      console.error("Error fetching personasAdelante:", error);
    }    
  };

  const calcularProgreso = (personasAdelante, totalPersonas) => {
    return ((totalPersonas - personasAdelante) / totalPersonas) * 100;
  };

  const calcularTiempoEspera = (personasAdelante) => {
    setTiempoEspera( personasAdelante * 3);
  };
  

  // Obtiene el último turno ingresado en filaUsuarios
  useEffect(() => {
    const filaUsuarios = JSON.parse(localStorage.getItem("filaUsuarios")) || [];
    const ultimoTurno = filaUsuarios[0]; // Selecciona el último registro
    //console.log("ultimo turno:", ultimoTurno);
    if (ultimoTurno) {
      setDatosTurno({
        legajo: ultimoTurno.legajo,
        tramite: ultimoTurno.tramite,
        nombreTurno: ultimoTurno.NombreTurno
      });
      setTurnoActual(ultimoTurno.nombreTurno); // Muestra el turno asignado
      
      fetchPersonasAdelante(ultimoTurno.nombreTurno);

      
    }
  }, []);

  useEffect(() => {
    calcularTiempoEspera(personasAdelante);
    const totalPersonas = personasAdelante + 1; // Suponiendo que la persona actual también cuenta
    setProgreso(calcularProgreso(personasAdelante, totalPersonas));
  }, [personasAdelante]);
  

  // // Simula el progreso del turno
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (personasAdelante > 0) {
  //       setPersonasAdelante((prev) => Math.max(prev - 1, 0)); // Evita valores negativos
  //       setTiempoEspera((prev) => Math.max(prev - 1, 0)); // Evita valores negativos
  //       setProgreso((prev) => Math.min(prev + 20, 100)); // Incrementa el progreso
  //     } else {
  //       setEsTurno(true);
  //       setTurnoActual(`¡Es tu turno ${turnoActual}!`);
  //     }
  //   }, 2000);

  //   return () => clearInterval(interval);
  // }, [personasAdelante]);

  return (
    <div className="container text-center mt-1">
      <div className="row justify-content-center">
        <div className="col">
          <h3>{datosTurno.legajo}</h3>
        </div>
      </div>

      <div className="row justify-content-center mt-2">
        <div className="col-md-6">
          <div>
            <h2>Número de turno</h2>
          </div>
          <div
            className={`card ${
              esTurno ? "bg-success text-white" : "color-title"
            }`}
          >
            <div className="card-body size-font">
              <h1>{turnoActual}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center mt-4">
        <div className="col-md-6 mb-3 mb-lg-0">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title color-title">
                <i className="fa fa-user-o m-1" aria-hidden="true"></i>
                {personasAdelante}
              </h5>
              <p className="card-text">Personas adelante en la fila</p>
            </div>
          </div>
        </div>

        <div className="col-sm-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title color-title">
                <i className="fa fa-clock-o m-1" aria-hidden="true"></i>
                {tiempoEspera} minutos
              </h5>
              <p className="card-text">Tiempo de espera</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center mt-4">
        <div className="col-md-6">
          {esTurno ? (
            <div>
              <h5>Preséntate en Dpto. Alumnos por {datosTurno.tramite}</h5>
            </div>
          ) : (
            <>
              <h5>Progreso del turno</h5>
              <Spinner
                animation="border"
                role="status"
                variant="primary"
                className="size-spinner"
              >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <div className="mt-3">
                <progress
                  value={progreso}
                  max="100"
                  className="w-100"
                ></progress>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-4 col-md-6 col-sm-8">
          <button
            type="button"
            className="btn btn-danger w-50 mb-3"
            onClick={() => {
              localStorage.removeItem("legajo");
              localStorage.removeItem("tramite");
              localStorage.removeItem("filaUsuarios");
              navigate("/");
            }}
          >
            Cancelar Turno
          </button>
        </div>
      </div>
    </div>
  );
};

export default TurnoPage;
