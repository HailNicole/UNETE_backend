from flask import jsonify, request
from app.extensions import db

def message_user():
    data = request.get_json()
    nombre = data.get('nombre')
    correo = data.get('correo')
    mensaje = data.get('mensaje')

    if not all([nombre, correo, mensaje]):
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    try:
        cursor = db.connection.cursor()
        cursor.execute("""
            INSERT INTO mensajes (nombre, correo, mensaje)
            VALUES (%s, %s, %s)
        """, (nombre, correo, mensaje))
        db.connection.commit()
        cursor.close()
        return jsonify({"message": "Mensaje enviado correctamente"}), 201
    except Exception as e:
        return jsonify({"error": "Error al enviar mensaje"}), 500

def get_messages():
    try:
        cursor = db.connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM mensajes ORDER BY fecha DESC")
        mensajes = cursor.fetchall()
        cursor.close()
        return jsonify(mensajes), 200
    except Exception as e:
        return jsonify({"error": "Error al obtener los mensajes"}), 500

def delete_message(id):
    try:
        cursor = db.connection.cursor()
        cursor.execute("DELETE FROM mensajes WHERE id = %s", (id,))
        db.connection.commit()
        cursor.close()
        return jsonify({"message": "Mensaje eliminado correctamente"}), 200
    except Exception as e:
        return jsonify({"error": "Error al eliminar el mensaje"}), 500