from flask import jsonify, current_app
from app.extensions import db
import mysql.connector
import os

def insert_product(data):
    name = data.get('name')
    price = data.get('price')
    stock = data.get('stock')
    category = data.get('category')
    filename = data.get('filename')

    if not all([name, price, stock, category, filename]):
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    try:
        price = float(price)
        stock = int(stock)
        if price <= 0 or stock < 0:
            raise ValueError
    except ValueError:
        return jsonify({"error": "Precio debe ser positivo y stock entero no negativo"}), 400

    image_url = f"/uploads/{filename}"

    try:
        cursor = db.connection.cursor()
        query = """
            INSERT INTO productos (nombre, precio, stock, imagen, categoria)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (name, price, stock, image_url, category))
        db.connection.commit()
        product_id = cursor.lastrowid
        cursor.close()
        return jsonify({
            "id": product_id,
            "name": name,
            "category": category,
            "price": price,
            "stock": stock,
            "imageUrl": image_url,
            "message": "Producto creado exitosamente"
        }), 201
    except mysql.connector.Error as e:
        current_app.logger.error(f"DB Error: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500

def get_product(id):
    try:
        cursor = db.connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM productos WHERE id = %s", (id,))
        product = cursor.fetchone()
        cursor.close()
        if product:
            return jsonify(product), 200
        else:
            return jsonify({"error": "Producto no encontrado"}), 404
    except mysql.connector.Error as e:
        return jsonify({"error": "Error interno del servidor"}), 500

def get_products():
    try:
        cursor = db.connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM productos")
        products = cursor.fetchall()
        cursor.close()
        return jsonify(products), 200
    except mysql.connector.Error as e:
        return jsonify({"error": "Error interno del servidor"}), 500

def edit_product(id, data, filename=None):
    fields = []
    values = []

    for key in ['name', 'price', 'stock', 'category']:
        if key in data:
            fields.append(f"{key if key != 'name' else 'nombre'} = %s")
            values.append(data[key])

    if filename:
        fields.append("imagen = %s")
        values.append(f"/uploads/{filename}")

    if not fields:
        return jsonify({"error": "No hay datos para actualizar"}), 400

    values.append(id)

    query = f"UPDATE productos SET {', '.join(fields)} WHERE id = %s"

    try:
        cursor = db.connection.cursor()
        cursor.execute(query, tuple(values))
        db.connection.commit()
        cursor.close()
        return jsonify({"message": "Producto actualizado exitosamente"}), 200
    except mysql.connector.Error as e:
        return jsonify({"error": "Error interno del servidor"}), 500

def delete_product(id):
    try:
        cursor = db.connection.cursor()
        cursor.execute("DELETE FROM productos WHERE id = %s", (id,))
        db.connection.commit()
        cursor.close()
        return jsonify({"message": "Producto eliminado exitosamente"}), 200
    except mysql.connector.Error as e:
        return jsonify({"error": "Error interno del servidor"}), 500
