from flask import Blueprint, request
from app.controllers.user_controller import (
    create_user,
    login_user,
    logout_user,
    get_users,
    get_profile
)
from flask_jwt_extended import jwt_required

user_bp = Blueprint('users', __name__)

@user_bp.route('/register', methods=['POST'])
def route_register_user():
  """
  Registro de usuario
  ---
  tags:
    - Usuarios
  parameters:
    - in: body
      name: usuario
      required: true
      schema:
        type: object
        properties:
          nombre:
            type: string
            example: Ana López
          correo:
            type: string
            example: ana@email.com
          contrasena:
            type: string
            example: secreta123
  responses:
    201:
      description: Usuario registrado correctamente
    400:
      description: Datos incompletos
  """
  data = request.get_json()
  return create_user(data)

@user_bp.route('/login', methods=['POST'])
def route_login_user():
  """
  Inicio de sesión
  ---
  tags:
    - Usuarios
  parameters:
    - in: body
      name: credenciales
      required: true
      schema:
        type: object
        properties:
          correo:
            type: string
            example: ana@email.com
          contrasena:
            type: string
            example: secreta123
  responses:
    200:
      description: Usuario autenticado, devuelve token
    401:
      description: Credenciales incorrectas
  """
  data = request.get_json()
  return login_user(data)
  
@user_bp.route('/logout', methods=['POST'])
@jwt_required()
def route_logout_user():
  """
  Cerrar sesión
  ---
  tags:
    - Usuarios
  security:
    - Bearer: []
  responses:
    200:
      description: Sesión cerrada 
  """
  return logout_user()

@user_bp.route('/users', methods=['GET'])
@jwt_required()
def route_get_users():
  """
  Obtener todos los usuarios
  ---
  tags:
    - Usuarios
  security:
    - Bearer: []
  responses:
    200:
      description: Lista de usuarios
      schema:
        type: array
        items:
          type: object
          properties:
            id:
              type: integer
            nombre:
              type: string
            correo:
              type: string
  """
  return get_users()
  
@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def route_get_profile():
  """
  Obtener perfil de usuario
  ---
  tags:
    - Usuarios
  security:
    - Bearer: []
  responses:
    200:
      description: Perfil del usuario autenticado
    404:
      description: Usuario no encontrado
  """
  return get_profile()
