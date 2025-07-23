import axios from "axios";
const API_URL = "http://localhost:3000";
const token = localStorage.getItem("token");
export async function addProduct(product) {
    try {
        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("price", product.price);
        formData.append("stock", product.stock);
        formData.append("category", product.category);
        if (product.imageFile) {
            formData.append("imagen", product.imageFile); // ✅ CAMBIO: 'imagen' en lugar de 'filename'
        }

        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/product`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            },
        });
        return { success: true, product: response.data };
    } catch (error) {
        console.error("Error al agregar producto:", error.response?.data?.error || error.message);
        return { success: false, error: error.response?.data?.error || "Error al conectar con el servidor" };
    }
}

// Obtener un producto por ID
export async function getProduct(productId) {
    try {
        const response = await axios.get(`${API_URL}/product/${productId}`);
        return { success: true, product: response.data };
    } catch (error) {
        console.error("Error al obtener producto:", error.response?.data?.error || error.message);
        return { success: false, error: error.response?.data?.error || "Error al conectar con el servidor" };
    }
}
// Obtener todos los productos
export async function getProducts() {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return { success: true, products: response.data };
    } catch (error) {
        console.error("Error al obtener productos:", error.response?.data?.error || error.message);
        return { success: false, error: error.response?.data?.error || "Error al conectar con el servidor" };
    }
}
// Actualizar (editar) un producto
export async function editProduct(productId, product) {
    try {
        const formData = new FormData();
        // Agregar solo los campos que se quieran actualizar
        if (product.name) formData.append("name", product.name);
        if (product.price) formData.append("price", product.price);
        if (product.stock) formData.append("stock", product.stock);
        if (product.category) formData.append("category", product.category);
        // Si se envía nueva imagen, la agregamos
        if (product.image) formData.append("imagen", product.image);
        const token = localStorage.getItem("token");
        if (!token) {
            return { success: false, error: "No se encontró el token de autenticación." };
        }
        const response = await axios.patch(`${API_URL}/product/${productId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            },
        });
        return { success: true, product: response.data };
    } catch (error) {
        console.error("Error al actualizar producto:", error.response?.data?.error || error.message);
        return { success: false, error: error.response?.data?.error || "Error al conectar con el servidor" };
    }
}
// Eliminar un producto
export async function deleteProduct(productId) {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            return { success: false, error: "No se encontró el token de autenticación." };
        }
        const response = await axios.delete(`${API_URL}/product/${productId}`,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
        return { success: true, message: response.data.message, deletedProduct: response.data.deletedProduct };
    } catch (error) {
        console.error("Error al eliminar producto:", error.response?.data?.error || error.message);
        return { success: false, error: error.response?.data?.error || "Error al conectar con el servidor" };
    }
}
