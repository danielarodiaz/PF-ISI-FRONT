export const initializeDatabase = () => {
  const existingData = JSON.parse(localStorage.getItem("filaUsuarios"));
  if (!existingData) {
    const initialData = [
      {
        id: 1,
        legajo: "48223",
        tramite: "Ampliación de cupo*",
        fecha: new Date().toLocaleString(),
        turno: "D01",
        atendido: false,
      },
      {
        id: 2,
        legajo: "38592",
        tramite: "Cambio de carrera*",
        fecha: new Date().toLocaleString(),
        turno: "D02",
        atendido: false,
      },
      {
        id: 3,
        legajo: "Sin legajo",
        tramite: "Consulta general*",
        fecha: new Date().toLocaleString(),
        turno: "D03",
        atendido: false,
      },
      {
        id: 4,
        legajo: "47261",
        tramite: "Solicitud de equivalencias*",
        fecha: new Date().toLocaleString(),
        turno: "D04",
        atendido: false,
      },
      {
        id: 5,
        legajo: "35641",
        tramite: "Solicitud de baja*",
        fecha: new Date().toLocaleString(),
        turno: "D05",
        atendido: false,
      },
    ];
    localStorage.setItem("filaUsuarios", JSON.stringify(initialData));
    console.log("Datos iniciales guardados en localStorage:", initialData);
  }
};
