import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { FaFilter } from "react-icons/fa";
import {getTurnos} from "../helpers/turnosApi";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const TurnosChart = () => {
    const [tramitesData, setTramitesData] = useState({ labels: [], datasets: [] });
    const [alumnosData, setAlumnosData] = useState({ labels: [], datasets: [] });
    const [tiempoAtencionData, setTiempoAtencionData] = useState({ labels: [], datasets: [] });
    const [filtro, setFiltro] = useState("mes");
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
  
    useEffect(() => {
      const fetchTurnosData = async () => {
        try {
          const turnos = await getTurnos();
          processData(turnos, filtro);
        } catch (error) {
          console.error("Error fetching turnos data:", error);
        }
      };
  
      const processData = (turnos, filtro) => {
        const countsTramites = {};
        const countsAlumnos = {};
        const times = {};
        const countsTiempo = {};
        
        turnos.forEach(({ tramite, fechaDeCreacion, fechaUltimaModificacion }) => {
          const date = new Date(fechaDeCreacion);
          const key = filtro === "dia" ? date.toLocaleDateString() : filtro === "mes" ? date.toLocaleString("default", { month: "short", year: "numeric" }) : date.getFullYear();
          
          if (!countsTramites[key]) countsTramites[key] = {};
          if (!countsTramites[key][tramite.descripcion]) countsTramites[key][tramite.descripcion] = 0;
          countsTramites[key][tramite.descripcion]++;
  
          if (!countsAlumnos[key]) countsAlumnos[key] = 0;
          countsAlumnos[key]++;
  
          const duration = (new Date(fechaUltimaModificacion) - date) / 60000;
          if (!times[key]) times[key] = 0;
          if (!countsTiempo[key]) countsTiempo[key] = 0;
          times[key] += duration;
          countsTiempo[key]++;
        });
  
        const labels = Object.keys(countsTramites);
        const tramites = [...new Set(turnos.map(t => t.tramite.descripcion))];
        const tramitesDatasets = tramites.map(tramite => ({
          label: tramite,
          data: labels.map(label => countsTramites[label][tramite] || 0),
          backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`
        }));
        
        setTramitesData({ labels, datasets: tramitesDatasets });
        setAlumnosData({ labels, datasets: [{ label: "Alumnos atendidos", data: labels.map(label => countsAlumnos[label] || 0), backgroundColor: "rgba(54, 162, 235, 0.7)" }] });
        setTiempoAtencionData({ labels, datasets: [{ label: "Promedio de tiempo de atención (minutos)", data: labels.map(label => times[label] / countsTiempo[label] || 0), backgroundColor: "rgba(75, 192, 192, 0.7)" }] });
      };
  
      fetchTurnosData();
    }, [filtro]);
  
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <button onClick={() => setMostrarFiltros(!mostrarFiltros)} style={{ marginBottom: "10px", padding: "8px 16px", fontSize: "16px", cursor: "pointer" }}>
          <FaFilter /> Filtrar
        </button>
        {mostrarFiltros && (
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button onClick={() => setFiltro("dia")}>Día</button>
            <button onClick={() => setFiltro("mes")}>Mes</button>
            <button onClick={() => setFiltro("año")}>Año</button>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
          <div style={{ width: "33%" }}>
            <h2>Trámites más solicitados</h2>
            <Bar data={tramitesData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
          </div>
          <div style={{ width: "33%" }}>
            <h2>Alumnos atendidos</h2>
            <Bar data={alumnosData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
          </div>
          <div style={{ width: "33%" }}>
            <h2>Tiempo promedio de atención</h2>
            <Bar data={tiempoAtencionData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
          </div>
        </div>
      </div>
    );
  };
  
  export default TurnosChart;
  