import axios from "axios";

// Ajusta el puerto a tu backend (5132)
const API_BASE_URL = "http://localhost:5132/"; 

export const LogIn = async (user, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}api/Autenticacion/LogIn`, {
            // CORRECCIÓN AQUÍ: Usamos los nombres exactos que probaste en Swagger
            user: user,       
            password: password
        }, {
            headers: { "Content-Type": "application/json" },
        });
        
        console.log("Login exitoso:", response.data);
        // Si tu backend devuelve { token: "..." }
        return response.data; 
    } catch (error) {
        console.error("Error en LogIn:", error);
        throw error;
    }
};

export const verificarToken = async (token) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}api/Autenticacion/ValidarToken`, 
            JSON.stringify(token), 
            {
                headers: {
                    "Content-Type": "application/json",
                    "accept": "*/*"
                },
            }
        );
        return response.data.valid;
    } catch (error) {
        return false;
    }
};