import axios from "axios";
const API_URL = "http://localhost:3000";
export async function uploadmessage(name,email,parrafo) {
    try {
        const response = await axios.post(`${API_URL}/message`, {
                name:name,
                email:email ,
                message:parrafo
            }
        );
        const { message } = response.data;
        return { success: true, message };
    } catch (error) {
        console.error("Error al enviar el mensaje:", error.response?.data?.error || error.message);
        return { success: false, error: error.response?.data?.error || "Error al conectar con el servidor" };
    }
}
export async function getMessages() {
    try {
        const response = await axios.get(`${API_URL}/messages`);
        const { data } = response.data;
        return { success: true, messages: data };
    } catch (error) {
        console.error("Error al cargar los mensajes:", error.response?.data?.error || error.message);
        return { success: false, error: error.response?.data?.error || "Error al conectar con el servidor" };
    }
}
export async function deleteMessage(id) {
    try {
        const response = await axios.delete(`${API_URL}/message/${id}`);
        const { message } = response.data;
        return { success: true, message };
    } catch (error) {
        console.error("Error al eliminar el mensaje:", error.response?.data?.error || error.message);
        return { success: false, error: error.response?.data?.error || "Error al conectar con el servidor" };
    }
}
