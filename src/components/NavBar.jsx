import React from "react";
import logoUTN from "../assets/UTN-TUC.png";
import { Link, useLocation, NavLink } from "react-router-dom";

import "../css/navbar.css";

const NavBar = ({ cambiarLogin }) => {
  const location = useLocation();

  const adminRoutes = ["/homeAdmin"];
  const isAdminPage = adminRoutes.includes(location.pathname);
  const loginRoutes = ["/loginAdmin"];
  const isLoginAdmin = loginRoutes.includes(location.pathname);

  return (
    <div className="fixed-top">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid m-2">
          <Link className="navbar-brand" to="/">
            <img src={logoUTN} alt="Logo UTN-TUC" className="size-img" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {!isAdminPage && !isLoginAdmin && location.pathname !== "/" && (
                <>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link active"
                      aria-current="page"
                      to="/faq"
                    >
                      FAQ {/* En la bd estarán todas las FAQS, crear un   */}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/chatbot">
                      Asistente Virtual
                    </NavLink>
                  </li>
                </>
              )}

              {location.pathname === "/" && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/loginAdmin">
                    <button type="button" className="btn btn-outline-info">
                      Admin
                    </button>
                  </NavLink>
                </li>
              )}
              {isAdminPage && !isLoginAdmin && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/homeAdmin">
                      Gestionar FAQ
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/homeAdmin">
                      Generar Reportes
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={cambiarLogin}
                      className="btn btn-outline-danger"
                    >
                      Salir{" "}
                      <i className="fa fa-sign-out" aria-hidden="true"></i>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
