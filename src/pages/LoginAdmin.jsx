import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import "../css/login.css";

const LoginAdmin = ({ cambiarLogin }) => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    user: "",
    password: "",
  });

  const [show, setShow] = useState({
    user: false,
    password: false,
  });

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
    setShow({ ...show, [e.target.name]: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const admin = {
      user: "admin123",
      password: "admin123",
    };
    const { user, password } = formValues;

    if (!user || !password) {
      setShow({
        user: !user,
        password: !password,
      });
      return;
    }

    if (user === admin.user && password === admin.password) {
      cambiarLogin();
      navigate("/homeAdmin");
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Usuario o contraseña incorrectos",
        footer:
          '<a href="#">Te olvidaste tu usuario y/o contraseña? Recuperar aquí</a>',
      });
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 col-lg-4">
          <h3 className="text-center color-title mb-4">Inicio de Sesión</h3>
          <div className="card p-4 shadow-sm">
            <h4 className="text-center">Hola, Bienvenido/a!</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="user" className="form-label">
                  Usuario
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="user"
                  value={formValues.user}
                  onChange={handleChange}
                  id="user"
                />
                {show.user && (
                  <p className="text-danger m-0">Faltan datos en este campo</p>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  id="password"
                />
                {show.password && (
                  <p className="text-danger m-0">Faltan datos en este campo</p>
                )}
              </div>
              <div className="mb-3 d-grid">
                <button type="submit" className="btn btn-success">
                  Iniciar Sesión
                  <i className="fa fa-sign-in m-1" aria-hidden="true"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
