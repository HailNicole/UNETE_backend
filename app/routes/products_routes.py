from flask import Blueprint, request, jsonify, current_app
from app.controllers.products_controller import (
    insert_product,
    get_product,
    get_products,
    edit_product,
    delete_product
)
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
import os
from app.utils.helpers import allowed_file

products_bp = Blueprint('products', __name__)

@products_bp.route('/product', methods=['POST'])
@jwt_required()
def route_insert_product():
    """
    Crear nuevo producto
    ---
    tags:
      - Productos
    security:
      - Bearer: []
    consumes:
      - multipart/form-data
    parameters:
      - in: formData
        name: name
        type: string
        required: true
      - in: formData
        name: price
        type: number
        required: true
      - in: formData
        name: stock
        type: integer
        required: true
      - in: formData
        name: category
        type: string
        required: true
      - in: formData
        name: filename
        type: file
        required: true
    responses:
      201:
        description: Producto creado exitosamente
      400:
        description: Datos inválidos, Todos los campos son obligatorios
    """
    
    if 'imagen' not in request.files:
        return jsonify({"error": "Imagen requerida"}), 400
    
    image = request.files['imagen']

    if image.filename == '':
        return jsonify({"error": "No se seleccionó ningún archivo"}), 400

    if not allowed_file(image.filename):
        return jsonify({"error": "Tipo de archivo no permitido"}), 400

    filename = secure_filename(image.filename)
    image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    image.save(image_path)

    data = request.form.to_dict()
    data['filename'] = filename

    return insert_product(data)

@products_bp.route('/product/<int:id>', methods=['GET'])
def route_get_product(id):
    """
    Obtener un producto por ID
    ---
    tags:
      - Productos
    parameters:
      - in: path
        name: id
        required: true
        type: integer
    responses:
      200:
        description: Detalle del producto
        schema:
          items:
            type: object
            properties:
              id:
                type: integer
              name:
                type: string
              price:
                type: number
              stock:
                type: integer
              category:
                type: string
              filename:
                type: string
      404:
        description: Producto no encontrado
    """
    return get_product(id)

@products_bp.route('/products', methods=['GET'])
def route_get_products():
    """
    Listar todos los productos
    ---
    tags:
      - Productos
    responses:
      200:
        description: Lista de productos
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
              name:
                type: string
              price:
                type: number
              stock:
                type: integer
              category:
                type: string
              filename:
                type: string
    """
    return get_products()

@products_bp.route('/product/<int:id>', methods=['PATCH'])
@jwt_required()
def route_edit_product(id):
    """
    Editar producto existente
    ---
    tags:
      - Productos
    security:
      - Bearer: []
    consumes:
      - multipart/form-data
    parameters:
      - in: path
        name: id
        type: integer
        required: true
      - in: formData
        name: name
        type: string
      - in: formData
        name: price
        type: number
      - in: formData
        name: stock
        type: integer
      - in: formData
        name: category
        type: string
      - in: formData
        name: filename
        type: file
    responses:
      200:
        description: Producto actualizado exitosamente
    """
    data = request.form.to_dict()
    filename = None

    if 'imagen' in request.files:
        image = request.files['imagen']
        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            image.save(image_path)

    return edit_product(id, data, filename)

@products_bp.route('/product/<int:id>', methods=['DELETE'])
@jwt_required()
def route_delete_product(id):
    """
    Eliminar producto por ID
    ---
    tags:
      - Productos
    security:
      - Bearer: []
    parameters:
      - in: path
        name: id
        required: true
        type: integer
    responses:
      200:
        description: Producto eliminado exitosamente
    """
    return delete_product(id)
