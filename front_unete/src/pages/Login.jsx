import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/users_api";
import { ToastNotification } from "../components/ToastNotification";
import { ToastContainer } from 'react-toastify';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await login(formData.correo, formData.contrasena);

      if (response.success) {
        localStorage.setItem("auth", "true");
        localStorage.setItem("role", response.role);
        localStorage.setItem("token", response.token);
        localStorage.setItem("id_user", response.name);

        ToastNotification({ type: "success", message: "Bienvenido" });

        if (response.role === "admin") {
          navigate("/admin");
        } else if (response.role === "usuario") {
          navigate("/order");
        }
      } else {
        ToastNotification({ type: "error", message: "Error de credenciales" });
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema con la autenticación. Intenta más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[500px] border border-gray-300 rounded-lg shadow-md bg-white">
        <div className="p-12 space-y-8">
          <h1 className="text-2xl font-normal text-center">Sign In</h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="correo" className="block text-sm font-semibold">
                  Correo:
                </label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
                  value={formData.correo}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contrasena" className="block text-sm font-semibold">
                  Contraseña:
                </label>
                <input
                  id="contrasena"
                  name="contrasena"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
                  value={formData.contrasena}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white rounded py-2 text-sm hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "SIGN IN"}
              </button>

              <div className="flex justify-center">
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">New User</p>
                <Link
                  to="/register"
                  className="block w-full text-black border rounded py-2 text-sm text-center hover:bg-gray-800 transition-colors"
                >
                  SIGN UP
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
