import { useState ,useEffect} from 'react';
import { Pencil, Trash2, Plus, Save, X } from 'lucide-react';
import PropTypes from "prop-types";
import {addProduct,
    getProducts,
    editProduct,
    deleteProduct
} from "../services/products_api.js";
import {getMessages,
    deleteMessage
} from "../services/messages_api.js";
import {getAllOrders} from "../services/order_api.js";
const categories = ["Ropa", "Maquillaje"];
import { ToastNotification } from "../components/ToastNotification";
import { ToastContainer } from 'react-toastify';
// Button Component
function Button({ className = '', variant = 'default', size = 'default', children, ...props }) {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors';
    const variantStyles = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
    };
    const sizeStyles = {
        default: 'h-10 px-4 py-2',
        icon: 'h-10 w-10',
    };

    const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
}

Button.propTypes = {
    className: PropTypes.string,
    variant: PropTypes.oneOf(['default', 'ghost']),
    size: PropTypes.oneOf(['default', 'icon']),
    children: PropTypes.node.isRequired,
};

// Input Component
function Input({ className = '', ...props }) {
    const baseStyles = `
    flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
    file:border-0 file:bg-transparent file:text-sm file:font-medium
    placeholder:text-muted-foreground
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-50
  `;
    return <input className={`${baseStyles} ${className}`} {...props} />;
}

Input.propTypes = {
    className: PropTypes.string,
};

// Table Components
function Table({ children, className = '', ...props }) {
    return (
        <div className="relative w-full overflow-auto">
            <table className={`w-full caption-bottom text-sm ${className}`} {...props}>
                {children}
            </table>
        </div>
    );
}

Table.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

function TableHeader({ children, className = '', ...props }) {
    return (
        <thead className={`[&_tr]:border-b ${className}`} {...props}>
        {children}
        </thead>
    );
}

TableHeader.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

function TableBody({ children, className = '', ...props }) {
    return (
        <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props}>
        {children}
        </tbody>
    );
}

TableBody.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

