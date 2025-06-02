from flask import Blueprint, request
from app.controllers.message_controller import (
    message_user,
    get_messages,
    delete_message
)
from flask_jwt_extended import jwt_required

message_bp = Blueprint('messages', __name__)

@message_bp.route('/messages', methods=['GET'])
@jwt_required()
def route_get_messages():
    """
    Obtener mensajes
    ---
    tags:
      - Mensajes
    security:
      - Bearer: []
    responses:
      200:
        description: Lista de mensajes
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
              mensaje:
                type: string
    """
    return get_messages()

@message_bp.route('/message', methods=['POST'])
@jwt_required()
def route_create_message():
    """
    Enviar mensaje
    ---
    tags:
      - Mensajes
    security:
      - Bearer: []
    parameters:
      - in: body
        name: mensaje
        required: true
        schema:
          type: object
          properties:
            nombre:
              type: string
            correo:
              type: string
            mensaje:
              type: string
    responses:
      201:
        description: Mensaje enviado correctamente
    """
    data = request.get_json()
    return message_user(data)

@message_bp.route('/message/<int:id>', methods=['DELETE'])
@jwt_required()
def route_delete_message(id):
    """
    Eliminar mensaje por ID
    ---
    tags:
      - Mensajes
    security:
      - Bearer: []
    parameters:
      - in: path
        name: id
        required: true
        type: integer
    responses:
      200:
        description: Mensaje eliminado correctamente
    """
    return delete_message(id)
