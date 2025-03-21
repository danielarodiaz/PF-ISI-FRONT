import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import "../css/turno.css";
import { personasAdelanteEnLaFila } from "../helpers/filaApi";
import {getTurnoById} from "../helpers/filaApi";
import { useParams } from "react-router-dom";

const TurnoPage = () => {
  const navigate = useNavigate();

  const [turnoActual, setTurnoActual] = useState("");
  const [esTurno, setEsTurno] = useState(false);
  const [personasAdelante, setPersonasAdelante] = useState(5); // Personas por defecto en la fila
  const [tiempoEspera, setTiempoEspera] = useState(10); // Tiempo estimado en minutos
  const [progreso, setProgreso] = useState(0);
  const [datosTurno, setDatosTurno] = useState({ legajo: 0, tramite: "", NombreTurno: "" });
  const [totalPersonas, setTotalPersonas] = useState(0);
  const [porAtender, setPorAtender] = useState(false);
  const { idTurno } = useParams();


  const obtenerTurno = async (idTurno) => {
    try {
      const turnoData = await getTurnoById(idTurno);
      setDatosTurno(turnoData);
      fetchPersonasAdelante(turnoData);
      setTurnoActual(turnoData.nombreTurno); // Muestra el turno asignado
      

    } catch (error) {
      console.error("Error fetching turno:", error);
    }
  };

  const fetchPersonasAdelante = async (turnoData) => {
    try {
      const personasAdelanteData = await personasAdelanteEnLaFila(turnoData.idTurno);
      setPersonasAdelante(personasAdelanteData);
      calcularTiempoEspera(personasAdelanteData);

      const totalPersonas = personasAdelanteData + 1; // Suponiendo que la persona actual también cuenta
      setProgreso(calcularProgreso(personasAdelanteData, totalPersonas));

      if(turnoData.idEstadoTurno == 3){
        navigate("/"); // Redirige a la página principal
      }

      if (personasAdelanteData === 0 && turnoData.idEstadoTurno == 1) {
        setPorAtender(true);
        setTurnoActual("Te están por atender");
      } else if (turnoData.idEstadoTurno == 2) {
        setEsTurno(true);
         setTurnoActual(`¡Es tu turno ${turnoData.nombreTurno}!`);
      }
      

      
    } catch (error) {
      console.error("Error fetching personasAdelante:", error);
    }
  };



  const calcularProgreso = (personasAdelante, totalPersonas) => {
    return ((totalPersonas - personasAdelante) / totalPersonas) * 100;
  };

  const calcularTiempoEspera = (personasAdelante) => {
    setTiempoEspera(personasAdelante * 3);
  };


  // Obtiene el último turno ingresado en filaUsuarios
  useEffect(() => {
    if (idTurno) {
      //console.log("idTurno:", idTurno);
      obtenerTurno(idTurno);
    } else {
      //console.log("no valid idTurno:", idTurno);
    }

    const interval = setInterval(() => {
      if (idTurno) {
        obtenerTurno(idTurno);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [idTurno]);

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
              esTurno ? "bg-success text-white" : porAtender ? "bg-warning text-dark" : "color-title"
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
              <h5>Preséntate en Dpto. Alumnos por {datosTurno.tramite?.descripcion}</h5>
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
