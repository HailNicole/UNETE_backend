from app import create_app
from app.extensions import db
from flasgger import Swagger

app = create_app()

# Configuración Swagger
swagger_template = {
    "swagger": "2.0",
    "info": {
        "title": "UNETE API",
        "description": "Documentación de la API de la plataforma UNETE",
        "version": "1.0"
    },
    "basePath": "/",  # Prefijo para todas las rutas
    "schemes": [
        "http"
    ],
}
swagger = Swagger(app, template=swagger_template)

def check_database_connection():
    with app.app_context():
        try:
            # Usamos el objeto db de flask_mysqldb para obtener la conexión
            conn = db.connection
            cursor = conn.cursor()
            cursor.execute("SELECT 1")  # consulta simple para validar conexión
            cursor.close()
            print("Conectado a la base de datos MySQL")
        except Exception as e:
            print("Error al conectar a la base de datos:", e)
            exit(1)

if __name__ == '__main__':
    #check_database_connection()
    app.run(debug=True, port=3000)
