import React, { useState, useEffect } from "react";
import TableFila from "../components/TableFila";
import CardFilaNow from "../components/CardFilaNow";
import { getFila } from "../helpers/filaApi"; // Importamos los datos de fila
import { atenderTurnoConId, putFinalizarAtencion } from "../helpers/filaApi"; // Importamos la función para atender un turno
import { postTurnoEnFila } from "../helpers/filaApi"; // Importamos la función para agregar un turno a la fila
import { useNavigate } from "react-router-dom";
import { verificarToken } from "../helpers/login"; // Importamos la función para verificar el token

const HomeAdmin = () => {
  const [fila, setFila] = useState([]); // Lista de turnos
  const [turnoActual, setTurnoActual] = useState(null); // Turno en atención
  const [atendiendo, setAtendiendo] = useState(false); // Estado de atención
  const [segundos, setSegundos] = useState(0); // Cronómetro en segundos
  const navigate = useNavigate(); // Hook para manejar la redirección

  // Función para obtener y transformar los datos de la API
  const fetchFila = async () => {
    try {
      const filaDb = await getFila();
      //console.log("Fila original desde API:", filaDb);

      // Transformamos los datos para extraer solo la información relevante
      const filaTransformada = filaDb.map((item) => ({
        id: item.idTurno,
        legajo: item.turno.legajo,
        tramite: item.turno.tramite.descripcion,
        fecha: item.turno.fechaDeCreacion,
        turno: item.turno.nombreTurno,
        atendido: item.turno.estadoTurno.descripcion === "Atendido",
      }));

      //console.log("Fila transformada:", filaTransformada);
      setFila(filaTransformada);
    } catch (error) {
      console.error("Error fetching fila:", error);
    }
  };

  const verificarYFetchFila = async () => {
    try {
      const tokenLocalStorage = localStorage.getItem("token");
      const tokenValido = await verificarToken(tokenLocalStorage);
      console.log("Token válido:", tokenValido);
      if (!tokenValido) {
        navigate("/loginadmin"); // Redirige a LoginAdmin si el token no es válido
      } else {
        console.log("Token válido, obteniendo datos de la fila...");
        navigate("/homeAdmin"); // Redirige a HomeAdmin si el token es válido
        fetchFila(); // Obtiene los datos si el token es válido
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      navigate("/loginadmin"); // Redirige a LoginAdmin en caso de error
    }
  };

  // Llamamos a verificarYFetchFila cuando el componente se monta
  useEffect(() => {
    fetchFila();
    const interval = setInterval(fetchFila, 5000); // Refresca cada 5 segundos
    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, []); // Dependency array to run only once

  // Función para seleccionar un turno y empezar la atención
  const atenderTurno = (turno) => {
    atenderTurnoConId(turno.id);
    console.log("Atendiendo turno:", turno);
    setTurnoActual(turno);
    setAtendiendo(true);
    setSegundos(60); // Iniciamos el cronómetro en 60 segundos
  };

  // Función para finalizar la atención
  const finalizarAtencion = () => {
    if (turnoActual) {
      // Actualizamos solo el turno atendido en el estado
      const nuevaFila = fila.map((t) =>
        t.id === turnoActual.id ? { ...t, atendido: true } : t
      );
      putFinalizarAtencion(); // Enviamos la petición a la API
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
              turnoData={{
                legajo: turnoActual.legajo,
                tramite: turnoActual.tramite,
                fecha: turnoActual.fecha,
                turno: turnoActual.turno
              }}
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