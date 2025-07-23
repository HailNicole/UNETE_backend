import axios from "axios";
const API_URL = "http://localhost:3000/";

// Servicio para obtener el reporte de ventas
export const getSalesReport = async () => {
    try {
        const response = await axios.get(`${API_URL}/sales`);
        return response.data;
    } catch (error) {
        console.error("Error fetching sales report:", error);
        throw error;
    }
};

// Servicio para obtener el reporte de productos
export const getProductsReport = async () => {
    try {
        const response = await axios.get(`${API_URL}/products/report`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products report:", error);
        throw error;
    }
};