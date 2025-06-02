from flask import Blueprint, request
from app.controllers.order_controller import (
    create_order,
    get_all_orders,
    get_user_orders
)
from flask_jwt_extended import jwt_required

order_bp = Blueprint('orders', __name__)

@order_bp.route('/orders', methods=['GET'])
@jwt_required()
def route_get_orders():
    """
    Obtener todas las órdenes
    ---
    tags:
      - Órdenes
    security:
      - Bearer: []
    responses:
      200:
        description: Lista de órdenes
        schema:
          type: array
          items:
            type: object
            properties:
              user_id:
                type: integer
              total:
                type: number
    """
    return get_all_orders()

@order_bp.route('/order/<int:id>', methods=['GET'])
@jwt_required()
def route_get_order(id):
    """
    Obtener orden por ID
    ---
    tags:
      - Órdenes
    security:
      - Bearer: []
    parameters:
      - in: path
        name: id
        required: true
        type: integer
    responses:
      200:
        description: Detalle de la orden
        schema:
          items:
            type: object
            properties:
              user_id:
                type: integer
              total:
                type: number
    """
    return get_user_orders(id)

@order_bp.route('/order', methods=['POST'])
@jwt_required()
def route_create_order():
    """
    Crear una nueva orden
    ---
    tags:
      - Órdenes
    security:
      - Bearer: []
    parameters:
      - in: body
        name: orden
        required: true
        schema:
          type: object
          required:
            - user_id
            - total
          properties:
            user_id:
              type: integer
            total:
              type: number
    responses:
      201:
        description: Orden creada
    """
    data = request.get_json()
    return create_order(data)

#@order_bp.route('/order/<int:id>', methods=['PATCH'])
#@jwt_required()
#def route_update_order(id):
#    data = request.get_json()
#    return update_order_status(id, data)
