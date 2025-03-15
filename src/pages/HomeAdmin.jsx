import React, { useState, useEffect } from "react";
import TableFila from "../components/TableFila";
import CardFilaNow from "../components/CardFilaNow";
import { getFila } from "../data/dataFila"; // Importamos los datos de fila

const HomeAdmin = () => {
  const [fila, setFila] = useState([]); // Lista de turnos
  const [turnoActual, setTurnoActual] = useState(null); // Turno en atención
  const [atendiendo, setAtendiendo] = useState(false); // Estado de atención
  const [segundos, setSegundos] = useState(0); // Cronómetro en segundos

  // Función para obtener y transformar los datos de la API
  const fetchFila = async () => {
    try {
      const filaDb = await getFila();
      console.log("Fila original desde API:", filaDb);

      // Transformamos los datos para extraer solo la información relevante
      const filaTransformada = filaDb.map((item) => ({
        id: item.idTurno,
        legajo: item.turno.legajo,
        tramite: item.turno.tramite.descripcion,
        fecha: item.turno.fechaDeCreacion,
        turno: item.turno.nombreTurno,
        atendido: item.turno.estadoTurno.descripcion === "Atendido",
      }));

      console.log("Fila transformada:", filaTransformada);
      setFila(filaTransformada);
    } catch (error) {
      console.error("Error fetching fila:", error);
    }
  };

  // Llamamos a fetchFila cuando el componente se monta
  useEffect(() => {
    fetchFila();
  }, []);

  // Función para seleccionar un turno y empezar la atención
  const atenderTurno = (turno) => {
    setTurnoActual(turno);
    setAtendiendo(true);
    setSegundos(0);
  };

  // Función para finalizar la atención
  const finalizarAtencion = () => {
    if (turnoActual) {
      // Actualizamos solo el turno atendido en el estado
      const nuevaFila = fila.map((t) =>
        t.id === turnoActual.id ? { ...t, atendido: true } : t
      );

      setFila(nuevaFila); // Actualizamos la fila
      setAtendiendo(false); // Detenemos la atención
      setTurnoActual(null); // Reseteamos el turno actual
      setSegundos(0); // Reiniciamos el cronómetro
    }
  };

  return (
    <div className="container">
      <div className="row mt-3">
        <div className="col text-center">
          <h2 className="color-title">Gestionar Fila Virtual</h2>
        </div>
      </div>

      {/* Muestra el turno actual en atención */}
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

      {/* Botón para finalizar la atención */}
      {atendiendo && (
        <div className="row mt-3">
          <div className="col text-center">
            <button className="btn btn-success" onClick={finalizarAtencion}>
              Finalizar Atención
            </button>
          </div>
        </div>
      )}

      {/* Tabla con los turnos en la fila */}
      <div className="row mt-5">
        <div className="col text-center">
          <TableFila fila={fila} onAtenderTurno={atenderTurno} />
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
