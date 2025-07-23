import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {logout} from "../services/users_api"
export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const isAuthenticated = localStorage.getItem("auth") === "true";
    const role = localStorage.getItem("role");
    const handleLogout = () => {
        logout()
        localStorage.removeItem("auth")
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
    };
    useEffect(() => {
        setIsMenuOpen(false);
    }, []);

    const links = [
        { to: "/products", label: "Productos" },
        { to: "/contact", label: "Contacto" },
    ];


    if (!isAuthenticated) {
        links.push(
            { to: "/register", label: "Registro" },
            { to: "/login", label: "Iniciar sesión" }
        );
    } else if (role === "admin") {
        links.push(
            { to: "/admin", label: "Administrador" },
            { to: "/admin-report", label: "Administrador Reporte" }
        );
    } else if (role === "usuario") {

        links.push({ to: "/order", label: "Pedidos" });
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link to="/" className="text-xl font-bold">
                        Unete
                    </Link>

                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden rounded-lg p-2 hover:bg-gray-100">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>

                    <nav className="hidden lg:block">
                        <ul className="flex items-center gap-6">
                            {links.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className={`text-sm font-medium transition-colors hover:text-black relative
                      ${
                                            location.pathname === link.to
                                                ? "text-black after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-black"
                                                : "text-gray-600 hover:after:absolute hover:after:bottom-[-4px] hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-black"
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            {isAuthenticated && (
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                            />
                                        </svg>
                                        Cerrar sesión
                                    </button>
                                </li>
                            )}
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}
