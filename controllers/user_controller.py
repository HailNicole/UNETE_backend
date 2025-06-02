from flask import jsonify, request, current_app
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from app.extensions import db

def create_user():
    data = request.get_json()
    nombre = data.get('nombre')
    correo = data.get('correo')
    contrasena = data.get('contrasena')

    if not all([nombre, correo, contrasena]):
        return jsonify({"error": "Datos incompletos"}), 400

    hashed_password = generate_password_hash(contrasena)

    try:
        cursor = db.connection.cursor()
        cursor.execute("""
            INSERT INTO usuarios (nombre, correo, contrasena)
            VALUES (%s, %s, %s)
        """, (nombre, correo, hashed_password))
        db.connection.commit()
        cursor.close()
        return jsonify({"message": "Usuario registrado correctamente"}), 201
    except Exception as e:
        return jsonify({"error": "Error al registrar usuario"}), 500

def login_user():
    data = request.get_json()
    correo = data.get('correo')
    contrasena = data.get('contrasena')

    try:
        cursor = db.connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM usuarios WHERE correo = %s", (correo,))
        user = cursor.fetchone()
        cursor.close()
        if user and check_password_hash(user['contrasena'], contrasena):
            token = jwt.encode({
                'user_id': user['id'],
                'exp': datetime.utcnow() + timedelta(hours=12)
            }, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')
            return jsonify({"token": token}), 200
        else:
            return jsonify({"error": "Credenciales incorrectas"}), 401
    except Exception as e:
        return jsonify({"error": "Error al iniciar sesión"}), 500

def logout_user():
    return jsonify({"message": "Sesión cerrada"}), 200

def get_users():
    try:
        cursor = db.connection.cursor(dictionary=True)
        cursor.execute("SELECT id, nombre, correo FROM usuarios")
        users = cursor.fetchall()
        cursor.close()
        return jsonify(users), 200
    except Exception as e:
        return jsonify({"error": "Error al obtener usuarios"}), 500

def get_profile():
    user_id = getattr(request, 'user_id', None)
    if not user_id:
        return jsonify({"error": "No autorizado"}), 401
    try:
        cursor = db.connection.cursor(dictionary=True)
        cursor.execute("SELECT id, nombre, correo FROM usuarios WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        cursor.close()
        if user:
            return jsonify(user), 200
        else:
            return jsonify({"error": "Usuario no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": "Error al obtener perfil"}), 500

def authenticate_token(f):
    from functools import wraps

    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Token requerido"}), 401
        try:
            data = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            request.user_id = data['user_id']
        except Exception as e:
            return jsonify({"error": "Token inválido"}), 401
        return f(*args, **kwargs)

    return decorated