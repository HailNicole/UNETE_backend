import unittest
from app import create_app
from app.extensions import db
from app.controllers.products_controller import insert_product

class TestProductController(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def test_insert_product_invalido(self):
        data = {"name": "Labial Avon"}
        with self.app.app_context():
            response, status = insert_product(data)
            print("Producto Invalido:", response.get_json())
            self.assertEqual(status, 400)
            print("Status:", status) 

    def test_insert_product_valido(self):
        data = {
            "name": "Falda",
            "price": "4.50",
            "stock": "12",
            "category": "Ropa",
            "filename": "falda.png"
        }
        with self.app.app_context():
            response, status = insert_product(data)
            print("Producto:", response.get_json())
            self.assertEqual(status, 201)
            print("Status:", status)
            self.assertIn("id", response.get_json()) 

if __name__ == '__main__':
    unittest.main()
