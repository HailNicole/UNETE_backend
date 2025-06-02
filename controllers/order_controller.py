from flask import jsonify, request
from app.extensions import db
from datetime import datetime

def create_order():
    data = request.get_json()
    user_id = data.get('user_id')
    total = data.get('total')

    if not all([user_id, total]):
        return jsonify({"error": "Datos incompletos"}), 400

    try:
        cursor = db.connection.cursor()
        cursor.execute("""
            INSERT INTO ordenes (usuario_id, total, fecha)
            VALUES (%s, %s, %s)
        """, (user_id, total, datetime.now()))
        db.connection.commit()
        order_id = cursor.lastrowid
        cursor.close()
        return jsonify({"message": "Orden creada", "order_id": order_id}), 201
    except Exception as e:
        return jsonify({"error": "Error al crear orden"}), 500

def get_user_orders(user_id):
    try:
        cursor = db.connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM ordenes WHERE usuario_id = %s ORDER BY fecha DESC", (user_id,))
        orders = cursor.fetchall()
        cursor.close()
        return jsonify(orders), 200
    except Exception as e:
        return jsonify({"error": "Error al obtener ordenes"}), 500

def get_all_orders():
    try:
        cursor = db.connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM ordenes ORDER BY fecha DESC")
        orders = cursor.fetchall()
        cursor.close()
        return jsonify(orders), 200
    except Exception as e:
        return jsonify({"error": "Error al obtener todas las ordenes"}), 500