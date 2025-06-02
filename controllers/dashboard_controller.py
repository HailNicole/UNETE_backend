from flask import jsonify
from app.extensions import db

def sales_report():
    try:
        cursor = db.connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT DATE(fecha) AS fecha, SUM(total) AS total_ventas
            FROM ordenes
            GROUP BY DATE(fecha)
            ORDER BY fecha DESC
        """)
        sales = cursor.fetchall()
        cursor.close()
        return jsonify(sales), 200
    except Exception as e:
        return jsonify({"error": "Error al obtener el reporte de ventas"}), 500

def products_report():
    try:
        cursor = db.connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT categoria, COUNT(*) AS total_productos
            FROM productos
            GROUP BY categoria
        """)
        report = cursor.fetchall()
        cursor.close()
        return jsonify(report), 200
    except Exception as e:
        return jsonify({"error": "Error al obtener el reporte de productos"}), 500
    
def get_dashboard_data():
    sales = sales_report()
    products = products_report()

    if sales is None or products is None:
        return jsonify({"error": "Error al obtener los datos del dashboard"}), 500

    return jsonify({
        "sales_report": sales,
        "products_report": products
    }), 200