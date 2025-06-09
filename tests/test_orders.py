import unittest
from app import create_app
from app.extensions import db
from app.controllers.order_controller import create_order, get_all_orders

class TestOrderController(unittest.TestCase):

    def setUp(self):
        self.app = create_app()

    def test_create_order_incompleto(self):
        with self.app.test_request_context(json={"user_id": 1}):
            response, status = create_order()
            print("Orden Invalida:", response.get_json())
            self.assertEqual(status, 400)
            print("Status:", status)

    def test_create_order_valido(self):
        with self.app.test_request_context(json={"user_id": 8, "id_product": 4, "cant": 2, "price": 4.50}):
            response, status = create_order()
            print("Orden:", response.get_json())
            self.assertEqual(status, 201)
            print("Status:", status)
            self.assertIn("order_id", response.get_json()) 
            
    def test_get_all_orders(self):
        with self.app.app_context():
            response, status = get_all_orders()
            print("Pedidos:", response.get_json())
            self.assertEqual(status, 200)
            print("Status:", status)
            self.assertIsInstance(response.get_json(), list)

if __name__ == '__main__':
    unittest.main()
