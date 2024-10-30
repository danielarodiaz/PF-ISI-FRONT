import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import LogoInfo_track from "../assets/LogoInfo_track.png"; // Adjust the path as necessary
import "../css/footer.css";

const Footer = () => {
  return (
    <footer className="bg-body-tertiary text-black text-center py-3">
      <div className="container">
        <img
          src={LogoInfo_track}
          alt="Info_track Logo"
          className="img-fluid img-size"
        />
        <p className="mb-1">
          Creado por &copy; {new Date().getFullYear()} Ludemco 🥰
        </p>
        <p className="mb-0">Todos los derechos reservados</p>
      </div>
    </footer>
  );
};

export default Footer;
