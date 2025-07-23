import { toast } from 'react-toastify';

// Función para mostrar notificaciones
export const ToastNotification = ({ type, message }) => {
    const config = {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        pauseOnHover: true,
    };

    // Dependiendo del tipo, mostramos el toast con el mensaje
    if (type === "success") {
        toast.success(message, config);
    } else if (type === "error") {
        toast.error(message, config);
    }
};

export default ToastNotification;