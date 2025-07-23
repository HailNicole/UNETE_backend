import { useState } from "react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import { register } from "../services/users_api"
import { ToastNotification } from "../components/ToastNotification";
import { ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export function RegisterForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        contrasena: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.contrasena === formData.confirmContrasena) {
            const userData = {
                nombre: formData.nombre,
                correo: formData.correo,
                contrasena: formData.contrasena
            };

            const response = await register(userData);

            if (response.success) {
                ToastNotification({ type: "success", message: response.message });
                navigate("/login");
            } else {
                ToastNotification({ type: "error", message: response.error || "Error al registrar usuario." });
                console.error(response.error);
            }
        } else {
            ToastNotification({ type: "error", message: "Las contraseñas no coinciden." });
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        })
    }

    return (
        <>
            <div className="mx-auto max-w-sm space-y-6 p-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-semibold">Sign Up</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre:</Label>
                        <Input id="nombre" placeholder="Juan Perez" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="correo">Correo:</Label>
                        <Input id="correo" type="email" placeholder="juan@email.com" value={formData.correo} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contrasena">Contraseña:</Label>
                        <Input id="contrasena" type="password" value={formData.contrasena} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmContrasena">Confirmar contraseña:</Label>
                        <Input id="confirmContrasena" type="password" value={formData.confirmContrasena} onChange={handleChange} required />
                    </div>
                    <Button type="submit" className="w-full bg-black text-white">
                        SIGN UP
                    </Button>
                </form>
            </div>
            <ToastContainer />
        </>
    )
}
export default RegisterForm
