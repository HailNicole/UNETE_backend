import React from 'react';
import PropTypes from 'prop-types';
import { Phone, Mail, User } from 'lucide-react';
import { ToastNotification } from "../components/ToastNotification";
import { ToastContainer } from 'react-toastify';
import { uploadmessage } from "../services/messages_api.js";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// Importa Leaflet y configura los íconos (opcional, debido a problemas con el default marker)
import L from 'leaflet';

// Configuración de ícono para los markers de Leaflet (esto evita problemas con la carga de imágenes)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ContactInfo Component
function ContactInfo({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
            <div className="bg-blue-100 p-3 rounded-full">
                <Icon className="w-6 h-6 text-blue-500" />
            </div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-lg font-medium text-gray-900">{value}</p>
            </div>
        </div>
    );
}

ContactInfo.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
};

// CompanyHistory Component
function CompanyHistory({ title, description }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
}

CompanyHistory.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

// CompanyMap Component
function CompanyMap() {
    // Coordenadas aproximadas para "408 Av. Libertador Simón Bolívar, Quito, Pichincha"
    const position = [-0.063606, -78.355049];
    return (
        <MapContainer center={position} zoom={16} style={{ height: "474px", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
            />
            <Marker position={position}>
                <Popup>
                    408 Av. Libertador Simón Bolívar<br /> Quito, Pichincha
                </Popup>
            </Marker>
        </MapContainer>
    );
}

// ContactForm Component
function ContactForm({ onSubmit }) {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un mensaje</h2>

            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Mensaje
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Enviar mensaje
                </button>
            </div>
        </form>
    );
}

ContactForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

// Main ContactPage Component
function ContactPage() {
    const handleSubmit = async (formData) => {
        const response = await uploadmessage(formData.name, formData.email, formData.message);
        if (!response.success) {
            ToastNotification({ type: "error", message: response.error });
            return;
        }
        ToastNotification({ type: "success", message: response.message });
    };
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Contáctanos</h1>
                    <p className="text-lg text-gray-600">Estamos aquí para ayudarte</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <CompanyHistory
                        title="Nuestra Historia"
                        description="UNETE nació
                        en 2025 con la visión de revolucionar la industria de la belleza y moda.
                        Desde entonces, nos hemos dedicado a ofrecer productos de alta calidad
                        y un servicio excepcional a nuestros clientes. Nuestra pasión por la innovación
                         y el compromiso con la satisfacción del cliente nos han convertido en líderes del mercado."
                    />
                    <div className="space-y-4">
                        <ContactInfo
                            icon={Phone}
                            label="Teléfono"
                            value="+593 0986266139"
                        />
                        <ContactInfo
                            icon={Mail}
                            label="Correo electrónico"
                            value="patricia_espinoza7@gmail.com"
                        />
                        <ContactInfo
                            icon={User}
                            label="Horario de atención"
                            value="Lun - Vie: 8:00 - 19:00"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div>
                        <ContactForm onSubmit={handleSubmit} />
                    </div>
                    <div>
                        {/* Muestra el mapa de la ubicación de la empresa */}
                        <CompanyMap />
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default ContactPage;
