import React from "react";

const TableFila = ({ fila, onAtenderTurno }) => {
  console.log("Fila recibida en TableFila:", fila);
  return (
    <div>
      <h1 className="color-title bg-dark">Fila Virtual</h1>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Legajo</th>
            <th>Trámite</th>
            <th>Fecha y Hora</th>
            <th>Número de Tramite</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {fila.map((turno) => {
            console.log(turno.id); // Verificar el id
            return (
              <tr
                key={turno.id}
                className={turno.atendido ? "bg-secondary text-muted" : ""}
              >
                <td>{turno.legajo}</td>
                <td>{turno.tramite}</td>
                <td>{turno.fecha}</td>
                <td>{turno.turno}</td>
                <td>
                  {!turno.atendido && (
                    <button
                      className="btn btn-primary"
                      onClick={() => onAtenderTurno(turno)}
                    >
                      Atender
                    </button>
                  )}
                  {turno.atendido && (
                    <span className="text-success">Atendido</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableFila;
