import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'supersecretkey')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwtsecretkey')

    # Configuración para flask_mysqldb
    MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost')
    MYSQL_USER = os.environ.get('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', 'password')
    MYSQL_DB = os.environ.get('MYSQL_DB', 'mydatabase')
    MYSQL_PORT = int(os.environ.get('MYSQL_PORT', 3306))  # Opcional, puerto por defecto 3306

    UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'uploads')
    MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 100 MB
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
