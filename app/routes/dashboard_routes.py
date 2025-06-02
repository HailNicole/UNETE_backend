from flask import Blueprint
from app.controllers.dashboard_controller import get_dashboard_data
from flask_jwt_extended import jwt_required

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def route_get_dashboard():
    """
    Obtener datos del dashboard
    ---
    tags:
      - Dashboard
    responses:
      200:
        description: Estadísticas generales
    """
    return get_dashboard_data()
