import axios from "axios";
const API_URL = "http://localhost:3000";
export const createOrder = async (orderData) => {
    try {
        const response = await axios.post(`${API_URL}/order`, orderData);
        const {message,total}=response.data
        return { success: true, message:message, total:total };
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        throw error;
    }
};
export const getUserOrders = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/orders/${userId}`);
        const {message,orders}=response.data;
        return {success:true,message:message,orders:orders};
    } catch (error) {
        console.error('Error al obtener los pedidos del usuario:', error);
        throw error;
    }
};
export const getAllOrders = async () => {
    try {
        const response = await axios.get(`${API_URL}/orders`);
        const {orders}= response.data
        return { success: true, orders:orders};
    } catch (error) {
        console.error('Error al obtener todos los pedidos:', error);
        throw error;
    }
};