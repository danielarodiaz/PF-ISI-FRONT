import axios from "axios";
import { API_BASE_URL_CORE } from "../config/api";

export const LogIn = async (user, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL_CORE}/api/Autenticacion/LogIn`, {
            user: user,
            password: password
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log("Token obtenido:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener token:", error);
        // Agrega un log aquí para debuggear
        console.log("Error en la solicitud de token:", error);
        throw error;
    }
};

export const verificarToken = async (token) => {
    try {
        //console.log("Enviando solicitud de verificación de token con:", token);
        const response = await axios.post(`${API_BASE_URL_CORE}/api/Autenticacion/ValidarToken`, JSON.stringify(token), {
            headers: {
                "Content-Type": "application/json",
                "accept": "*/*"
            },
        });
       // console.log("Respuesta de la solicitud de verificación de token:", response);
        //console.log("Token verificado:", response.data);
        return response.data;
    } catch (error) {
       // console.error("Error al verificar token:", error);
        // Agrega un log aquí para debuggear
        //console.log("Error en la solicitud de verificación de token:", error);
        throw error;
    }
};
