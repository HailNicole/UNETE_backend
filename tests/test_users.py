import unittest
from app import create_app
from app.extensions import db
from app.controllers.user_controller import create_user, login_user, get_users

class TestUserRealDB(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def test_create_user_valido(self):
        payload = {
            "nombre": "Usuario5",
            "correo": "usuario5@gmail.com",
            "contrasena": "q1w2e3"
        }

        with self.app.test_request_context(json=payload):
            response, status = create_user()
            self.assertEqual(status, 201)
            self.assertIn("message", response.json)
            print("Respuesta:", response.get_json())
            print("Status:", status)
    
    def test_create_user_incompleto(self):
        payload = {
            "nombre": "usuario3"
        }

        with self.app.test_request_context(json=payload):
            response, status = create_user()
            print("Respuesta incompleta:", response.get_json())
            self.assertEqual(status, 400)
            self.assertIn("error", response.get_json())
            print("Status:", status)
            
    def test_login_user_invalido(self):
        payload = {
            "correo": "falso@gmail.com",
            "contrasena": "incorrecta"
        }

        with self.app.test_request_context(json=payload):
            response, status = login_user()
            print("Login inválido:", response.get_json())
            self.assertEqual(status, 401)
            print("Status:", status) 

    def test_login_user_valido(self):

        with self.app.test_request_context(json={
            "correo": "usuario2@gmail.com",
            "contrasena": "56789"
        }):
            response, status = login_user()
            print("Login válido:", response.get_json())
            self.assertEqual(status, 200)
            self.assertIn("token", response.get_json())
            print("Status:", status)
    
    def test_get_users(self):
        with self.app.app_context():
            response, status = get_users()
            print("Usuarios:", response.get_json())
            self.assertEqual(status, 200)
            print("Status:", status)
            self.assertIsInstance(response.get_json(), list)

if __name__ == '__main__':
    unittest.main()
