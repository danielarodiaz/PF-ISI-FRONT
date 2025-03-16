import React from "react";
import "../css/CardFilaNow.css";

const CardFilaNow = ({ turnoData }) => {
  const { legajo, tramite, fecha, turno } = turnoData;

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleString();
  };

  return (
    <div className="card text-center">
      <div className="card-body">
        <h1 className="text-success">Atendiendo turno: {turno}</h1>
        <p>Legajo: {legajo}</p>
        <p>Trámite: {tramite}</p>
       {/* <p>Fecha: {formatFecha(fecha)}</p> */}
      </div>
    </div>
  );
};

export default CardFilaNow;
