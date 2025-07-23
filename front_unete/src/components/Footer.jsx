import { Github, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import PropTypes from "prop-types";
function SocialLink({ href, icon: Icon, label }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300 transition-colors"
            aria-label={label}
        >
            <Icon className="w-6 h-6" />
        </a>
    );
}
SocialLink.propTypes = {
    href: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
};
function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-black text-white border-t border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-lg font-semibold mb-4">UNETE</h3>
                        <p className="text-gray-400 mb-4">
                            Transformando la industria de la belleza con productos de alta calidad y servicio excepcional.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/products" className="text-gray-400 hover:text-white">Productos</a>
                            </li>
                            <li>
                                <a href="/contact" className="text-gray-400 hover:text-white">Contacto</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
                        <div className="flex space-x-4">
                            <SocialLink
                                href="https://github.com/francixcode2004/UNETE"
                                icon={Github}
                                label="GitHub"
                            />
                            <SocialLink
                                href="https://facebook.com/unete"
                                icon={Facebook}
                                label="Facebook"
                            />
                            <SocialLink
                                href="https://www.instagram.com/francixx_985/?igsh=MWVmZ3Vqbzl6c2F2dw%3D%3D#"
                                icon={Instagram}
                                label="Instagram"
                            />
                            <SocialLink
                                href="https://twitter.com/unete"
                                icon={Twitter}
                                label="Twitter"
                            />
                            <SocialLink
                                href="https://linkedin.com/company/unete"
                                icon={Linkedin}
                                label="LinkedIn"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © {currentYear} UNETE. Todos los derechos reservados.
                        </p>
                        <p className="text-gray-400 text-sm mt-2 md:mt-0">
                            Desarrollado por Francisco Lopez
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
export default Footer;