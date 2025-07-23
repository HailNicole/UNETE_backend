import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/products_api.js";

// Star Rating Component
function StarRating({ rating }) {
    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-5 h-5 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

StarRating.propTypes = {
    rating: PropTypes.number.isRequired,
};

// Product Card Component (dentro del mismo archivo)
function ProductCard({ name, price, stock, imageUrl, category, onAddToCart }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
            <img src={imageUrl || "/placeholder.svg"} alt={name} className="w-full h-56 object-cover mb-4 rounded" />
            <div className="mb-2">
        <span
            className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${
                category.toLowerCase() === "ropa" ? "text-pink-600 bg-pink-200" : "text-purple-600 bg-purple-200"
            }`}
        >
          {category}
        </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{name}</h3>
            <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-indigo-600">${price.toFixed(2)}</span>
                <span className="text-sm text-gray-600">Stock: {stock}</span>
            </div>
            <button
                onClick={onAddToCart}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300"
            >
                Añadir al carrito
            </button>
        </div>
    );
}

ProductCard.propTypes = {
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    onAddToCart: PropTypes.func.isRequired,
};

// Main Product Page Component
function ProductPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("todos");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]); // Estado para el carrito

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const response = await getProducts();
            if (response.success) {
                // Adaptamos los datos al formato esperado
                const formattedProducts = response.products.map((product) => ({
                    id: product.id_producto,
                    name: product.nombre,
                    price: Number.parseFloat(product.precio),
                    stock: product.stock,
                    imageUrl: `http://localhost:3000/${product.imagen}`,
                    category: product.categoria,
                }));
                setProducts(formattedProducts);
            }
            setLoading(false);
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (categoryFilter === "todos" || product.category === categoryFilter)
    );

    const handleCartClick = () => {
        navigate("/order", { state: { cart } });
    };

    // Función para añadir un producto al carrito
    const handleAddToCart = (product) => {
        setCart((prevCart) => {
            const index = prevCart.findIndex((item) => item.id === product.id);
            let updatedCart;
            if (index >= 0) {
                // Si el producto ya está en el carrito, incrementa la cantidad
                updatedCart = prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                // Si no existe, agrégalo con cantidad 1
                updatedCart = [...prevCart, { ...product, quantity: 1 }];
            }
            console.log("Carrito:", updatedCart);
            return updatedCart;
        });
    };

    // Calcular la cantidad total de items en el carrito
    const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

    if (loading) {
        return <p className="text-center text-gray-500">Cargando productos...</p>;
    }

    return (
        <div className="bg-gray-50 py-8 relative">
            {/* Botón del carrito con badge de cantidad */}
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={handleCartClick}
                    className="relative bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors duration-300"
                >
                    <ShoppingCart size={24} />
                    {totalCartItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {totalCartItems}
            </span>
                    )}
                </button>
            </div>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Nuestros Productos</h1>

                <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
                    <div className="mb-4 sm:mb-0 w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-full sm:w-auto">
                        <select
                            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="todos">Todos los productos</option>
                            <option value="Ropa">Ropa</option>
                            <option value="Maquillaje">Maquillaje</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            {...product}
                            onAddToCart={() => handleAddToCart(product)}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}

export default ProductPage;
