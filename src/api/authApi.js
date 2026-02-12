import axios from "axios";
import { API_BASE_URL_CORE } from "../config/api";

export const logIn = async (user, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL_CORE}/api/Autenticacion/LogIn`, {
            user: user,
            password: password
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener token:", error);
        throw error;
    }
};

export const verifyToken = async (token) => {
    try {
        const response = await axios.post(`${API_BASE_URL_CORE}/api/Autenticacion/ValidarToken`, JSON.stringify(token), {
            headers: {
                "Content-Type": "application/json",
                "accept": "*/*"
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
