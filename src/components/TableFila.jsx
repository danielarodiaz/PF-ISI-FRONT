import React from "react";

const TableFila = ({ fila, onAtenderTurno }) => {
  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleString();
  };

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
          {fila.length > 0 ? (
            fila.map((turno) => (
              <tr key={turno.id} className={turno.atendido ? "bg-secondary text-muted" : ""}>
                <td>{turno.legajo}</td>
                <td>{turno.tramite}</td>
                <td>{formatFecha(turno.fecha)}</td>
                <td>{turno.turno}</td>
                <td>
                  {!turno.atendido ? (
                    <button className="btn btn-primary" onClick={() => onAtenderTurno(turno)}>
                      Atender
                    </button>
                  ) : (
                    <span className="text-success">Atendido</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No hay turnos en la fila.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableFila;
