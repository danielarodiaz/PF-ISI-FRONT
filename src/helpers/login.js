import axios from "axios";

const API_BASE_URL = "http://localhost:5132/";

export const getToken = async (user, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}api/Autenticacion/Validar`, {
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
        // Agrega un log aquí para debuggear
        console.log("Error en la solicitud de token:", error);
        throw error;
    }
};
