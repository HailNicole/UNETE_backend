CREATE DATABASE IF NOT EXISTS mydatabase;
USE mydatabase;
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    role ENUM('admin', 'usuario') NOT NULL DEFAULT 'usuario',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    imagen VARCHAR(255),
    categoria VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE mensajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    mensaje VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)ENGINE=InnoDB;


INSERT INTO usuarios (nombre, correo, contrasena, role)
VALUES ('admin', 'admin@email.com', 'admin123', 'admin');

CREATE TRIGGER reduce_stock_after_insert
AFTER INSERT ON pedidos
FOR EACH ROW
BEGIN
    -- Actualiza el stock restando la cantidad pedida
    UPDATE productos
    SET stock = stock - NEW.cantidad
    WHERE id_producto = NEW.id_producto;
END;

SELECT
    p.nombre AS producto,
    SUM(pe.total) AS ventas_totales,
    SUM(pe.cantidad) AS cantidad_total_vendida
FROM
    pedidos pe
JOIN
    productos p ON pe.id_producto = p.id_producto
GROUP BY
    p.nombre
ORDER BY
    ventas_totales DESC;

SELECT
    DATE(fecha_pedido) AS dia,
    SUM(total) AS ventas_totales
FROM
    pedidos
WHERE
    fecha_pedido >= CURDATE() - INTERVAL 30 DAY
GROUP BY
    DATE(fecha_pedido)
ORDER BY
    DATE(fecha_pedido);