function TableRow({ children, className = '', ...props }) {
    return (
        <tr className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`} {...props}>
            {children}
        </tr>
    );
}

TableRow.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

function TableHead({ children, className = '', ...props }) {
    return (
        <th className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>
            {children}
        </th>
    );
}

TableHead.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

function TableCell({ children, className = '', ...props }) {
    return (
        <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>
            {children}
        </td>
    );
}

TableCell.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

function CategorySelect({ value, onChange }) {
    return (
        <select value={value} onChange={(e) => onChange(e.target.value)} className="border rounded-md p-2">
            <option value="">Seleccione una categoría</option>
            {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
            ))}
        </select>
    );
}

CategorySelect.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

// Products Table Component
function ProductsTable() {
    const [products, setProducts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [newProduct, setNewProduct] = useState({});
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const response = await getProducts();
            if (response.success) {
                // Adaptamos los datos al formato esperado por la tabla
                const formattedProducts = response.products.map(product => ({
                    id: product.id_producto,
                    name: product.nombre,
                    price: parseFloat(product.precio),
                    stock: product.stock,
                    imageUrl: `http://localhost:3000${product.imagen}`,
                    category: product.categoria
                }));
                setProducts(formattedProducts);
            }
            setLoading(false);
        };
        fetchProducts();
    }, []);
    if (loading) {
        return <p className="text-center text-gray-500">Cargando productos...</p>;
    }
    const handleEdit = (product) => {
        setEditingId(product.id);
        setNewProduct({ ...product });
    };

    const handleImageChange = (e, isEditing = false) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            if (isEditing) {
                setNewProduct({
                    ...newProduct,
                    imageFile: file,
                    imageUrl: file.name
                });
            } else {
                setNewProduct(prev => ({
                    ...prev,
                    imageFile: file,
                    imageUrl: file.name
                }));
            }
        }
    };

    const handleSave = async () => {
        try {
            if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.category) {
                throw new Error("Todos los campos son requeridos");
            }
            // Llamar a la API para actualizar el producto
            const response = await editProduct(editingId, {
                name: newProduct.name,
                price: newProduct.price,
                stock: newProduct.stock,
                category: newProduct.category,
                image: newProduct.imageFile, // Aquí pasas la imagen si se ha cambiado
            });
            if (!response.success) {
                ToastNotification({ type: "error", message: response.error });
                return;
            }
            ToastNotification({ type: "success", message: "Producto actualizado correctamente." });
            // Actualizar la lista de productos en el estado
            setProducts((prevProducts) =>
                prevProducts.map((p) =>
                    p.id === editingId ? { ...p, ...response.product } : p
                )
            );
            // Limpia el estado de edición
            setEditingId(null);
            setNewProduct({});
        } catch (error) {
            console.error("Error al actualizar producto:", error.message);
            ToastNotification({ type: "error", message: "Error al actualizar el producto" });
        }
    };
    const handleDelete = async (id) => {
        const response = await deleteProduct(id); // Aquí pasamos solo el `id`
        if (!response.success) {
            ToastNotification({ type: "error", message: response.error });
            return;
        }
        ToastNotification({ type: "success", message: "Producto eliminado correctamente." });
        setProducts(products.filter(p => p.id !== id)); // Elimina el producto del estado
    };

    const handleAdd = async () => {
        if (
            newProduct.name &&
            newProduct.price &&
            newProduct.stock &&
            newProduct.category &&
            newProduct.imageFile
        ) {
            const response = await addProduct({
                name: newProduct.name,
                price: newProduct.price,
                stock: newProduct.stock,
                category: newProduct.category,
                imageFile: newProduct.imageFile // ✅ corregido
            });

            if (!response.success) {
                ToastNotification({ type: "error", message: response.error });
                return;
            }
            ToastNotification({ type: "success", message: response.product.message });
            const newId = Math.max(...products.map(p => p.id), 0) + 1;
            setProducts([
                ...products,
                {
                    id: newId,
                    ...newProduct,
                    imageUrl: newProduct.imageFile.name
                }
            ]);
            setIsAdding(false);
            setNewProduct({});
        }
    };



    const handleChange = (field, value) => {
        setNewProduct({
            ...newProduct,
            [field]: field === "price" || field === "stock" ? Number(value) : value,
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Gestión de Productos</h2>
                <Button onClick={() => setIsAdding(true)} disabled={isAdding} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir Producto
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Imagen</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isAdding && (
                        <TableRow>
                            <TableCell>Nuevo</TableCell>
                            <TableCell>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    name="imagen"
                                    onChange={(e) => handleImageChange(e)}
                                    className="w-full"
                                />
                                {newProduct.imageUrl && (
                                    <p className="mt-2 text-sm text-gray-600">{newProduct.imageUrl}</p>
                                )}
                            </TableCell>
                            <TableCell>
                                <Input
                                    value={newProduct.name || ""}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    placeholder="Nombre del producto"
                                />
                            </TableCell>
                            <TableCell>
                                <CategorySelect
                                    value={newProduct.category || ""}
                                    onChange={(value) => handleChange("category", value)}
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    type="number"
                                    value={newProduct.price || ""}
                                    onChange={(e) => handleChange("price", e.target.value)}
                                    placeholder="Precio"
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    type="number"
                                    value={newProduct.stock || ""}
                                    onChange={(e) => handleChange("stock", e.target.value)}
                                    placeholder="Stock"
                                />
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={handleAdd}>
                                    <Save className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    )}
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.id}</TableCell>
                            <TableCell>
                                {editingId === product.id ? (
                                    <div>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            name="imagen"
                                            onChange={(e) => handleImageChange(e, true)}
                                            className="w-full"
                                        />
                                        {newProduct.imageUrl && (
                                            <p className="mt-2 text-sm text-gray-600">{newProduct.imageUrl}</p>
                                        )}
                                    </div>
                                ) : (
                                    <img src={product.imageUrl} alt={product.name} className="h-16 w-16 object-cover rounded" />
                                )}
                            </TableCell>
                            <TableCell>
                                {editingId === product.id ? (
                                    <Input
                                        value={newProduct.name || ""}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                    />
                                ) : (
                                    product.name
                                )}
                            </TableCell>
                            <TableCell>
                                {editingId === product.id ? (
                                    <CategorySelect
                                        value={newProduct.category || ""}
                                        onChange={(value) => handleChange("category", value)}
                                    />
                                ) : (
                                    product.category
                                )}
                            </TableCell>
                            <TableCell>
                                {editingId === product.id ? (
                                    <Input
                                        type="number"
                                        value={newProduct.price || ""}
                                        onChange={(e) => handleChange("price", e.target.value)}
                                    />
                                ) : (
                                    `$${product.price.toFixed(2)}`
                                )}
                            </TableCell>
                            <TableCell>
                                {editingId === product.id ? (
                                    <Input
                                        type="number"
                                        value={newProduct.stock || ""}
                                        onChange={(e) => handleChange("stock", e.target.value)}
                                    />
                                ) : (
                                    product.stock
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                {editingId === product.id ? (
                                    <>
                                        <Button variant="ghost" size="icon" onClick={handleSave}>
                                            <Save className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => setEditingId(null)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

// Orders Table Component
function OrdersTable() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Llamar a la API cuando el componente se monta
        const fetchOrders = async () => {
            try {
                const { success, orders } = await getAllOrders();
                if (success) {
                    setOrders(orders);
                } else {
                    console.error("No se pudieron obtener los pedidos.");
                }
            } catch (error) {
                console.error("Error al obtener los pedidos:", error);
            }
        };

        fetchOrders();
    }, []); // Este efecto solo se ejecuta al montar el componente

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Gestión de Pedidos</h2>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Productos</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id_pedido}>
                            <TableCell>{order.id_pedido}</TableCell>
                            <TableCell>{order.usuario_nombre}</TableCell>
                            <TableCell>{order.producto_nombre}</TableCell>
                            <TableCell>${order.total_a_pagar}</TableCell>
                            <TableCell>{order.status || "Pendiente"}</TableCell> {/* Puedes modificar el estado si tienes esa información */}
                            <TableCell>{new Date(order.fecha_pedido).toLocaleDateString()}</TableCell> {/* Formatear la fecha */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

// Users Table Component
function MessagesTable() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    // useEffect para obtener los mensajes cuando se monta el componente
    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            const response = await getMessages();
            if (response.success) {
                // Si la respuesta es un solo objeto, lo convertimos a array
                const msgs = Array.isArray(response.messages)
                    ? response.messages
                    : [response.messages];
                setMessages(msgs);
            } else {
                ToastNotification({ type: "error", message: response.error });
            }
            setLoading(false);
        };

        fetchMessages();
    }, []);

    // Función para eliminar un mensaje
    const handleDelete = async (id) => {
        const response = await deleteMessage(id);
        if (!response.success) {
            ToastNotification({ type: "error", message: response.error });
            return;
        }
        ToastNotification({ type: "success", message: response.message });
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
    };

    if (loading) {
        return <p className="text-center text-gray-500">Cargando mensajes...</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Mensaje</TableHead>
                    <TableHead>Creado en</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {messages.map((message) => (
                    <TableRow key={message.id}>
                        <TableCell>{message.id}</TableCell>
                        <TableCell>{message.nombre}</TableCell>
                        <TableCell>{message.correo}</TableCell>
                        <TableCell>{message.mensaje}</TableCell>
                        <TableCell>
                            {new Date(message.creado_en).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(message.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

// Main Product Table Component
function ProductTable() {
    const [activeTab, setActiveTab] = useState('products');

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold mb-2">Panel de Administración</h1>
                        <div className="flex space-x-4">
                            <button
                                className={`font-medium ${activeTab === 'products' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                                onClick={() => setActiveTab('products')}
                            >
                                Productos
                            </button>
                            <button
                                className={`font-medium ${activeTab === 'orders' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                                onClick={() => setActiveTab('orders')}
                            >
                                Pedidos
                            </button>
                            <button
                                className={`font-medium ${activeTab === 'users' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                                onClick={() => setActiveTab('users')}
                            >
                                Usuarios
                            </button>
                        </div>
                    </div>

                    {activeTab === 'products' && <ProductsTable />}
                    {activeTab === 'orders' && <OrdersTable />}
                    {activeTab === 'users' && <MessagesTable/>}
                </div>
            </div>
            <ToastContainer></ToastContainer>
        </div>
    );
}

export default ProductTable;