import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import LogoInfo_track from "../assets/LogoInfo_track.png";
import "../css/footer.css";

const Footer = () => {
  return (
    <>
      <div className="main-content"></div>
      <footer className="app-footer text-center">
        <div className="container">
          <img
            src={LogoInfo_track}
            alt="Info_track Logo"
            className="footer-img"
          />
          <p className="footer-text">
            Creado por &copy; {new Date().getFullYear()} Ludemco 🥰
          </p>
          <p className="footer-text">Todos los derechos reservados</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;