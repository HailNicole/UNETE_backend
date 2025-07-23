import { useState } from "react"
import PropTypes from "prop-types"
import { Trash2, Plus, Minus, ShoppingBag, ChevronDown, ChevronUp } from "lucide-react"
import { useLocation } from "react-router-dom"
import ToastNotification from "../components/ToastNotification.jsx"
import { ToastContainer } from "react-toastify"
import { createOrder, getUserOrders } from "../services/order_api.js"

// CartItem Component
function CartItem({ name, price, quantity, imageUrl, onIncrease, onDecrease, onRemove }) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
                <img src={imageUrl || "/placeholder.svg"} alt={name} className="w-16 h-16 object-cover rounded-md" />
                <div>
                    <h3 className="font-medium text-gray-900">{name}</h3>
                    <p className="text-gray-600">${price.toFixed(2)}</p>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <button onClick={onDecrease} className="p-1 hover:bg-gray-100 rounded-md">
                        <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-8 text-center">{quantity}</span>
                    <button onClick={onIncrease} className="p-1 hover:bg-gray-100 rounded-md">
                        <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
                <span className="w-20 text-right">${(price * quantity).toFixed(2)}</span>
                <button onClick={onRemove} className="p-1 hover:bg-gray-100 rounded-md text-red-500">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

CartItem.propTypes = {
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
    onIncrease: PropTypes.func.isRequired,
    onDecrease: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
}

// Cart Component
function Cart({ items, onUpdateQuantity, onRemoveItem }) {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const handleProceedToPayment = async () => {
        const cartDetails = items.map((item) => ({
            id_producto: item.id,
            price: item.price,
            quantity: item.quantity,
            stock: item.stock,
            total_a_pagar: item.price * item.quantity,
        }))

        const userId = localStorage.getItem("id_user")

        const paymentData = {
            user_id: userId,
            cart: cartDetails,
            total: total,
        }
        const response = await createOrder(paymentData)
        if (!response.success) {
            ToastNotification({ type: "error", message: "Error al realizar la compra" })
        }
        ToastNotification({ type: "success", message: response.message })
        console.log("Detalles del carrito para proceder al pago:", paymentData)
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Carrito de Compras</h1>

            <div className="space-y-4">
                {items.map((item) => (
                    <CartItem
                        key={item.id}
                        name={item.name}
                        price={item.price}
                        quantity={item.quantity}
                        imageUrl={item.imageUrl}
                        onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        onDecrease={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        onRemove={() => onRemoveItem(item.id)}
                    />
                ))}
            </div>

            <div className="mt-8 flex justify-between items-center border-t pt-4">
                <span className="text-xl font-semibold">Total:</span>
                <span className="text-xl">${total.toFixed(2)}</span>
            </div>

            <button
                className="mt-6 w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors"
                onClick={handleProceedToPayment}
            >
                Proceder al Pago
            </button>
        </div>
    )
}

Cart.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            imageUrl: PropTypes.string.isRequired,
            quantity: PropTypes.number.isRequired,
        }),
    ).isRequired,
    onUpdateQuantity: PropTypes.func.isRequired,
    onRemoveItem: PropTypes.func.isRequired,
}

// Order Item Component
function OrderItem({ order, isOpen, onToggle }) {
    return (
        <div className="bg-white shadow-md rounded-lg mb-4 overflow-hidden">
            <div className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50" onClick={onToggle}>
                <div>
                    <p className="font-semibold">Pedido #{order.id_pedido}</p>
                    <p className="text-sm text-gray-600">{new Date(order.fecha_pedido).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center">
                    <span className="mr-2 font-bold text-green-600">${order.total_a_pagar}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
            </div>
            {isOpen && (
                <div className="p-4 bg-gray-50 border-t">
                    <p>
                        <span className="font-semibold">Producto:</span> {order.producto_nombre}
                    </p>
                    <p>
                        <span className="font-semibold">Cantidad:</span> {order.cantidad}
                    </p>
                </div>
            )}
        </div>
    )
}

OrderItem.propTypes = {
    order: PropTypes.shape({
        id_pedido: PropTypes.number.isRequired,
        fecha_pedido: PropTypes.string.isRequired,
        total_a_pagar: PropTypes.number.isRequired,
        producto_nombre: PropTypes.string.isRequired,
        cantidad: PropTypes.number.isRequired,
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
}

// Main CartPage Component
function CartPage() {
    const location = useLocation()
    const initialCart = location.state && location.state.cart ? location.state.cart : []
    const [cartItems, setCartItems] = useState(initialCart)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [showOrders, setShowOrders] = useState(false)
    const [openOrderId, setOpenOrderId] = useState(null)

    const handleUpdateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return
        setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }

    const handleRemoveItem = (id) => {
        setCartItems(cartItems.filter((item) => item.id !== id))
    }

    const handleViewOrders = async () => {
        if (showOrders) {
            setShowOrders(false)
            return
        }

        setLoading(true)
        setError(null)

        const userId = localStorage.getItem("id_user")

        if (!userId) {
            setError("No se encontró el ID de usuario.")
            setLoading(false)
            return
        }

        try {
            const response = await getUserOrders(userId)
            if (response.success) {
                setOrders(response.orders)
                setShowOrders(true)
            } else {
                setError("No se pudieron obtener los pedidos.")
            }
        } catch (err) {
            setError("Hubo un error al obtener los pedidos.")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const toggleOrderDetails = (orderId) => {
        setOpenOrderId(openOrderId === orderId ? null : orderId)
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Cart items={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} />

            <div className="mt-12">
                <button
                    onClick={handleViewOrders}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
                >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    {showOrders ? "Ocultar Mis Pedidos" : "Ver Mis Pedidos"}
                </button>
            </div>

            {loading && (
                <div className="mt-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                    <p className="mt-2 text-gray-600">Cargando pedidos...</p>
                </div>
            )}

            {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

            {showOrders && orders.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Mis Pedidos</h2>
                    {orders.map((order) => (
                        <OrderItem
                            key={order.id_pedido}
                            order={order}
                            isOpen={openOrderId === order.id_pedido}
                            onToggle={() => toggleOrderDetails(order.id_pedido)}
                        />
                    ))}
                </div>
            )}

            {showOrders && orders.length === 0 && <p className="mt-4 text-center text-gray-600">No tienes pedidos aún.</p>}

            <ToastContainer />
        </div>
    )
}

export default CartPage

