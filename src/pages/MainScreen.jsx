import React from "react";
import { Link } from "react-router-dom";

import filavirtual from "../assets/filavirtual.jpg";
import FAQ from "../assets/FAQ.png";
import chatbot from "../assets/chatbot.png";

import "../css/main.css";

const MainScreen = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4 col-sm-6 mb-4">
          <Link to="/fila">
            <div className="card custom-card orange h-100">
              <img
                src={filavirtual}
                className="card-img-top img-fluid"
                alt="FilaVirtual"
              />
              <div className="card-img-overlay d-flex align-items-center justify-content-center">
                <h5 className="card-title">Fila Virtual</h5>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-4 col-sm-6 mb-4">
          <Link to="/faq">
            <div className="card custom-card blue h-100">
              <img
                src={FAQ}
                className="card-img-top img-fluid"
                alt="PreguntasFrecuentes"
              />
              <div className="card-img-overlay d-flex align-items-center justify-content-center">
                <h5 className="card-title">FAQ</h5>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-4 col-sm-6 mb-4">
          <Link to="/chatbot">
            <div className="card custom-card yellow h-100">
              <img src={chatbot} className="card-img" alt="ChatBot" />
              <div className="card-img-overlay d-flex align-items-center justify-content-center">
                <h5 className="card-title">Asistente Virtual</h5>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
