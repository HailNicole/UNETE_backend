from flask import Flask
from config import Config
from app.extensions import db, jwt, cors

# Importar Blueprints
from app.routes.user_routes import user_bp
from app.routes.products_routes import products_bp
from app.routes.order_routes import order_bp
from app.routes.message_routes import message_bp
from app.routes.dashboard_routes import dashboard_bp

def create_app():
    app = Flask(__name__)
    
    # Cargar configuración desde config.py
    app.config.from_object(Config)

    # Inicializar extensiones
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)  # Ya no uses CORS(app) directamente

    # Registrar Blueprints
    app.register_blueprint(user_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(message_bp)
    app.register_blueprint(dashboard_bp)

    return app
