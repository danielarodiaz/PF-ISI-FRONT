import React, { useState, useEffect } from "react";
import TableFila from "../components/TableFila";
import CardFilaNow from "../components/CardFilaNow";
import { initializeDatabase } from "../data/dataFila"; // Importamos los datos de fila

const HomeAdmin = () => {
  useEffect(() => {
    initializeDatabase();
  }, []);
  const filaUsuarios = JSON.parse(localStorage.getItem("filaUsuarios")) || [];
  console.log("Datos recuperados de localStorage:", filaUsuarios);

  const [fila, setFila] = useState(filaUsuarios); // Carga la fila desde dataFila.js
  const [turnoActual, setTurnoActual] = useState(null); // Estado del turno en atención
  const [atendiendo, setAtendiendo] = useState(false); // Control del estado de atención
  const [segundos, setSegundos] = useState(0); // Cronómetro en segundos

  // Función para seleccionar un turno a atender e iniciar cronómetro
  const atenderTurno = (turno) => {
    setTurnoActual(turno);
    setAtendiendo(true);
    setSegundos(0);
  };
  //logica para el cronometro
  useEffect(() => {
    let intervalo;
    if (atendiendo) {
      intervalo = setInterval(() => {
        setSegundos((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalo);
    }
    return () => clearInterval(intervalo);
  }, [atendiendo]);

  // Función para finalizar la atención y actualizar solo el turno actual como atendido
  const finalizarAtencion = () => {
    if (turnoActual) {
      // Actualizar solo el turno actual en el estado de fila
      const nuevoFila = fila.map((turno) =>
        turno.id === turnoActual.id ? { ...turno, atendido: true } : turno
      );

      setFila(nuevoFila); // Actualiza el estado de la fila
      localStorage.setItem("filaUsuarios", JSON.stringify(nuevoFila)); // Actualiza el localStorage

      setAtendiendo(false); // Detener el cronómetro
      setTurnoActual(null); // Resetear el turno actual
      setSegundos(0); // Reiniciar el cronómetro
    }
  };

  return (
    <div className="container">
      <div className="row mt-3">
        <div className="col text-center">
          <h2 className="color-title">Gestionar Fila Virtual</h2>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col text-center">
          {turnoActual && (
            <CardFilaNow
              turnoId={turnoActual.id}
              numero={turnoActual.turno}
              tiempo={turnoActual.fecha}
              segundos={segundos}
            />
          )}
        </div>
      </div>
      {atendiendo && (
        <div className="row mt-3">
          <div className="col text-center">
            <button className="btn btn-success" onClick={finalizarAtencion}>
              Finalizar Atención
            </button>
          </div>
        </div>
      )}
      <div className="row mt-5">
        <div className="col text-center">
          <TableFila fila={fila} onAtenderTurno={atenderTurno} />
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
