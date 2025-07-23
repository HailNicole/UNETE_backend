import axios from "axios";
const API_URL = "http://localhost:3000";
// Función para iniciar sesión
export async function login(correo, contrasena) {
    try {
        const response = await axios.post(`${API_URL}/login`, { 
            correo,
            contrasena
        });
        const { token, role, name } = response.data;
        return { success: true, token, role, name };
    } catch (error) {
        console.error("Error al iniciar sesión:", error.response?.data?.error || error.message);
        return { success: false, error: error.response?.data?.error || "Error al conectar con el servidor" };
    }
}
// Función para registrar usuario
export async function register(userData) {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        const { message } = response.data;
        return { success: true, message };
    } catch (error) {
        console.error("Error al registrar usuario:", error.response?.data?.error || error.message);
        return { success: false, error: error.response?.data?.error || "Error al conectar con el servidor" };
    }
}

// Función para cerrar sesión
export async function logout() {
    try {
        const response = await axios.post(`${API_URL}/logout`);
        const {message}=response.data
        localStorage.removeItem("auth")
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        return { success: true, message };
    } catch (error) {
        console.error("Error al cerrar sesión:", error.response?.data?.error || error.message);
        return { success: false, error: error.response?.data?.error || "Error al conectar con el servidor" };
    }
}